'use client';

import {useEffect, useRef} from 'react';
import {Loader} from '@googlemaps/js-api-loader';

interface MapProps {
  address: string;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

function Map({address}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    });

    loader.load().then(() => {
      if (window.google) {
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({address: address}, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const map = new window.google.maps.Map(
              mapRef.current as HTMLDivElement,
              {
                center: results[0].geometry.location,
                zoom: 8,
              }
            );
            new window.google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
            });
          } else {
            console.error(
              `Geocode was not successful for the following reason: ${status}`
            );
          }
        });
      }
    });
  }, [address]);

  return <div style={{height: '400px'}} ref={mapRef} />;
}

export default Map;
