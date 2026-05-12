// pages/spotsmap.tsx
import { View, Text, StyleSheet } from 'react-native';
import MapWrapper from '../components/views/MapWrapper';

export default function SpotsMapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Spots Map</Text>
            <View style={styles.mapContainer}>
                <MapWrapper />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16
    },
    mapContainer: {flex: 1},
});
