import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import { Button, Input, ErrorMessage, Title } from '../ui';
import { useLocalSearchParams } from 'expo-router';

interface ResetPasswordViewProps {
    code: string;
    setCode: (code: string) => void;
    newPassword: string;
    setNewPassword: (password: string) => void;
    error: string;
    loading: boolean;
    onReset: () => void;
}

export function ResetPasswordView({
    code,
    setCode,
    newPassword,
    setNewPassword,
    error,
    loading,
    onReset,
}: ResetPasswordViewProps) {
    const { email } = useLocalSearchParams<{ email: string }>();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Title text="Reset Password" />

            <Text style={styles.subtitle}>
                Enter the code sent to {email} and your new password
            </Text>

            <Input
                placeholder="Reset code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
            />

            <Input
                placeholder="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />

            <ErrorMessage message={error} />

            <Button
                onPress={onReset}
                title="Reset Password"
                disabled={loading}
                loading={loading}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
});
