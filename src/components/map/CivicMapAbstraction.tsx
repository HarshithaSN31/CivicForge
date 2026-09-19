import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';

export interface MapMarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  category?: string;
  status?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reportCount?: number;
  isIncident?: boolean;
}

export interface CivicMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarkerData[];
  selectedMarkerId?: string;
  onMarkerClick?: (marker: MapMarkerData) => void;
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  isSelectable?: boolean;
  className?: string;
  showClusters?: boolean;
}

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Reverse geocodes actual (lat, lng) coordinates using Google Geocoding API or fallback.
 */
export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<string> {
  if (GOOGLE_MAPS_KEY && window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        return response.results[0].formatted_address;
      }
    } catch {
      // Fall through to fallback
    }
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await res.json();
    if (data && data.display_name) {
      return data.display_name.split(',').slice(0, 3).join(',');
    }
  } catch {
    // Ignore fetch error
  }

  return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

// Leaflet fallback setup
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMapPicker: React.FC<{ onLocationSelect?: (lat: number, lng: number, address?: string) => void }> = ({
  onLocationSelect,
}) => {
  useMapEvents({
    async click(e) {
      if (onLocationSelect) {
        const address = await reverseGeocodeCoordinates(e.latlng.lat, e.latlng.lng);
        onLocationSelect(e.latlng.lat, e.latlng.lng, address);
      }
    },
  });
  return null;
};

function createLeafletIcon(marker: MapMarkerData) {
  let color = '#2563EB';
  if (marker.severity === 'CRITICAL') color = '#DC2626';
  else if (marker.severity === 'HIGH') color = '#EA580C';
  else if (marker.status === 'RESOLVED') color = '#16A34A';
  else if (marker.status === 'UNDER_REVIEW') color = '#D97706';

  if (marker.isIncident) {
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2"/>
        <circle cx="20" cy="20" r="12" fill="${color}"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="white" text-anchor="middle" font-family="sans-serif">${marker.reportCount || 1}</text>
      </svg>
    `;
    return L.divIcon({
      className: 'custom-incident-marker',
      html: svg,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }

  const svg = `
    <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0 C6.27 0 0 6.27 0 14 C0 24.5 14 36 14 36 C14 36 28 24.5 28 14 C28 6.27 21.73 0 14 0 Z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="14" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-report-marker',
    html: svg,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

/**
 * Google Maps Provider Implementation
 */
const GoogleMapImpl: React.FC<CivicMapProps> = ({
  center = [37.7749, -122.4194],
  zoom = 13,
  markers = [],
  onMarkerClick,
  onLocationSelect,
  isSelectable,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapObjRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: center[0], lng: center[1] },
      zoom,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      streetViewControl: false,
    });
    googleMapObjRef.current = map;

    if (isSelectable && onLocationSelect) {
      map.addListener('click', async (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          const address = await reverseGeocodeCoordinates(lat, lng);
          onLocationSelect(lat, lng, address);
        }
      });
    }

    markers.forEach((m) => {
      const markerObj = new window.google.maps.Marker({
        position: { lat: m.latitude, lng: m.longitude },
        map,
        title: m.title,
      });

      if (onMarkerClick) {
        markerObj.addListener('click', () => onMarkerClick(m));
      }
    });
  }, [center, zoom, markers, isSelectable, onLocationSelect, onMarkerClick]);

  return <div ref={mapRef} className={className} />;
};

/**
 * CivicMap Decoupled Interface Abstraction.
 * Decouples Google Maps Platform from Leaflet fallback.
 */
export const CivicMap: React.FC<CivicMapProps> = (props) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    if (GOOGLE_MAPS_KEY && !window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places,geocoding`;
      script.async = true;
      script.onload = () => setGoogleLoaded(true);
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      setGoogleLoaded(true);
    }
  }, []);

  const {
    center = [37.7749, -122.4194],
    zoom = 13,
    markers = [],
    onMarkerClick,
    onLocationSelect,
    isSelectable = false,
    className = 'h-96 w-full',
  } = props;

  if (GOOGLE_MAPS_KEY && googleLoaded) {
    return <GoogleMapImpl {...props} className={className} />;
  }

  // Abstracted Leaflet / OpenStreetMap fallback
  return (
    <div className={`relative overflow-hidden rounded-lg border border-civic-border shadow-civic ${className}`}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {isSelectable && <LeafletMapPicker onLocationSelect={onLocationSelect} />}

        {markers.map((m) => (
          <React.Fragment key={m.id}>
            {m.isIncident && (
              <Circle
                center={[m.latitude, m.longitude]}
                radius={250}
                pathOptions={{
                  color: m.severity === 'CRITICAL' ? '#DC2626' : '#2563EB',
                  fillColor: m.severity === 'CRITICAL' ? '#DC2626' : '#2563EB',
                  fillOpacity: 0.15,
                  weight: 1.5,
                  dashArray: '4, 4',
                }}
              />
            )}
            <Marker
              position={[m.latitude, m.longitude]}
              icon={createLeafletIcon(m)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(m),
              }}
            >
              <Popup>
                <div className="p-3 max-w-xs font-sans">
                  <span className="inline-block px-2 py-0.5 mb-1.5 text-xs font-semibold rounded bg-slate-100 text-slate-800">
                    {m.category || 'Civic Problem'}
                  </span>
                  <h4 className="text-sm font-bold text-civic-navy leading-tight mb-1">{m.title}</h4>
                  {m.isIncident ? (
                    <p className="text-xs text-slate-600 font-medium mb-1">
                      Possible Incident ({m.reportCount} related reports)
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 mb-1">Status: {m.status || 'REPORTED'}</p>
                  )}
                  {onMarkerClick && (
                    <button
                      onClick={() => onMarkerClick(m)}
                      className="mt-2 text-xs font-semibold text-civic-accent hover:underline inline-flex items-center gap-1"
                    >
                      View Details &rarr;
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};
