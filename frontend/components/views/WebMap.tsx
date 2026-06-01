import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import L from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';
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
import { authService } from '../../services/auth';
import { colors } from '../../constants/colors';

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

const leafletMarkerShadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
const communityMarkerSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path fill="#3fd576" stroke="#166534" stroke-width="1.5" d="M12.5 1C6.1 1 1 6.2 1 12.6c0 8.7 11.5 27 11.5 27S24 21.3 24 12.6C24 6.2 18.9 1 12.5 1z"/>
        <circle cx="12.5" cy="12.5" r="4.4" fill="#f0fdf4"/>
    </svg>
`);
const communityFishingSpotIcon = new (L.Icon as any)({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${communityMarkerSvg}`,
    iconRetinaUrl: `data:image/svg+xml;charset=UTF-8,${communityMarkerSvg}`,
    shadowUrl: leafletMarkerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
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
    location?: string;
    locationName?: string;
    Location?: string;
    LocationName?: string;
    catches: Catch[];
};

type GovLake = {
    lakeId: string;
    name: string;
    lat: number;
    long: number;
};

const menuStyle: CSSProperties = {
    position: 'absolute',
    background: '#ffffff',
    border: '1px solid #d7e2e8',
    borderRadius: 8,
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.18)',
    overflow: 'hidden',
    padding: 4,
    minWidth: 150,
    zIndex: 1000,
};

const menuButtonStyle: CSSProperties = {
    width: '100%',
    border: 0,
    background: 'transparent',
    color: colors.primaryText,
    cursor: 'pointer',
    display: 'block',
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '18px',
    padding: '9px 11px',
    textAlign: 'left',
};

const dangerMenuButtonStyle: CSSProperties = {
    ...menuButtonStyle,
    color: colors.dangerText,
};

const pinFormOverlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    background: colors.modalBackdrop,
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    zIndex: 2000,
};

const pinFormStyle: CSSProperties = {
    background: '#ffffff',
    border: '1px solid #d7e2e8',
    borderRadius: 12,
    boxShadow: '0 18px 48px rgba(15, 23, 42, 0.24)',
    maxWidth: 360,
    padding: 20,
    width: '100%',
};

const pinFormTitleStyle: CSSProperties = {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: 800,
    margin: '0 0 4px',
};

const pinFormSubtitleStyle: CSSProperties = {
    color: '#64748b',
    fontSize: 13,
    lineHeight: '18px',
    margin: '0 0 16px',
};

const pinInputStyle: CSSProperties = {
    background: '#f8fafc',
    border: '1px solid #d7e2e8',
    borderRadius: 8,
    boxSizing: 'border-box',
    color: colors.primaryText,
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    outline: 'none',
    padding: '11px 12px',
    width: '100%',
};

const pinButtonRowStyle: CSSProperties = {
    display: 'flex',
    gap: 10,
    marginTop: 14,
};

const primaryPinButtonStyle: CSSProperties = {
    background: colors.primaryButtonBackground,
    border: `1px solid ${colors.primaryButtonBorder}`,
    borderRadius: 8,
    color: '#ffffff',
    cursor: 'pointer',
    flex: 1,
    fontSize: 14,
    fontWeight: 800,
    padding: '11px 14px',
};

const secondaryPinButtonStyle: CSSProperties = {
    background: '#ffffff',
    border: '1px solid #d7e2e8',
    borderRadius: 8,
    color: colors.primaryText,
    cursor: 'pointer',
    flex: 1,
    fontSize: 14,
    fontWeight: 800,
    padding: '11px 14px',
};

const addCatchButtonStyle: CSSProperties = {
    background: '#e8f4f8',
    border: `1px solid ${colors.primaryButtonBorder}`,
    borderRadius: 8,
    color: colors.primaryButtonBackground,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 800,
    marginTop: 4,
    padding: '10px 12px',
    width: '100%',
};

const queuedCatchStyle: CSSProperties = {
    background: '#f8fafc',
    border: '1px solid #d7e2e8',
    borderRadius: 8,
    color: '#475569',
    fontSize: 13,
    fontWeight: 700,
    marginTop: 8,
    padding: '8px 10px',
};

