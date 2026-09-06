import { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize, Minimize } from 'lucide-react';
import './MapContainer.css';

const MapContainer = ({
  center = [20.5937, 78.9629],
  zoom = 5,
  markers = [],
  clusters = [],
  height = 400,
  className = '',
  onMarkerClick,
  onClusterClick,
  readOnly = false
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== 'undefined' && window.L) {
        setMapLoaded(true);
      } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
    };
    initMap();
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || typeof window === 'undefined' || !window.L) return;

    const map = window.L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: !readOnly,
      scrollWheelZoom: !readOnly,
      dragging: !readOnly,
      doubleClickZoom: !readOnly,
      boxZoom: !readOnly,
      keyboard: !readOnly,
      tap: !readOnly
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    markers.forEach(marker => {
      const m = window.L.marker(marker.position, { icon: createCustomIcon(marker.color) })
        .addTo(map)
        .bindPopup(marker.popup);
      
      if (onMarkerClick) {
        m.on('click', () => onMarkerClick(marker));
      }
    });

    return () => {
      map.remove();
    };
  }, [mapLoaded, center, zoom, markers, onMarkerClick, readOnly]);

  const createCustomIcon = (color = '#2E7D32') => {
    if (!window.L) return null;
    return window.L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
  };

  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div className={`map-container ${fullscreen ? 'map-container--fullscreen' : ''} ${className}`} style={{ height: fullscreen ? '100vh' : height }}>
      <div className="map-container__header">
        <h3 className="map-container__title">Disease Hotspot Map</h3>
        <button
          className="map-container__fullscreen-btn"
          onClick={handleFullscreenToggle}
          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
      <div 
        ref={mapRef} 
        className="map-container__map"
        role="application"
        aria-label="Interactive disease hotspot map"
      >
        {!mapLoaded && (
          <div className="map-container__loading">
            <div className="map-container__spinner" />
            <p>Loading map...</p>
          </div>
        )}
      </div>
      <div className="map-container__legend">
        <div className="map-container__legend-item">
          <span className="map-container__legend-marker" style={{ backgroundColor: '#EF5350' }} />
          <span>High Risk</span>
        </div>
        <div className="map-container__legend-item">
          <span className="map-container__legend-marker" style={{ backgroundColor: '#FFA726' }} />
          <span>Medium Risk</span>
        </div>
        <div className="map-container__legend-item">
          <span className="map-container__legend-marker" style={{ backgroundColor: '#66BB6A' }} />
          <span>Low Risk</span>
        </div>
        <div className="map-container__legend-item">
          <span className="map-container__legend-marker map-container__legend-marker--cluster" />
          <span>Cluster</span>
        </div>
      </div>
    </div>
  );
};

MapContainer.displayName = 'MapContainer';

export { MapContainer };