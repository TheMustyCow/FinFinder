import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, Input, ErrorMessage, AuthFooter, Title, Link } from '../ui';

//A function that implements this interface must have parameters with these names and types.
interface LoginViewProps {
    email: string;//email argument must be string.
    setEmail: (email: string) => void;//setEmail must be a function that takes a string argument and returns void.
    password: string;//password argument must be string.
    setPassword: (password: string) => void;//setPassword must be a function that takes a string argument and returns void.
    error: string;//error argument must be string.
    loading: boolean;//loading argument must be boolean.
    onLogin: () => void;//onLogin must be a parameterless function that returns void.
    onForgotPassword: () => void;//onForgotPassword must be a parameterless function that returns void.
}
//LoginView exports the JSX for the login screen component.
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
