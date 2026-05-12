// components/community/Card.tsx
import { View, Text, StyleSheet } from 'react-native';
import type { Catch } from '../../services/catches';

interface CardProps {
    catchData: Catch;
    variant?: 'grid' | 'preview';
}

export default function Card({ catchData, variant = 'grid' }: CardProps) {
    const formattedDate = new Date(`${catchData.date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <View style={[styles.card, variant === 'preview' && styles.previewCard]}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>{catchData.fish}</Text>
                <Text style={styles.authorText} numberOfLines={1}>
                    by {catchData.userName ?? 'Angler'} | {formattedDate}
                </Text>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailText} numberOfLines={1}>{catchData.location}</Text>
                    <Text style={styles.detailText}>{catchData.weight} lbs</Text>
                    <Text style={styles.detailText}>{catchData.length} in</Text>
                    {catchData.bait && (
                        <Text style={styles.detailText} numberOfLines={1}>Bait {catchData.bait}</Text>
                    )}
                </View>

                <Text style={styles.descText} numberOfLines={variant === 'preview' ? 3 : 2}>
                    {catchData.desc}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '32%',
        height: 250,
        backgroundColor: '#ffffff',
        borderRadius: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d7e2e8',
        overflow: 'hidden',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
    },
    previewCard: {
        width: '100%',
        maxWidth: 560,
    },
    cardHeader: {
        backgroundColor: '#005c87',
        paddingHorizontal: 18,
        paddingTop: 8,
        paddingBottom: 10,
    },
    cardBody: {
        padding: 18,
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    authorText: {
        color: '#d9edf4',
        fontSize: 13,
        fontWeight: '600',
    },
    detailRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    detailText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 16,
        marginBottom: 8,
    },
    descText: {
        color: '#334155',
        fontSize: 15,
        lineHeight: 21,
    },
});
