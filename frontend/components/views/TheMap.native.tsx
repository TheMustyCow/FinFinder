import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function TheMapNative() {
    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 47.6062,
                longitude: -122.3321,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
        >
            <Marker
                coordinate={{ latitude: 47.6062, longitude: -122.3321 }}
                title="Example Spot"
                description="This is a test spot"
            />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: { width: '100%', height: '100%' },
});