const pinFormErrorStyle: CSSProperties = {
    color: colors.dangerText,
    fontSize: 13,
    fontWeight: 700,
    margin: '0 0 10px',
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
        contextmenu(e: LeafletMouseEvent) {
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
        click(e: LeafletMouseEvent) {
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
                                   showCommunityPins = false,
                                   onSelectCoordinate,
                               }: MapWrapperProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [pins, setPins] = useState<Pin[]>([]);
    const [mappedCatches, setMappedCatches] = useState<LoggedCatch[]>([]);
    const [communityMappedCatches, setCommunityMappedCatches] = useState<LoggedCatch[]>([]);

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
    const [pinLocationName, setPinLocationName] = useState('');
    const [pinFormError, setPinFormError] = useState('');

    /* Catch building */
    const [catches, setCatches] = useState<Catch[]>([]);
    const [currentCatch, setCurrentCatch] = useState<Catch>({
        species: '',
        bait: '',
        size: '',
        weight: '',
    });

    const getMenuPosition = (event: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();

        if (!rect) {
            return {
                x: event.clientX,
                y: event.clientY,
            };
        }

        return {
            x: Math.max(8, Math.min(event.clientX - rect.left, rect.width - 170)),
            y: Math.max(8, Math.min(event.clientY - rect.top, rect.height - 120)),
        };
    };

    const getPinLocationName = (pin: Pin) => (
        pin.locationName || pin.location || pin.LocationName || pin.Location || ''
    );

    const clearPinForm = () => {
        setCatches([]);
        setCurrentCatch({
            species: '',
            bait: '',
            size: '',
            weight: '',
        });
        setPinLocationName('');
        setPinFormError('');
        setPendingPin(null);
        setEditingPinId(null);
    };

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

    useEffect(() => {
        if (!showCommunityPins) {
            setCommunityMappedCatches([]);
            return;
        }

        const loadCommunityMappedCatches = async () => {
            try {
                const [currentUser, communityCatches] = await Promise.all([
                    authService.getCurrentUser(),
                    catchesService.getCommunityCatches(true),
                ]);

                setCommunityMappedCatches(communityCatches.filter((item) => (
                    item.userId !== currentUser.userId &&
                    typeof item.latitude === 'number' &&
                    typeof item.longitude === 'number'
                )));
            } catch (err) {
                console.error('Error fetching community catch map points:', err);
            }
        };

        loadCommunityMappedCatches();
        return catchesService.subscribe(loadCommunityMappedCatches);
    }, [showCommunityPins]);


    const savePin = async () => {
        if (!pendingPin) return;

        const username = localStorage.getItem('username');
        if (!username) {
            console.error('No username found');
            return;
        }

        const pinId = editingPinId || Date.now().toString();
        const existingPin = editingPinId
            ? pins.find((pin) => pin.id === editingPinId)
            : undefined;
        const locationName = pinLocationName.trim();

        if (!locationName) {
            setPinFormError('Location name is required.');
            return;
        }

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
                    location: locationName,
                    locationName: locationName,
                    catches: [...catches, currentCatch]
                        .concat(existingPin?.catches ?? [])
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

            clearPinForm();

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
            ref={containerRef}
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
                        const position = getMenuPosition(e);

                        setMenu({
                            lat,
                            lng,
                            x: position.x,
                            y: position.y,
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
                            contextmenu: (e: LeafletMouseEvent) => {
                                e.originalEvent.preventDefault();
                                const position = getMenuPosition(e.originalEvent);

                                setMenu({
                                    lat: pin.lat,
                                    lng: pin.lng,
                                    x: position.x,
                                    y: position.y,
                                    pinId: pin.id,
                                });
                            },
                        }}
                    >
                        <Popup>
                            <div>
                                <strong>{getPinLocationName(pin) || 'Fishing Spot'}</strong>
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

                {communityMappedCatches.map((catchData) => (
                    <LeafletMarker
                        key={`community-catch-${catchData.id}`}
                        position={[catchData.latitude as number, catchData.longitude as number]}
                        icon={communityFishingSpotIcon}
                    >
                        <Popup>
                            <div>
                                <strong>{catchData.fish}</strong>
                                <br />
                                by {catchData.userName ?? 'Angler'}
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
                        ...menuStyle,
                        top: menu.y,
                        left: menu.x,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Create new pin */}
                    <button
                        type="button"
                        style={menuButtonStyle}
                        onClick={() => {
                            setPendingPin({ lat: menu.lat, lng: menu.lng });
                            setEditingPinId(null);
                            setPinLocationName('');
                            setPinFormError('');
                            setMenu(null);
                        }}
                    >
                        Add Pin
                    </button>

                    {/* Add catch to existing pin */}
                    {menu.pinId && (
                        <button
                            type="button"
                            style={menuButtonStyle}
                            onClick={() => {
                                const pinId = menu.pinId;
                                if (!pinId) return;

                                setPendingPin({ lat: menu.lat, lng: menu.lng });
                                setEditingPinId(pinId);
                                setPinLocationName(getPinLocationName(pins.find((pin) => pin.id === pinId) ?? {
                                    id: pinId,
                                    lat: menu.lat,
                                    lng: menu.lng,
                                    catches: [],
                                }));
                                setPinFormError('');
                                setMenu(null);
                            }}
                        >
                            Add Catch
                        </button>
                    )}

                    {/* Delete */}
                    {menu.pinId && (
                        <button
                            type="button"
                            style={dangerMenuButtonStyle}
                            onClick={() => {
                                const pinId = menu.pinId;
                                if (!pinId) return;

                                deletePin(pinId);
                            }}
                        >
                            Delete Pin
                        </button>
                    )}
                </div>
            )}

            {/* Form */}
            {pendingPin && (
                <div
                    style={pinFormOverlayStyle}
                    onClick={clearPinForm}
                >
                    <div
                        style={pinFormStyle}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={pinFormTitleStyle}>
                            {editingPinId ? 'Add Catch' : 'Create Pin'}
                        </h3>
                        <p style={pinFormSubtitleStyle}>
                            Add the catch details you want attached to this map spot.
                        </p>

                        <input
                            placeholder="Fish species"
                            style={pinInputStyle}
                            value={currentCatch.species}
                            onChange={(e) =>
                                setCurrentCatch({ ...currentCatch, species: e.target.value })
                            }
                        />

                        <input
                            placeholder="Location name"
                            style={pinInputStyle}
                            value={pinLocationName}
                            onChange={(e) => {
                                setPinLocationName(e.target.value);
                                setPinFormError('');
                            }}
                        />

                        {pinFormError ? (
                            <p style={pinFormErrorStyle}>{pinFormError}</p>
                        ) : null}

                        <input
                            placeholder="Bait used"
                            style={pinInputStyle}
                            value={currentCatch.bait}
                            onChange={(e) =>
                                setCurrentCatch({ ...currentCatch, bait: e.target.value })
                            }
                        />

                        <input
                            placeholder="Size"
                            style={pinInputStyle}
                            value={currentCatch.size}
                            onChange={(e) =>
                                setCurrentCatch({ ...currentCatch, size: e.target.value })
                            }
                        />

                        <input
                            placeholder="Weight"
                            style={pinInputStyle}
                            value={currentCatch.weight}
                            onChange={(e) =>
                                setCurrentCatch({ ...currentCatch, weight: e.target.value })
                            }
                        />

                        {/* Add another catch */}
                        <button
                            type="button"
                            onClick={() => {
                                setCatches((prev) => [...prev, currentCatch]);
                                setCurrentCatch({
                                    species: '',
                                    bait: '',
                                    size: '',
                                    weight: '',
                                });
                            }}
                            style={addCatchButtonStyle}
                        >
                            Add Another Catch
                        </button>

                        {/* Show added catches */}
                        {catches.map((c, i) => (
                            <div key={i} style={queuedCatchStyle}>
                                {c.species}
                            </div>
                        ))}

                        <div style={pinButtonRowStyle}>
                            <button
                                type="button"
                                style={primaryPinButtonStyle}
                                onClick={savePin}
                            >
                                Save Pin
                            </button>
                            <button
                                type="button"
                                onClick={clearPinForm}
                                style={secondaryPinButtonStyle}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
