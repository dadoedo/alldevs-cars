'use client';

import { useState, useEffect } from 'react';

interface Settings {
  site_name: string;
  site_description: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: string;
  google_maps_embed: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback na statické dáta ak API nefunguje
        setSettings({
          site_name: "Car & Art",
          site_description: "Váš spoľahlivý partner pre kúpu vozidla. Ponúkame kvalitné vozidlá za výhodné ceny s kompletným servisom a poradenstvom.",
          address: "Partizánska cesta 85, 974 01, Banská Bystrica",
          phone: "0910 662 069",
          email: "predaj.carart@gmail.com",
          opening_hours: "{\"monday\":\"8:00-17:00\",\"tuesday\":\"8:00-17:00\",\"wednesday\":\"8:00-17:00\",\"thursday\":\"8:00-17:00\",\"friday\":\"8:00-17:00\",\"saturday\":\"Zatvorené\",\"sunday\":\"Zatvorené\"}",
          google_maps_embed: "<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2605.123456789!2d18.123456!3d49.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDA3JzI0LjQiTiAxOMKwMDcnMjQuNCJF!5e0!3m2!1ssk!2ssk!4v1234567890123!5m2!1ssk!2ssk\" width=\"100%\" height=\"100%\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const getOpeningHours = () => {
    if (!settings?.opening_hours) return null;
    try {
      return JSON.parse(settings.opening_hours);
    } catch {
      return null;
    }
  };

  return {
    settings,
    loading,
    error,
    getOpeningHours
  };
}
