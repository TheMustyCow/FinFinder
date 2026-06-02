import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface AuthFooterProps {
    text: string;
    linkText: string;
    linkPath: string;
}

export function AuthFooter({ text, linkText, linkPath }: AuthFooterProps) {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.push(linkPath)} style={styles.container}>
            <Text style={styles.text}>
                {text} <Text style={styles.link}>{linkText}</Text>
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    text: {
        textAlign: 'center',
        color: '#666',
    },
    link: {
        color: '#2e7d32',
        fontWeight: '600',
    },
});
