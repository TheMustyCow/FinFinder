import { Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
    message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;
    return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
});
