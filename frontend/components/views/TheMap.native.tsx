import { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import type { MapWrapperProps } from './MapWrapper';
import { catchesService, type Catch } from '../../services/catches';

export default function TheMapNative({
    selectionMode = false,
    selectedCoordinate,
    onSelectCoordinate,
}: MapWrapperProps) {
    const [mappedCatches, setMappedCatches] = useState<Catch[]>([]);

    useEffect(() => {
        const loadMappedCatches = async () => {
            try {
                const myCatches = await catchesService.getMyCatches(true);
                setMappedCatches(myCatches.filter((item) => (
                    typeof item.latitude === 'number' &&
                    typeof item.longitude === 'number'
                )));
            } catch (error) {
                console.error('Error fetching catch map points:', error);
            }
        };

        loadMappedCatches();
        return catchesService.subscribe(loadMappedCatches);
    }, []);

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 47.6062,
                longitude: -122.3321,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
            onPress={(event) => {
                if (!selectionMode) {
                    return;
                }

                onSelectCoordinate?.({
                    latitude: event.nativeEvent.coordinate.latitude,
                    longitude: event.nativeEvent.coordinate.longitude,
                });
            }}
        >
            {mappedCatches.map((catchData) => (
                <Marker
                    key={catchData.id}
                    coordinate={{
                        latitude: catchData.latitude as number,
                        longitude: catchData.longitude as number,
                    }}
                    title={catchData.fish}
                    description={`${catchData.location} | ${catchData.weight} lbs, ${catchData.length} in`}
                />
            ))}

            {selectedCoordinate && (
                <Marker
                    coordinate={selectedCoordinate}
                    title="Selected catch point"
                />
            )}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: { width: '100%', height: '100%' },
});
