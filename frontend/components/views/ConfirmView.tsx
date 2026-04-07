import { View, Text, StyleSheet } from 'react-native';
import { Button, Input, ErrorMessage, Title } from '../ui';
import { useLocalSearchParams } from 'expo-router';

interface ConfirmViewProps {
    code: string;
    setCode: (code: string) => void;
    error: string;
    loading: boolean;
    onConfirm: () => void;
}

export function ConfirmView({
    code,
    setCode,
    error,
    loading,
    onConfirm,
}: ConfirmViewProps) {
    const { email } = useLocalSearchParams<{ email: string }>();

    return (
        <View>
            <Title text="Check your email" />

            <Text style={styles.message}>
                We sent a verification code to {email}
            </Text>

            <Input
                placeholder="Verification code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
            />

            <ErrorMessage message={error} />

            <Button onPress={onConfirm} title="Verify" disabled={loading} loading={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    message: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 32,
    },
});
