import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, GripHorizontal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Student {
  id: number;
  name: string;
  location: [number, number];
  zone?: string;
}

interface Zone {
  id: string;
  name: string;
  coordinates: [number, number][];
  color: string;
}

const DrawControl: React.FC<{ onMapClick: (e: L.LeafletMouseEvent) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const MapControls: React.FC<{ zoom: number; onZoomChange: (zoom: number) => void }> = ({ zoom, onZoomChange }) => {
  const map = useMap();

  useEffect(() => {
    map.setZoom(zoom);
  }, [zoom, map]);

  useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  return null;
};

const ZoneManagementSystem: React.FC = () => {
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [currentZone, setCurrentZone] = useState<[number, number][]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [zoneName, setZoneName] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showStudents, setShowStudents] = useState<boolean>(true);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [mapStyle, setMapStyle] = useState<string>('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  const [zoneColor, setZoneColor] = useState<string>('#3B82F6');
  const mapRef = useRef<L.Map | null>(null);
  const [isInteractingWithUI, setIsInteractingWithUI] = useState(false);

  useEffect(() => {
    setStudents([
      { id: 1, name: 'Student 1', location: [51.505, -0.09] },
      { id: 2, name: 'Student 2', location: [51.51, -0.1] },
      { id: 3, name: 'Student 3', location: [51.49, -0.08] },
    ]);
  }, []);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (drawingMode && !isInteractingWithUI) {
      setCurrentZone([...currentZone, [e.latlng.lat, e.latlng.lng]]);
    }
  };

  const saveZone = () => {
    if (currentZone.length > 2) {
      const newZone: Zone = { 
        id: Date.now().toString(), 
        name: zoneName || `Zone ${zones.length + 1}`, 
        coordinates: currentZone,
        color: zoneColor
      };
      setZones([...zones, newZone]);
      setCurrentZone([]);
      setDrawingMode(false);
      setZoneName('');
    } else {
      alert('A zone must have at least 3 points');
    }
  };

  const isPointInPolygon = (point: [number, number], polygon: [number, number][]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > point[1]) !== (yj > point[1])) &&
        (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const assignStudentsToZones = () => {
    const updatedStudents = students.map(student => {
      const assignedZone = zones.find(zone => 
        isPointInPolygon(student.location, zone.coordinates)
      );
      return { ...student, zone: assignedZone ? assignedZone.name : 'Unassigned' };
    });
    setStudents(updatedStudents);
  };

  const deleteZone = (zoneId: string) => {
    setZones(zones.filter(zone => zone.id !== zoneId));
    setSelectedZone(null);
  };

  const editZone = (zone: Zone) => {
    setSelectedZone(zone);
    setCurrentZone(zone.coordinates);
    setZoneName(zone.name);
    setZoneColor(zone.color);
    setDrawingMode(true);
    if (mapRef.current) {
      const bounds = L.latLngBounds(zone.coordinates);
      mapRef.current.fitBounds(bounds);
    }
  };

  const updateZone = () => {
    if (selectedZone) {
      const updatedZones = zones.map(zone =>
        zone.id === selectedZone.id ? { ...zone, name: zoneName, coordinates: currentZone, color: zoneColor } : zone
      );
      setZones(updatedZones);
      setSelectedZone(null);
      setCurrentZone([]);
      setDrawingMode(false);
      setZoneName('');
    }
  };

  const cancelDrawing = () => {
    setDrawingMode(false);
    setCurrentZone([]);
    setZoneName('');
    setSelectedZone(null);
  };

  const onZoomChange = (zoom: number) => {
    setMapZoom(zoom);
  };

  const customIcon = (color: string) => new L.Icon({
    iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(color)}" width="24" height="24"><circle cx="12" cy="12" r="10"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <div className="h-[calc(100vh-8rem)] w-full relative rounded-lg border border-gray-100">
    <MapContainer
      center={[51.505, -0.09]}
      zoom={mapZoom}
      className="h-full w-full"
      ref={mapRef}
      zoomControl={false}
    >
        <TileLayer url={mapStyle} />
        <DrawControl onMapClick={handleMapClick} />
        <MapControls zoom={mapZoom} onZoomChange={onZoomChange} />
        {zones.map((zone) => (
          <React.Fragment key={zone.id}>
            <Polygon 
              positions={zone.coordinates} 
              pathOptions={{ color: zone.color }}
              eventHandlers={{
                click: () => editZone(zone),
              }}
            />
            <Polygon 
              positions={zone.coordinates} 
              pathOptions={{ fillColor: 'transparent', color: 'transparent' }}
            >
              <Popup>{zone.name}</Popup>
            </Polygon>
          </React.Fragment>
        ))}
        {currentZone.map((point, index) => (
          <Marker key={index} position={point} icon={customIcon(zoneColor)} />
        ))}
        {showStudents && students.map((student) => (
          <Marker key={student.id} position={student.location}>
            <Popup>{`${student.name} - ${student.zone ?? 'Unassigned'}`}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <Draggable handle=".handle" bounds="parent">
        <Card 
          className="absolute top-4 left-4 w-80 shadow-xl"
          onMouseEnter={() => setIsInteractingWithUI(true)}
          onMouseLeave={() => setIsInteractingWithUI(false)}
        >
          <CardHeader className="handle cursor-move">
            <div className="flex items-center justify-between">
              <CardTitle>Zone Management</CardTitle>
              <GripHorizontal className="h-5 w-5 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[calc(100vh-8rem)] overflow-auto">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showStudents}
                  onCheckedChange={setShowStudents}
                  id="show-students"
                />
                <Label htmlFor="show-students">Show Students</Label>
              </div>
              <div className="relative">
                <Select onValueChange={(value) => setMapStyle(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Map Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">OpenStreetMap</SelectItem>
                    <SelectItem value="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}">Satellite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="map-zoom">Map Zoom</Label>
              <Slider
                id="map-zoom"
                min={1}
                max={18}
                step={1}
                value={[mapZoom]}
                onValueChange={([value]) => setMapZoom(value)}
              />
            </div>
            <div className="space-y-2">
              <Button onClick={() => setDrawingMode(!drawingMode)} className="w-full">
                {drawingMode ? 'Cancel Drawing' : 'Start Drawing Zone'}
              </Button>
              {drawingMode && (
                <div className="space-y-2">
                  <Input
                    placeholder="Zone Name"
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      value={zoneColor}
                      onChange={(e) => setZoneColor(e.target.value)}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Button onClick={selectedZone ? updateZone : saveZone} className="flex-grow">
                      {selectedZone ? 'Update Zone' : 'Save Zone'}
                    </Button>
                  </div>
                  <Button onClick={cancelDrawing} className="w-full">Cancel Drawing</Button>
                </div>
              )}
            </div>
            <Button onClick={assignStudentsToZones} className="w-full">Assign Students to Zones</Button>
            <div className="space-y-2">
              <h3 className="font-semibold">Zones</h3>
              {zones.map((zone) => (
                <div key={zone.id} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: zone.color }}></div>
                    <span>{zone.name}</span>
                  </div>
                  <div>
                    <Button onClick={() => editZone(zone)} variant="outline" size="sm" className="mr-2">Edit</Button>
                    <Button onClick={() => deleteZone(zone.id)} variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Draggable>

      {drawingMode && (
        <Alert className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Drawing Mode Active</AlertTitle>
          <AlertDescription>
            Click on the map to add points to your zone. Click 'Save Zone' when finished.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ZoneManagementSystem;