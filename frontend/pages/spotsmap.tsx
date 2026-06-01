import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapWrapper from '../components/views/MapWrapper';
import { ImageGridBackground } from '../components/ui/ImageGridBackground';
import { colors } from '../constants/colors';

export default function SpotsMapScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Spots Map</Text>
            </View>

            <ImageGridBackground>
                <View style={styles.contentContainer}>
                    <View style={styles.mapContainer}>
                        <MapWrapper />
                    </View>
                </View>
            </ImageGridBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.pageBackground,
    },
    header: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        margin: 30,
        marginHorizontal: 100,
        marginTop: 30,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#d7e2e8',
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#d7e2e8',
        borderRadius: 8,
        overflow: 'hidden',
    },
});
