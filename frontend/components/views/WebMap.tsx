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
import type { MapWrapperProps } from './MapWrapper';
import { catchesService, type Catch as LoggedCatch } from '../../services/catches';

const LeafletMapContainer = MapContainer as any;
const LeafletMarker = Marker as any;
const LeafletTileLayer = TileLayer as any;

const userPinsPost = 'https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/userPinsPost';
const userPinsGet = 'https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/userPinsGet';
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
    id: string;
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
                               selectionMode,
                               onSelectCoordinate,
                           }: {
    onRightClick: (lat: number, lng: number, e: MouseEvent) => void;
    selectionMode?: boolean;
    onSelectCoordinate?: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        contextmenu(e) {
            if (selectionMode) {
                onSelectCoordinate?.(e.latlng.lat, e.latlng.lng);
                return;
            }

            onRightClick(e.latlng.lat, e.latlng.lng, e.originalEvent);
        },
    });

    return null;
}

function SelectCoordinateHandler({
                                     selectionMode,
                                     onSelectCoordinate,
                                 }: {
    selectionMode?: boolean;
    onSelectCoordinate?: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            if (selectionMode) {
                onSelectCoordinate?.(e.latlng.lat, e.latlng.lng);
            }
        },
    });

    return null;
}

export default function WebMap({
                                   selectionMode = false,
                                   selectedCoordinate,
                                   onSelectCoordinate,
                               }: MapWrapperProps) {
    const [pins, setPins] = useState<Pin[]>([]);
    const [mappedCatches, setMappedCatches] = useState<LoggedCatch[]>([]);

    const [govLakes, setGovLakes] = useState<GovLake[]>([]);

    const [menu, setMenu] = useState<{
        lat: number;
        lng: number;
        x: number;
        y: number;
        pinId?: string;
    } | null>(null);

    const [pendingPin, setPendingPin] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const [editingPinId, setEditingPinId] = useState<string | null>(null);

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
                console.error('Error fetching government lakes:', err);
            });
    }, []);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            console.error('No username found');
            return;
        }

        fetch(`${userPinsGet}?Username=${encodeURIComponent(username)}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('User pins:', data);
                setPins(data);
            })
            .catch((err) => {
                console.error('Error fetching user pins:', err);
            });
    }, []);

    useEffect(() => {
        const loadMappedCatches = async () => {
            try {
                const myCatches = await catchesService.getMyCatches(true);
                setMappedCatches(myCatches.filter((item) => (
                    typeof item.latitude === 'number' &&
                    typeof item.longitude === 'number'
                )));
            } catch (err) {
                console.error('Error fetching catch map points:', err);
            }
        };

        loadMappedCatches();
        return catchesService.subscribe(loadMappedCatches);
    }, []);


    const savePin = async () => {
        if (!pendingPin) return;

        const username = localStorage.getItem('username');
        if (!username) {
            console.error('No username found');
            return;
        }

        const pinId = editingPinId || Date.now().toString();

        try {
            const res = await fetch(userPinsPost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Username: username, // temp name
                    pinId: pinId,
                    lat: pendingPin.lat,
                    lng: pendingPin.lng,
                    catches: [...catches, currentCatch]
                        .filter(c => c.species)
                        .map(c => ({
                            species: c.species,
                            bait: c.bait,
                            size: c.size,
                            weight: c.weight,
                        })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Save failed:', data);
                return;
            }

            console.log('Saved to backend:', data);

            // refresh the pins
            const refresh = await fetch(
                `${userPinsGet}?Username=${encodeURIComponent(username)}`
            );
            const pinsData = await refresh.json();
            setPins(pinsData);

            // set UI
            setCatches([]);
            setCurrentCatch({
                species: '',
                bait: '',
                size: '',
                weight: '',
            });

            setPendingPin(null);
            setEditingPinId(null);

        } catch (err) {
            console.error('Error saving pin:', err);
        }
    };

    const userPinsDelete = 'https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/deleteUserPins';

    const deletePin = async (id: string) => {
        try {
            const username = localStorage.getItem('username');
            if (!username) {
                console.error('No username found');
                return;
            }
            const res = await fetch(
                `${userPinsDelete}?Username=${encodeURIComponent(username)}&pinId=${encodeURIComponent(id)}`,
                {
                    method: 'DELETE',
                }
            );

            const data = await res.json();

            if (!res.ok) {
                console.error('Delete failed:', data);
                return;
            }

            console.log('Deleted from backend:', data);

            setPins((prev) => prev.filter((p) => p.id !== id));
            setMenu(null);
        } catch (err) {
            console.error('Error deleting pin:', err);
        }
    };

    /* Delete pin */
    /*const deletePin = (id: string) => {
        setPins((prev) => prev.filter((p) => p.id !== id));
        setMenu(null);
    };*/

    return (
        <div
            style={{ height: '100%', width: '100%', position: 'relative' }}
            onClick={() => setMenu(null)}
        >
            <LeafletMapContainer
                center={[47.6062, -122.3321]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
            >
                <LeafletTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <RightClickHandler
                    selectionMode={selectionMode}
                    onSelectCoordinate={(lat, lng) => onSelectCoordinate?.({
                        latitude: lat,
                        longitude: lng,
                    })}
                    onRightClick={(lat, lng, e) => {
                        setMenu({
                            lat,
                            lng,
                            x: e.clientX,
                            y: e.clientY,
                        });
                    }}
                />
                <SelectCoordinateHandler
                    selectionMode={selectionMode}
                    onSelectCoordinate={(lat, lng) => onSelectCoordinate?.({
                        latitude: lat,
                        longitude: lng,
                    })}
                />

                {govLakes.map((lake) => (
                    <LeafletMarker
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
                    </LeafletMarker>
                ))}

                {/* User Pins */}
                {pins.map((pin) => (
                    <LeafletMarker
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
                    </LeafletMarker>
                ))}

                {mappedCatches.map((catchData) => (
                    <LeafletMarker
                        key={`catch-${catchData.id}`}
                        position={[catchData.latitude as number, catchData.longitude as number]}
                    >
                        <Popup>
                            <div>
                                <strong>{catchData.fish}</strong>
                                <br />
                                {catchData.location}
                                <br />
                                {catchData.weight} lbs, {catchData.length} in
                                {catchData.bait ? (
                                    <>
                                        <br />
                                        Bait: {catchData.bait}
                                    </>
                                ) : null}
                            </div>
                        </Popup>
                    </LeafletMarker>
                ))}

                {selectedCoordinate && (
                    <LeafletMarker
                        key="selected-catch-coordinate"
                        position={[selectedCoordinate.latitude, selectedCoordinate.longitude]}
                    >
                        <Popup>
                            <div>
                                <strong>Selected catch point</strong>
                            </div>
                        </Popup>
                    </LeafletMarker>
                )}
            </LeafletMapContainer>

            {selectionMode && (
                <div
                    style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 1000,
                        background: 'white',
                        border: '1px solid #d7e2e8',
                        borderRadius: 8,
                        padding: '8px 10px',
                        color: '#334155',
                        fontSize: 13,
                        fontWeight: 700,
                        boxShadow: '0 6px 14px rgba(15, 23, 42, 0.12)',
                    }}
                >
                    Click the map to place this catch
                </div>
            )}

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
