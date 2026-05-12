// Components/ui/TopAnglersCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    username: string;
    count: number;
    rank: number;
};

export function TopAnglersCard({ username, count, rank }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.rank}>#{rank}</Text>
            <Text style={styles.username}>{username}</Text>
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
    username: { flex: 1, fontSize: 16 },
    count: { color: '#555' },
});