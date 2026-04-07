import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, Input, ErrorMessage, AuthFooter, Title, Link } from '../ui';

interface LoginViewProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    loading: boolean;
    onLogin: () => void;
    onForgotPassword: () => void;
}

export function LoginView({
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    onLogin,
    onForgotPassword,
}: LoginViewProps) {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Title text="Fin Finder" subtitle="Sign in to start fishing!" />

            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <ErrorMessage message={error} />

            <Button onPress={onLogin} title="Log In" disabled={loading} loading={loading} />

            <AuthFooter
                text="Don't have an account?"
                linkText="Sign up"
                linkPath="/signup"
            />

            <Link text="Forgot password?" onPress={onForgotPassword} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
});
