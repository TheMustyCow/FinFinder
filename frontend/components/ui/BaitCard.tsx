import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    bait: string;
    count: number;
    rank: number;
}

export function BaitCard({bait, count, rank}: Props) {
    return (
        <View style={styles.card}>
            <Text>
                <Text style={styles.rank}>#{rank}</Text>
                <Text style={styles.bait}>{bait}</Text>
                <Text style={styles.count}>{count}</Text>
            </Text>
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
        borderRadius: 8
    },
    rank: {width: 32, fontWeight: 'bold', color: '888', marginRight: 8},
    bait: { flex: 1, fontSize: 16, marginRight: 8},
    count: { color: '#555'},
});