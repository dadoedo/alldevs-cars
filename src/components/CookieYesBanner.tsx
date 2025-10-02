'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    CookieYes: {
      init: () => void;
    };
  }
}

export default function CookieYesBanner() {
  useEffect(() => {
    // Load CookieYes script
    const script = document.createElement('script');
    script.src = 'https://cdn-cookieyes.com/client_data/dbaa68c47cd5f396572133b8/script.js';
    script.async = true;
    script.id = 'cookieyes';
    script.type = 'text/javascript';
    
    document.head.appendChild(script);

    // Initialize CookieYes when script loads
    script.onload = () => {
      if (window.CookieYes) {
        window.CookieYes.init();
      }
    };

    return () => {
      // Cleanup script on unmount
      const existingScript = document.getElementById('cookieyes');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
