import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary';
}

export function Button({ onPress, title, disabled, loading, variant = 'primary' }: ButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, variant === 'secondary' && styles.secondaryButton]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2e7d32',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
