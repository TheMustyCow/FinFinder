import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LinkProps {
    text: string;
    onPress: () => void;
}

export function Link({ text, onPress }: LinkProps) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    text: {
        textAlign: 'center',
        color: '#667',
    },
});
