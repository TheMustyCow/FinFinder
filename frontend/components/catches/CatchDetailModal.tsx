import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Catch } from '../../services/catches';
import { colors } from '../../constants/colors';

interface CatchDetailModalProps {
    catchData: Catch | null;
    onClose: () => void;
}

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
});

export default function CatchDetailModal({ catchData, onClose }: CatchDetailModalProps) {
    const scale = useRef(new Animated.Value(0.94)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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
});
