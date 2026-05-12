import { useState, useEffect } from 'react';
import L from 'leaflet';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/* Leaflet icons */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Government icon */
const governmentLakeIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
});

/* Types */
type Catch = {
    species: string;
    bait: string;
    size: string;
    weight: string;
};

type Pin = {
    id: number;
    lat: number;
    lng: number;
    catches: Catch[];
};

type GovLake = {
    lakeId: string;
    name: string;
    lat: number;
    long: number;
};

/* Right-click handler */
function RightClickHandler({
                               onRightClick,
                           }: {
    onRightClick: (lat: number, lng: number, e: MouseEvent) => void;
}) {
    useMapEvents({
        contextmenu(e) {
            onRightClick(e.latlng.lat, e.latlng.lng, e.originalEvent);
        },
    });

    return null;
}

export default function WebMap() {
    const [pins, setPins] = useState<Pin[]>([]);

    const [govLakes, setGovLakes] = useState<GovLake[]>([]);

    const [menu, setMenu] = useState<{
        lat: number;
        lng: number;
        x: number;
        y: number;
        pinId?: number;
    } | null>(null);

    const [pendingPin, setPendingPin] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const [editingPinId, setEditingPinId] = useState<number | null>(null);

    /* Catch building */
    const [catches, setCatches] = useState<Catch[]>([]);
    const [currentCatch, setCurrentCatch] = useState<Catch>({
        species: '',
        bait: '',
        size: '',
        weight: '',
    });

    useEffect(() => {
        fetch('https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/govPin')
            .then((res) => res.json())
            .then((data) => {
                console.log('Government Lakes:', data);
                setGovLakes(data);
            })
            .catch((err) => {
                console.error('Error fetching government lskes:', err);
            });
    }, []);

    /* Save pin or add catch */
    const savePin = () => {
        if (!pendingPin) return;

        if (editingPinId) {
            setPins((prev) =>
                prev.map((p) =>
                    p.id === editingPinId
                        ? {
                            ...p,
                            catches: [...p.catches, ...catches, currentCatch],
                        }
                        : p
                )
            );
        } else {
            setPins((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    lat: pendingPin.lat,
                    lng: pendingPin.lng,
                    catches: [...catches, currentCatch],
                },
            ]);
        }

        // reset
        setCatches([]);
        setCurrentCatch({
            species: '',
            bait: '',
            size: '',
            weight: '',
        });

        setEditingPinId(null);
        setPendingPin(null);
    };

    /* Delete pin */
    const deletePin = (id: number) => {
        setPins((prev) => prev.filter((p) => p.id !== id));
        setMenu(null);
    };

    return (
        <div
            style={{ height: '100%', width: '100%', position: 'relative' }}
            onClick={() => setMenu(null)}
        >
            <MapContainer
                center={[47.6062, -122.3321]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <RightClickHandler
                    onRightClick={(lat, lng, e) => {
                        setMenu({
                            lat,
                            lng,
                            x: e.clientX,
                            y: e.clientY,
                        });
                    }}
                />

                {govLakes.map((lake) => (
                    <Marker
                        key={lake.lakeId}
                        position={[
                            Number(lake.lat),
                            Number(lake.long),
                        ]}
                        icon={governmentLakeIcon}
                    >
                        <Popup>
                            <div>
                                <strong>{lake.name}</strong>
                                <br />

                                <a
                                    href={`https://wdfw.wa.gov/fishing/locations/lowland-lakes/${lake.lakeId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View WDFW Page
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* User Pins */}
                {pins.map((pin) => (
                    <Marker
                        key={pin.id}
                        position={[pin.lat, pin.lng]}
                        eventHandlers={{
                            contextmenu: (e) => {
                                e.originalEvent.preventDefault();
                                setMenu({
                                    lat: pin.lat,
                                    lng: pin.lng,
                                    x: e.originalEvent.clientX,
                                    y: e.originalEvent.clientY,
                                    pinId: pin.id,
                                });
                            },
                        }}
                    >
                        <Popup>
                            <div>
                                <strong>Fishing Spot</strong>
                                {pin.catches.map((c, i) => (
                                    <div key={i} style={{ marginTop: 6 }}>
                                        <strong>{c.species}</strong><br />
                                        Bait: {c.bait}<br />
                                        Size: {c.size}<br />
                                        Weight: {c.weight}
                                    </div>
                                ))}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Right-click menu */}
            {menu && (
                <div
                    style={{
                        position: 'absolute',
                        top: menu.y,
                        left: menu.x,
                        background: 'white',
                        border: '1px solid #ccc',
                        padding: 8,
                        zIndex: 1000,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Create new pin */}
                    <div
                        style={{ padding: 4, cursor: 'pointer' }}
                        onClick={() => {
                            setPendingPin({ lat: menu.lat, lng: menu.lng });
                            setEditingPinId(null);
                            setMenu(null);
                        }}
                    >
                        ➕ Add Pin
                    </div>

                    {/* Add catch to existing pin */}
                    {menu.pinId && (
                        <div
                            style={{ padding: 4, cursor: 'pointer' }}
                            onClick={() => {
                                setPendingPin({ lat: menu.lat, lng: menu.lng });
                                setEditingPinId(menu.pinId);
                                setMenu(null);
                            }}
                        >
                            🎣 Add Catch
                        </div>
                    )}

                    {/* Delete */}
                    {menu.pinId && (
                        <div
                            style={{ padding: 4, cursor: 'pointer', color: 'red' }}
                            onClick={() => deletePin(menu.pinId)}
                        >
                            Delete Pin
                        </div>
                    )}
                </div>
            )}

            {/* Form */}
            {pendingPin && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        padding: 20,
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        zIndex: 2000,
                        width: 300,
                    }}
                >
                    <h3>
                        {editingPinId ? "Add Catch" : "Create Pin"}
                    </h3>

                    <input
                        placeholder="Fish Species"
                        value={currentCatch.species}
                        onChange={(e) =>
                            setCurrentCatch({ ...currentCatch, species: e.target.value })
                        }
                    />

                    <input
                        placeholder="Bait Used"
                        value={currentCatch.bait}
                        onChange={(e) =>
                            setCurrentCatch({ ...currentCatch, bait: e.target.value })
                        }
                    />

                    <input
                        placeholder="Size"
                        value={currentCatch.size}
                        onChange={(e) =>
                            setCurrentCatch({ ...currentCatch, size: e.target.value })
                        }
                    />

                    <input
                        placeholder="Weight"
                        value={currentCatch.weight}
                        onChange={(e) =>
                            setCurrentCatch({ ...currentCatch, weight: e.target.value })
                        }
                    />

                    {/* Add another catch */}
                    <button
                        onClick={() => {
                            setCatches((prev) => [...prev, currentCatch]);
                            setCurrentCatch({
                                species: '',
                                bait: '',
                                size: '',
                                weight: '',
                            });
                        }}
                        style={{ marginTop: 8 }}
                    >
                        ➕ Add Another Catch
                    </button>

                    {/* Show added catches */}
                    {catches.map((c, i) => (
                        <div key={i} style={{ marginTop: 6 }}>
                             {c.species}
                        </div>
                    ))}

                    <div style={{ marginTop: 10 }}>
                        <button onClick={savePin}>Save</button>
                        <button
                            onClick={() => setPendingPin(null)}
                            style={{ marginLeft: 10 }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}