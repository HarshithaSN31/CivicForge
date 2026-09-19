import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon paths in Vite bundlers
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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
  onLocationSelect?: (lat: number, lng: number) => void;
  isSelectable?: boolean;
  className?: string;
  showClusters?: boolean;
}

// Inner helper component to handle map click events in pick location mode
const MapLocationPicker: React.FC<{ onLocationSelect?: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

// Custom SVG icon generator for semantic status colors & clusters
function createCustomMarkerIcon(marker: MapMarkerData) {
  let color = '#2563EB'; // Default Blue
  if (marker.severity === 'CRITICAL') color = '#DC2626';
  else if (marker.severity === 'HIGH') color = '#EA580C';
  else if (marker.status === 'RESOLVED') color = '#16A34A';
  else if (marker.status === 'UNDER_REVIEW') color = '#D97706';

  if (marker.isIncident) {
    // Incident cluster icon with count
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

  // Standard report marker icon
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
 * Clean Abstracted Civic Map Component.
 * Pluggable map rendering engine decoupled from Leaflet/OpenStreetMap.
 */
export const CivicMap: React.FC<CivicMapProps> = ({
  center = [37.7749, -122.4194],
  zoom = 13,
  markers = [],
  selectedMarkerId,
  onMarkerClick,
  onLocationSelect,
  isSelectable = false,
  className = 'h-96 w-full',
}) => {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-civic-border shadow-civic ${className}`}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full">
        {/* OpenStreetMap Tile Layer - Abstracted Tile Provider */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {isSelectable && <MapLocationPicker onLocationSelect={onLocationSelect} />}

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
              icon={createCustomMarkerIcon(m)}
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
