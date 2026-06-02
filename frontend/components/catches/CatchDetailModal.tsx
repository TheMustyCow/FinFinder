import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Catch } from '../../services/catches';
import { colors } from '../../constants/colors';

interface CatchDetailModalProps {
    catchData: Catch | null;
    onClose: () => void;
    onDelete?: (catchData: Catch) => void;
    deleting?: boolean;
}

const formatDate = (date: string) => {
    const normalizedDate = date?.includes('T') ? date : `${date}T00:00:00`;
    const parsedDate = new Date(normalizedDate);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'Unknown date';
    }

    return parsedDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

export default function CatchDetailModal({ catchData, onClose, onDelete, deleting = false }: CatchDetailModalProps) {
    const scale = useRef(new Animated.Value(0.94)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        setShowDeleteConfirm(false);

        if (!catchData) {
            scale.setValue(0.94);
            opacity.setValue(0);
            return;
        }

        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                friction: 8,
                tension: 90,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 160,
                useNativeDriver: true,
            }),
        ]).start();
    }, [catchData, opacity, scale]);

    if (!catchData) {
        return null;
    }

    return (
        <Modal
            visible={!!catchData}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalRoot}>
                <Pressable
                    accessibilityLabel="Close catch details"
                    onPress={onClose}
                    style={styles.backdrop}
                />

                <Animated.View
                    style={[
                        styles.detailCard,
                        {
                            opacity,
                            transform: [{ scale }],
                        },
                    ]}
                >
                    <View style={styles.detailHeader}>
                        <View style={styles.headerText}>
                            <Text style={styles.title} numberOfLines={2}>{catchData.fish}</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>
                                {catchData.userName ? `${catchData.userName} | ` : ''}{formatDate(catchData.date)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Location</Text>
                            <Text style={styles.detailValue}>{catchData.location}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Weight</Text>
                            <Text style={styles.detailValue}>{catchData.weight} lbs</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Length</Text>
                            <Text style={styles.detailValue}>{catchData.length} in</Text>
                        </View>
                        {!!catchData.bait && (
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Bait</Text>
                                <Text style={styles.detailValue}>{catchData.bait}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.descriptionWrap}>
                        <Text style={styles.descriptionLabel}>Description</Text>
                        <ScrollView
                            style={styles.descriptionScroll}
                            contentContainerStyle={styles.descriptionContent}
                        >
                            <Text style={styles.descriptionText}>
                                {catchData.desc || 'No description added.'}
                            </Text>
                        </ScrollView>
                    </View>

                    {onDelete && (
                        <View style={styles.actionWrap}>
                            <Pressable
                                accessibilityRole="button"
                                disabled={deleting}
                                onPress={() => setShowDeleteConfirm(true)}
                                style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
                            >
                                <Text style={styles.deleteButtonText}>
                                    {deleting ? 'Deleting...' : 'Delete Catch'}
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {showDeleteConfirm && onDelete && (
                        <View style={styles.confirmOverlay}>
                            <Pressable
                                accessibilityLabel="Cancel delete catch"
                                disabled={deleting}
                                onPress={() => setShowDeleteConfirm(false)}
                                style={styles.confirmBackdrop}
                            />
                            <View style={styles.confirmCard}>
                                <Text style={styles.confirmTitle}>Delete this catch?</Text>
                                <Text style={styles.confirmText}>
                                    This will remove {catchData.fish} from My Catches and Community.
                                </Text>
                                <View style={styles.confirmActions}>
                                    <Pressable
                                        accessibilityRole="button"
                                        disabled={deleting}
                                        onPress={() => setShowDeleteConfirm(false)}
                                        style={[styles.confirmCancelButton, deleting && styles.deleteButtonDisabled]}
                                    >
                                        <Text style={styles.confirmCancelText}>Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        accessibilityRole="button"
                                        disabled={deleting}
                                        onPress={() => onDelete(catchData)}
                                        style={[styles.confirmDeleteButton, deleting && styles.deleteButtonDisabled]}
                                    >
                                        <Text style={styles.confirmDeleteText}>
                                            {deleting ? 'Deleting...' : 'Delete'}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalRoot: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.modalBackdrop,
    },
    detailCard: {
        width: '76%',
        maxWidth: 720,
        maxHeight: '82%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#d7e2e8',
        overflow: 'hidden',
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.22,
        shadowRadius: 28,
    },
    detailHeader: {
        backgroundColor: colors.primaryButtonBackground,
        paddingVertical: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        flex: 1,
        paddingRight: 16,
    },
    title: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitle: {
        color: '#d9edf4',
        fontSize: 14,
        fontWeight: '600',
    },
    detailGrid: {
        paddingHorizontal: 24,
        paddingTop: 22,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    detailItem: {
        width: '50%',
        paddingRight: 18,
        marginBottom: 18,
    },
    detailLabel: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    detailValue: {
        color: '#334155',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    descriptionWrap: {
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingHorizontal: 24,
        paddingTop: 18,
        paddingBottom: 24,
    },
    descriptionLabel: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    descriptionScroll: {
        maxHeight: 260,
    },
    descriptionContent: {
        paddingRight: 8,
    },
    descriptionText: {
        color: '#334155',
        fontSize: 15,
        lineHeight: 23,
    },
    actionWrap: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    deleteButton: {
        backgroundColor: colors.dangerButtonBackground,
        borderColor: colors.dangerButtonBorder,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
    deleteButtonText: {
        color: colors.dangerText,
        fontSize: 15,
        fontWeight: '700',
    },
    confirmOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    confirmBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(11, 18, 32, 0.48)',
    },
    confirmCard: {
        width: '100%',
        maxWidth: 440,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#d7e2e8',
        padding: 22,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.24,
        shadowRadius: 26,
    },
    confirmTitle: {
        color: colors.primaryText,
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 8,
    },
    confirmText: {
        color: '#475569',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 22,
        marginBottom: 20,
    },
    confirmActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    confirmCancelButton: {
        backgroundColor: '#ffffff',
        borderColor: '#d7e2e8',
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 11,
        paddingHorizontal: 18,
    },
    confirmCancelText: {
        color: colors.primaryText,
        fontSize: 14,
        fontWeight: '700',
    },
    confirmDeleteButton: {
        backgroundColor: colors.dangerText,
        borderColor: colors.dangerText,
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 11,
        paddingHorizontal: 18,
    },
    confirmDeleteText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '800',
    },
});
