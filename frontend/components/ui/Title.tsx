import { Text, StyleSheet } from 'react-native';

interface TitleProps {
    text: string;
    subtitle?: string;
}

export function Title({ text, subtitle }: TitleProps) {
    return (
        <>
            <Text style={styles.title}>{text}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
});
