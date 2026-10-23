#!/bin/sh
# Production deploy of carart.sk on alldevs-hetzner. Installed on the server as /root/carart/scripts/deploy-prod.sh
# and bound to the CI deploy key via an authorized_keys forced command (same pattern as frostbox), so that key
# cannot run anything else. The server NEVER builds: the image is only pulled from GHCR.
#
# Input (SSH_ORIGINAL_COMMAND or $1): a 40-hex commit SHA -> docker pull ghcr.io/dadoedo/alldevs-cars:<sha>
# GHCR login: the CI run's short-lived GITHUB_TOKEN arrives on stdin, is used in an isolated DOCKER_CONFIG
# (/root/carart-ci/docker) and deleted after the pull; the shared /root/.docker/config.json is not touched.
#
# Steps: tag the running image as :rollback, pull, recreate the container, health check (HTTP 200 inside the
# container on :3000, no host port is published). On failure, re-up the previous image (:rollback).
set -eu

DIR=/root/carart
IMAGE=ghcr.io/dadoedo/alldevs-cars
SERVICE=app
APP=carart-app
CI_DIR=/root/carart-ci

# Accepted inputs (anything else is rejected):
#   <sha>                                                         (manual: deploy-prod.sh <sha>)
#   GHCR_USER=<name> /root/carart/scripts/deploy-prod.sh <sha>    (exact command sent by .github/workflows/release.yml)
REQ=$(printf '%s' "${SSH_ORIGINAL_COMMAND:-${1:-}}" | tr -s '[:space:]' ' ' | sed 's/^ //; s/ $//')
if printf '%s' "$REQ" | grep -Eq '^[0-9a-f]{40}$'; then
  TAG=$REQ
elif printf '%s' "$REQ" | grep -Eq '^GHCR_USER=[A-Za-z0-9_-]+ /root/carart/scripts/deploy-prod\.sh [0-9a-f]{40}$'; then
  TAG=${REQ##* }
else
  echo "deploy: invalid request (expected 40-hex commit sha)" >&2; exit 2
fi

cd "$DIR"
[ -f docker-compose.yml ] || { echo "deploy: missing $DIR/docker-compose.yml" >&2; exit 1; }
install -d -m 700 "$CI_DIR"
exec 9>"$CI_DIR/.deploy.lock"
flock -w 600 9 || { echo "deploy: another deploy is running" >&2; exit 1; }

PREV_ID=$(docker inspect -f '{{.Image}}' "$APP" 2>/dev/null || true)
PREV_REF=$(docker inspect -f '{{.Config.Image}}' "$APP" 2>/dev/null || true)
if [ -n "$PREV_ID" ]; then docker tag "$PREV_ID" "$IMAGE:rollback"; fi
echo "deploy: ${PREV_REF:-none} -> $IMAGE:$TAG"

GHCR_TOKEN=
if [ ! -t 0 ]; then GHCR_TOKEN=$(head -c 4096 | tr -d '[:space:]'); fi
if [ -n "$GHCR_TOKEN" ]; then
  export DOCKER_CONFIG="$CI_DIR/docker"
  rm -rf "$DOCKER_CONFIG"; install -d -m 700 "$DOCKER_CONFIG"
  if ! printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u github-actions --password-stdin >/dev/null 2>&1; then
    rm -rf "$DOCKER_CONFIG"; echo "deploy: ghcr login failed" >&2; exit 1
  fi
fi
PULL_OK=1
docker pull -q "$IMAGE:$TAG" >/dev/null || PULL_OK=0
if [ -n "$GHCR_TOKEN" ]; then
  docker logout ghcr.io >/dev/null 2>&1 || true
  rm -rf "$DOCKER_CONFIG"; unset DOCKER_CONFIG
fi
unset GHCR_TOKEN
[ "$PULL_OK" = 1 ] || { echo "deploy: docker pull failed (no GHCR token on stdin / no access)" >&2; exit 1; }

health_ok() {
  image=$(docker inspect -f '{{.Config.Image}}' "$APP" 2>/dev/null || echo none)
  [ "$image" = "$IMAGE:$1" ] || return 1
  docker exec "$APP" wget -q -O /dev/null -T 5 http://127.0.0.1:3000/ >/dev/null 2>&1
}

wait_healthy() {
  i=0
  while [ "$i" -lt 40 ]; do
    if health_ok "$1"; then return 0; fi
    i=$((i + 1)); sleep 3
  done
  echo "deploy: not healthy (image=$(docker inspect -f '{{.Config.Image}}' "$APP" 2>/dev/null || echo none))" >&2
  return 1
}

if IMAGE_TAG="$TAG" docker compose up -d --no-build --no-deps --force-recreate "$SERVICE" && wait_healthy "$TAG"; then
  docker tag "$IMAGE:$TAG" "$IMAGE:latest"
  # drop old sha tags (keep current, :rollback, :latest)
  docker images "$IMAGE" --format '{{.Tag}}' | grep -vxE "$TAG|rollback|latest" | sed "s|^|$IMAGE:|" | xargs -r docker rmi >/dev/null 2>&1 || true
  docker image prune -f >/dev/null 2>&1 || true
  echo "deploy: OK $TAG"
  exit 0
fi

echo "deploy: FAILED, rolling back to ${PREV_REF:-none}" >&2
docker logs --tail 40 "$APP" 2>&1 | grep -viE 'secret|password|token|_URL|PASS' >&2 || true
if [ -z "$PREV_ID" ]; then
  echo "deploy: no previous image to roll back to, manual action needed" >&2
  exit 1
fi
IMAGE_TAG=rollback docker compose up -d --no-build --no-deps --force-recreate "$SERVICE" >&2 || true
wait_healthy rollback || echo "deploy: rollback also unhealthy, manual action needed" >&2
exit 1
