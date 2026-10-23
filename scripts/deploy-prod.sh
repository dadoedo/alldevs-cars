#!/usr/bin/env bash
set -euo pipefail

SHA="${1:?Usage: deploy-prod.sh <git-sha>}"
COMPOSE_DIR="/root/carart"
IMAGE="ghcr.io/dadoedo/alldevs-cars"
SERVICE="app"
CONTAINER="carart-app"
MAX_RETRIES="${HEALTH_RETRIES:-30}"
RETRY_INTERVAL="${HEALTH_INTERVAL:-2}"
GHCR_USER="${GHCR_USER:-dadoedo}"

cd "$COMPOSE_DIR"

if [ ! -f docker-compose.yml ]; then
  echo "Missing ${COMPOSE_DIR}/docker-compose.yml" >&2
  exit 1
fi

if [ ! -t 0 ]; then
  docker login ghcr.io -u "$GHCR_USER" --password-stdin
elif ! docker manifest inspect "${IMAGE}:${SHA}" >/dev/null 2>&1; then
  echo "Not logged in to GHCR and no token on stdin; cannot pull ${IMAGE}:${SHA}" >&2
  exit 1
fi

if docker inspect "$CONTAINER" >/dev/null 2>&1; then
  CURRENT_IMAGE="$(docker inspect -f '{{.Image}}' "$CONTAINER")"
  docker tag "$CURRENT_IMAGE" "${IMAGE}:rollback"
  echo "Tagged running image as ${IMAGE}:rollback"
fi

echo "Pulling ${IMAGE}:${SHA}..."
docker pull "${IMAGE}:${SHA}"
docker tag "${IMAGE}:${SHA}" "${IMAGE}:latest"

export IMAGE_TAG="$SHA"

echo "Starting ${SERVICE} with IMAGE_TAG=${IMAGE_TAG}..."
docker compose up -d --no-build --no-deps "$SERVICE"

health_ok() {
  if docker exec "$CONTAINER" wget -q --spider http://127.0.0.1:3000/ 2>/dev/null; then
    return 0
  fi
  docker exec "$CONTAINER" node -e "
    fetch('http://127.0.0.1:3000/')
      .then((r) => process.exit(r.ok ? 0 : 1))
      .catch(() => process.exit(1));
  " 2>/dev/null
}

echo "Waiting for homepage health check..."
for _ in $(seq 1 "$MAX_RETRIES"); do
  if health_ok; then
    echo "Health check passed."
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi
  sleep "$RETRY_INTERVAL"
done

echo "Health check failed; rolling back to ${IMAGE}:rollback..." >&2
export IMAGE_TAG=rollback
docker compose up -d --no-build --no-deps "$SERVICE"
exit 1
