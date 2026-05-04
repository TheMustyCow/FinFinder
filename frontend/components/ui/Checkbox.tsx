// Components/ui/Checkbox.tsx

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

type Props = {
    label: string;
    checked: boolean;
    onPress: () => void;
};

export function Checkbox({ label, checked, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <View style={[styles.box, checked && styles.checked]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
    box: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 4,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
    checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    label: { fontSize: 14, color: '#333' },
});