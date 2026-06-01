import { useEffect, useRef, useState } from 'react';
import { useIsFocused, usePathname, useRouter } from 'expo-router';
import { Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Pressable, type GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CatchDetailModal from '../components/catches/CatchDetailModal';
import { ImageGridBackground } from '../components/ui/ImageGridBackground';
import { catchDraftService, type CatchCoordinate } from '../services/catchDraft';
import { catchesService, type Catch } from '../services/catches';
import { colors } from '../constants/colors';

const hasCatchDraft = (draft: ReturnType<typeof catchDraftService.getDraft>) => Boolean(
    draft.fish ||
    draft.location ||
    draft.weight ||
    draft.length ||
    draft.bait ||
    draft.notes ||
    draft.postToCommunity ||
    draft.coordinate
);

export default function MyCatches() {
    const router = useRouter();
    const pathname = usePathname();
    const isFocused = useIsFocused();
    const initialDraftRef = useRef(catchDraftService.getDraft());
    const [modalVisible, setModalVisible] = useState(false);
    const [isSelectingCoordinate, setIsSelectingCoordinate] = useState(catchDraftService.isSelectingCoordinate());
    const [isSaving, setIsSaving] = useState(false);
    const [hoveredPublishedCatchId, setHoveredPublishedCatchId] = useState<string | null>(null);
    const [selectedCatch, setSelectedCatch] = useState<Catch | null>(null);
    const publishedHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [fish, setFish] = useState(initialDraftRef.current.fish);
    const [location, setLocation] = useState(initialDraftRef.current.location);
    const [weight, setWeight] = useState(initialDraftRef.current.weight);
    const [length, setLength] = useState(initialDraftRef.current.length);
    const [bait, setBait] = useState(initialDraftRef.current.bait);
    const [notes, setNotes] = useState(initialDraftRef.current.notes);
    const [postToCommunity, setPostToCommunity] = useState(initialDraftRef.current.postToCommunity);
    const [catchCoordinate, setCatchCoordinate] = useState<CatchCoordinate | null>(initialDraftRef.current.coordinate);

    const [catches, setCatches] = useState<Catch[]>([]);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        loadCatches();
        return catchesService.subscribe(loadCatches);
    }, []);

    useEffect(() => {
        const savedDraft = catchDraftService.getDraft();

        if (hasCatchDraft(savedDraft) && !catchDraftService.isSelectingCoordinate()) {
            setModalVisible(true);
        }

        return catchDraftService.subscribe(() => {
            const nextDraft = catchDraftService.getDraft();
            const nextIsSelectingCoordinate = catchDraftService.isSelectingCoordinate();

            setFish(nextDraft.fish);
            setLocation(nextDraft.location);
            setWeight(nextDraft.weight);
            setLength(nextDraft.length);
            setBait(nextDraft.bait);
            setNotes(nextDraft.notes);
            setPostToCommunity(nextDraft.postToCommunity);
            setCatchCoordinate(nextDraft.coordinate);
            setIsSelectingCoordinate(nextIsSelectingCoordinate);

            if (hasCatchDraft(nextDraft) && !nextIsSelectingCoordinate) {
                setModalVisible(true);
            }
        });
    }, []);

    useEffect(() => () => {
        if (publishedHoverTimerRef.current) {
            clearTimeout(publishedHoverTimerRef.current);
        }
    }, []);

    const loadCatches = async () => {
        try {
            const myCatches = await catchesService.getMyCatches();
            setCatches(myCatches);
            setLoadError('');
        } catch (error) {
            setLoadError(error instanceof Error ? error.message : 'Unable to load catches');
        }
    };

    const resetForm = () => {
        setFish('');
        setLocation('');
        setWeight('');
        setLength('');
        setBait('');
        setNotes('');
        setPostToCommunity(false);
        setCatchCoordinate(null);
        catchDraftService.clearDraft();
    };

    const getCurrentDraft = () => ({
        fish,
        location,
        weight,
        length,
        bait,
        notes,
        postToCommunity,
        coordinate: catchCoordinate,
    });

    const chooseCatchCoordinate = () => {
        const currentDraft = getCurrentDraft();

        setModalVisible(false);
        setIsSelectingCoordinate(true);

        setTimeout(() => {
            catchDraftService.startCoordinateSelection(currentDraft);
            router.replace('/spotsmap?selectCatchLocation=1');
        }, 0);
    };

    const cancelAddCatch = () => {
        setModalVisible(false);
        resetForm();
    };

    const clearCatchCoordinate = () => {
        const nextDraft = {
            ...getCurrentDraft(),
            coordinate: null,
        };

        setCatchCoordinate(null);
        catchDraftService.saveDraft(nextDraft);
    };

    const formatCoordinate = (coordinate: CatchCoordinate) => (
        `${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)}`
    );

    const shareCatchToCommunity = async (catchId: string) => {
        const result = await catchesService.postCatchToCommunity(catchId);

        if (!result.success) {
            Alert.alert('Unable to share catch', result.error ?? 'Please try again.');
        }
    };

    const shareCatchFromCard = (event: GestureResponderEvent, catchId: string) => {
        event.stopPropagation();
        shareCatchToCommunity(catchId);
    };

    const showPublishedTooltip = (catchId: string) => {
        if (publishedHoverTimerRef.current) {
            clearTimeout(publishedHoverTimerRef.current);
        }

        publishedHoverTimerRef.current = setTimeout(() => {
            setHoveredPublishedCatchId(catchId);
        }, 500);
    };

    const hidePublishedTooltip = () => {
        if (publishedHoverTimerRef.current) {
            clearTimeout(publishedHoverTimerRef.current);
            publishedHoverTimerRef.current = null;
        }

        setHoveredPublishedCatchId(null);
    };

    const formatDate = (date: string) => {
        const normalizedDate = date?.includes('T') ? date : `${date}T00:00:00`;
        const parsedDate = new Date(normalizedDate);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Unknown date';
        }

        return parsedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isFormValid = Boolean(
        fish &&
        location &&
        weight &&
        length &&
        !Number.isNaN(Number(weight)) &&
        !Number.isNaN(Number(length))
    );

    const addCatch = async () => {
        const parsedWeight = Number(weight);
        const parsedLength = Number(length);

        if (
            !fish ||
            !location ||
            !weight ||
            !length ||
            Number.isNaN(parsedWeight) ||
            Number.isNaN(parsedLength) ||
            isSaving
        ) {
            return;
        }

        setIsSaving(true);

        try {
            const savedCatch = await catchesService.createCatch({
                fish,
                location,
                latitude: catchCoordinate?.latitude,
                longitude: catchCoordinate?.longitude,
                weight: parsedWeight,
                length: parsedLength,
                bait: bait || undefined,
                desc: notes || '',
            });

            if (postToCommunity) {
                await shareCatchToCommunity(savedCatch.id);
            }

            resetForm();
            setModalVisible(false);
            setLoadError('');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>My Catches</Text>
            </View>

            <ImageGridBackground>
                <View style={styles.contentContainer}>
                    <View style={styles.toolbar}>
                        <View>
                            <Text style={styles.sectionTitle}>Catch Log</Text>
                            <Text style={styles.sectionSubtitle}>{catches.length} saved {catches.length === 1 ? 'catch' : 'catches'}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.addButtonText}>Add Catch</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {loadError ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyTitle}>Unable to load catches</Text>
                                <Text style={styles.emptyText}>{loadError}</Text>
                            </View>
                        ) : catches.length > 0 ? (
                            <View style={styles.grid}>
                                {catches.map((item) => (
                                    <Pressable
                                        key={item.id}
                                        accessibilityRole="button"
                                        onPress={() => setSelectedCatch(item)}
                                        style={styles.card}
                                    >
                                        <View style={styles.cardHeader}>
                                            <View style={styles.cardHeaderText}>
                                                <Text style={styles.fish} numberOfLines={1}>{item.fish}</Text>
                                                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                                            </View>
                                            {item.isPostedToCommunity && (
                                                <Pressable
                                                    accessibilityLabel="Published to Community"
                                                    onHoverIn={() => showPublishedTooltip(item.id)}
                                                    onHoverOut={hidePublishedTooltip}
                                                    style={styles.publishedLogoWrap}
                                                >
                                                    <View style={styles.publishedLogo}>
                                                        <View style={styles.publishedLogoDot} />
                                                    </View>
                                                    {hoveredPublishedCatchId === item.id && (
                                                        <View style={styles.publishedTooltip}>
                                                            <Text style={styles.publishedTooltipText}>Shared with community</Text>
                                                        </View>
                                                    )}
                                                </Pressable>
                                            )}
                                        </View>

                                        <View style={styles.cardBody}>
                                            <View style={styles.cardContent}>
                                                <View style={styles.detailGrid}>
                                                    <View style={styles.detailItem}>
                                                        <Text style={styles.detailLabel}>Location</Text>
                                                        <Text style={styles.detailValue} numberOfLines={1}>{item.location}</Text>
                                                    </View>
                                                    <View style={styles.detailItem}>
                                                        <Text style={styles.detailLabel}>Weight</Text>
                                                        <Text style={styles.detailValue}>{item.weight} lbs</Text>
                                                    </View>
                                                    <View style={styles.detailItem}>
                                                        <Text style={styles.detailLabel}>Length</Text>
                                                        <Text style={styles.detailValue}>{item.length} in</Text>
                                                    </View>
                                                    {!!item.bait && (
                                                        <View style={styles.detailItem}>
                                                            <Text style={styles.detailLabel}>Bait</Text>
                                                            <Text style={styles.detailValue} numberOfLines={1}>{item.bait}</Text>
                                                        </View>
                                                    )}
                                                </View>

                                                {!!item.desc && <Text style={styles.notes} numberOfLines={2}>{item.desc}</Text>}
                                            </View>

                                            <View style={styles.actionArea}>
                                                {!item.isPostedToCommunity && (
                                                    <TouchableOpacity
                                                        style={styles.shareButton}
                                                        onPress={(event) => shareCatchFromCard(event, item.id)}
                                                    >
                                                        <Text style={styles.shareButtonText}>Share to Community</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyTitle}>No catches saved yet</Text>
                                <Text style={styles.emptyText}>Add your first catch to start building your log.</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </ImageGridBackground>

            {/* MODAL */}
            <Modal
                visible={isFocused && pathname === '/mycatches' && modalVisible && !isSelectingCoordinate}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Catch</Text>
                            <Text style={styles.modalSubtitle}>Record the details now and share it when you are ready.</Text>
                        </View>

                        <TextInput
                            placeholder="Fish type"
                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={fish}
                            onChangeText={setFish}
                        />

                        <TextInput
                            placeholder="Location name"
                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                        />

                        <View style={styles.mapSelectRow}>
                            <TouchableOpacity
                                style={styles.mapSelectButton}
                                onPress={chooseCatchCoordinate}
                            >
                                <Text style={styles.mapSelectButtonText}>
                                    {catchCoordinate ? 'Change Map Point' : 'Choose Map Point'}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.mapSelectStatus}>
                                <Text style={styles.mapSelectLabel}>Map point</Text>
                                <Text style={styles.mapSelectValue} numberOfLines={1}>
                                    {catchCoordinate ? formatCoordinate(catchCoordinate) : 'Not selected'}
                                </Text>
                            </View>
                            {catchCoordinate && (
                                <TouchableOpacity
                                    style={styles.clearMapButton}
                                    onPress={clearCatchCoordinate}
                                >
                                    <Text style={styles.clearMapButtonText}>Clear</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <TextInput
                            placeholder="Weight (lbs)"
                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                        />

                        <TextInput
                            placeholder="Length (inches)"
                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={length}
                            onChangeText={setLength}
                            keyboardType="numeric"
                        />

                        <TextInput
                            placeholder="Bait used"
                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={bait}
                            onChangeText={setBait}
                        />

                        <TextInput
                            placeholder="Notes (weather, location details, etc.)"
                            placeholderTextColor="#94a3b8"
                            style={[styles.input, styles.notesInput]}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                        />

                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setPostToCommunity((value) => !value)}
                        >
                            <View style={[styles.checkbox, postToCommunity && styles.checkboxChecked]}>
                                {postToCommunity && <View style={styles.checkboxDot} />}
                            </View>
                            <Text style={styles.checkboxLabel}>Post to Community</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.saveButton, (!isFormValid || isSaving) && styles.saveButtonDisabled]}
                            onPress={addCatch}
                            disabled={!isFormValid || isSaving}
                        >
                            <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save Catch'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={cancelAddCatch}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
            <CatchDetailModal
                catchData={selectedCatch}
                onClose={() => setSelectedCatch(null)}
            />
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
        color: colors.primaryText,
    },
    contentContainer: {
        flex: 1,
        margin: 30,
        marginHorizontal: 100,
        marginTop: 30,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        flexDirection: 'column',
    },
    toolbar: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        color: colors.primaryText,
        fontSize: 18,
        fontWeight: '700',
    },
    sectionSubtitle: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 3,
    },
    addButton: {
        backgroundColor: colors.primaryButtonBackground,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        columnGap: '2%',
    },
    card: {
        width: '32%',
        height: 300,
        backgroundColor: '#ffffff',
        borderRadius: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d7e2e8',
        overflow: 'hidden',
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
    },
    cardHeader: {
        backgroundColor: colors.primaryButtonBackground,
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardHeaderText: {
        flex: 1,
        paddingRight: 12,
    },
    publishedLogoWrap: {
        position: 'relative',
        zIndex: 2,
    },
    publishedLogo: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#e8f4f8',
        borderWidth: 2,
        borderColor: '#bdd8e3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    publishedLogoDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primaryButtonBackground,
    },
    publishedTooltip: {
        position: 'absolute',
        top: 34,
        right: 0,
        width: 156,
        backgroundColor: colors.primaryButtonBackground,
        borderRadius: 6,
        paddingVertical: 7,
        paddingHorizontal: 10,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 10,
    },
    publishedTooltipText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    cardBody: {
        flex: 1,
        padding: 18,
        paddingBottom: 16,
        justifyContent: 'space-between',
    },
    cardContent: {
        flexShrink: 1,
    },
    fish: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    dateText: {
        color: '#d9edf4',
        fontSize: 13,
        fontWeight: '600',
    },
    detailGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 14,
    },
    detailItem: {
        width: '50%',
        paddingRight: 12,
        marginBottom: 14,
    },
    detailLabel: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 3,
        textTransform: 'uppercase',
    },
    detailValue: {
        color: '#334155',
        fontSize: 15,
        fontWeight: '600',
    },
    notes: {
        color: '#475569',
        fontSize: 14,
        lineHeight: 20,
    },
    actionArea: {
        minHeight: 42,
        justifyContent: 'flex-end',
    },
    emptyState: {
        minHeight: 360,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        color: colors.primaryText,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
    },
    emptyText: {
        color: '#64748b',
        fontSize: 14,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '70%',
        maxWidth: 620,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 24,
        borderWidth: 1,
        borderColor: '#d7e2e8',
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
    },
    modalHeader: {
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primaryText,
        textAlign: 'center',
    },
    modalSubtitle: {
        color: '#64748b',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 6,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f8fafc',
        color: colors.primaryText,
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d7e2e8',
        marginBottom: 10,
        fontSize: 14,
    },
    notesInput: {
        minHeight: 82,
        textAlignVertical: 'top',
    },
    mapSelectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    mapSelectButton: {
        backgroundColor: '#e8f4f8',
        borderWidth: 1,
        borderColor: colors.primaryButtonBorder,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    mapSelectButtonText: {
        color: colors.primaryButtonBackground,
        fontSize: 13,
        fontWeight: '700',
    },
    mapSelectStatus: {
        flex: 1,
        minWidth: 0,
    },
    mapSelectLabel: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    mapSelectValue: {
        color: '#334155',
        fontSize: 13,
        fontWeight: '600',
    },
    clearMapButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    clearMapButtonText: {
        color: '#64748b',
        fontSize: 13,
        fontWeight: '700',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.primaryButtonBorder,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: colors.checkboxCheckedBackground,
    },
    checkboxDot: {
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: '#ffffff',
    },
    checkboxLabel: {
        color: '#334155',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: colors.primaryButtonBackground,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    saveButtonDisabled: {
        backgroundColor: colors.disabledButtonBackground,
    },
    saveText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    shareButton: {
        backgroundColor: colors.primaryButtonBackground,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    shareButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelText: {
        color: '#64748b',
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '600',
    },
});
