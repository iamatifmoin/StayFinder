
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  location: string;
  title: string;
}

const Map: React.FC<MapProps> = ({ location, title }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set the Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtYXRpZm1vaW4iLCJhIjoiY21ieHNtZGwwMTRjdjJrcXcyajNnYjBzMyJ9.LREogp0vVyClLKNhLH_Lpw';
    
    // Initialize map centered on Mumbai (since our mock property is in Mumbai)
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 12,
      center: [72.8777, 19.0760], // Mumbai coordinates
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add a marker for the property location
    const marker = new mapboxgl.Marker({
      color: '#3B82F6',
      scale: 1.2
    })
      .setLngLat([72.8777, 19.0760])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div class="p-2"><strong>${title}</strong><br/>${location}</div>`)
      )
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [location, title]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
