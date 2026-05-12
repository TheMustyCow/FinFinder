// Components/ui/BestTimeCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    timeOfDay: string;
    count: number;
    rank: number;
};

//Used to render the BestTimeCards on the fish data page. Once BestTimeOf day is checked, a list
//of best times of day to catch a specific species of fish will be displayed with the following jsx.
export function BestTimeCard({ timeOfDay, count, rank }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.rank}>#{rank}</Text>
            <Text style={styles.timeOfDay}>{timeOfDay}</Text>
            <Text style={styles.count}>{count} catches</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#f0f4f8',
        borderRadius: 8,
    },
    rank: { width: 32, fontWeight: 'bold', color: '#888' },
    timeOfDay: { flex: 1, fontSize: 16 },
    count: { color: '#555' },
});