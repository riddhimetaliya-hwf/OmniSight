import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SystemNode } from '../types';

interface GeographicViewProps {
  systems: SystemNode[];
  onSystemClick: (system: SystemNode) => void;
}

const defaultPosition: [number, number] = [39.8283, -98.5795]; // Center of USA

const GeographicView: React.FC<GeographicViewProps> = ({ systems, onSystemClick }) => {
  const systemsWithLocation = systems.filter(s => s.location);

  return (
    <div className="w-full h-full">
      <MapContainer center={defaultPosition} zoom={4} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {systemsWithLocation.map(system => (
          <Marker
            key={system.id}
            position={[system.location!.latitude, system.location!.longitude]}
            eventHandlers={{
              click: () => onSystemClick(system)
            }}
          >
            <Popup>
              <div>
                <strong>{system.label}</strong><br />
                {system.location?.address || ''}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GeographicView; 