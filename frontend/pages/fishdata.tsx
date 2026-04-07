// pages/fishdata.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function FishDataScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fish Data 🐟</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
});
