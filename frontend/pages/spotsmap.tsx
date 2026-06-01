import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapWrapper from '../components/views/MapWrapper';
import { ImageGridBackground } from '../components/ui/ImageGridBackground';
import { catchDraftService, type CatchCoordinate } from '../services/catchDraft';
import { colors } from '../constants/colors';

export default function SpotsMapScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ selectCatchLocation?: string }>();
    const [isSelectingCatchLocation, setIsSelectingCatchLocation] = useState(
        params.selectCatchLocation === '1' || catchDraftService.isSelectingCoordinate()
    );
    const [selectedCoordinate, setSelectedCoordinate] = useState(
        catchDraftService.getDraft().coordinate
    );

    useEffect(() => {
        return catchDraftService.subscribe(() => {
            setIsSelectingCatchLocation(catchDraftService.isSelectingCoordinate());
            setSelectedCoordinate(catchDraftService.getDraft().coordinate);
        });
    }, []);

    useEffect(() => {
        setIsSelectingCatchLocation(params.selectCatchLocation === '1' || catchDraftService.isSelectingCoordinate());
    }, [params.selectCatchLocation]);

    const selectCatchCoordinate = (coordinate: CatchCoordinate) => {
        catchDraftService.completeCoordinateSelection(coordinate);
        router.replace('/mycatches');
    };

    const cancelCatchCoordinateSelection = () => {
        catchDraftService.saveDraft({
            ...catchDraftService.getDraft(),
            coordinate: null,
        });
        catchDraftService.cancelCoordinateSelection();
        router.replace('/mycatches');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Spots Map</Text>
            </View>

            <ImageGridBackground>
                <View style={styles.contentContainer}>
                    {isSelectingCatchLocation && (
                        <View style={styles.selectionBanner}>
                            <View>
                                <Text style={styles.selectionTitle}>Select catch map point</Text>
                                <Text style={styles.selectionSubtitle}>Click or tap the spot where this catch should appear.</Text>
                            </View>
                            <Text
                                accessibilityRole="button"
                                onPress={cancelCatchCoordinateSelection}
                                style={styles.selectionCancel}
                            >
                                Cancel
                            </Text>
                        </View>
                    )}
                    <View style={styles.mapContainer}>
                        <MapWrapper
                            selectionMode={isSelectingCatchLocation}
                            selectedCoordinate={selectedCoordinate}
                            onSelectCoordinate={selectCatchCoordinate}
                            onCancelSelection={cancelCatchCoordinateSelection}
                        />
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
    selectionBanner: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d7e2e8',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectionTitle: {
        color: colors.primaryText,
        fontSize: 14,
        fontWeight: '700',
    },
    selectionSubtitle: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 2,
    },
    selectionCancel: {
        color: colors.primaryButtonBackground,
        fontSize: 13,
        fontWeight: '700',
        padding: 6,
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#d7e2e8',
        borderRadius: 8,
        overflow: 'hidden',
    },
});
