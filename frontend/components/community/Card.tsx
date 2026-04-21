// components/community/Card.tsx
import { View, Text, StyleSheet } from 'react-native';

interface CardProps {
    cardNumber: number;
}

export default function Card({ cardNumber }: CardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardNumber}>{cardNumber}</Text>
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
    },
    cardNumber: {
        position: 'absolute',
        top: 10,
        left: 10,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
