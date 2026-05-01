// components/community/Card.tsx
import { View, Text, StyleSheet } from 'react-native';
import type { Catch } from '../../services/catches';

interface CardProps {
    catchData: Catch;
}

/**
 * Card component that displays a posted catch
 * Takes catch data from community.tsx and renders it
 */
export default function Card({ catchData }: CardProps) {
    // TODO: Implement card display with catchData fields
    // catchData.fish, catchData.weight, catchData.length, catchData.location, catchData.date, catchData.desc
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{catchData.fish}</Text>
            <Text style={styles.cardText}>Location: {catchData.location}</Text>
            <Text style={styles.cardText}>{catchData.weight} lbs | {catchData.length} in</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '32%',
        height: 250,
        backgroundColor: '#005c87',
        borderRadius: 8,
        marginBottom: 15,
        position: 'relative',
        padding: 15,
    },
    cardTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 5,
    },
});
