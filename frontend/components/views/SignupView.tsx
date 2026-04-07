import { View, StyleSheet } from 'react-native';
import { Button, Input, ErrorMessage, AuthFooter, Title } from '../ui';

interface SignupViewProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    loading: boolean;
    onSignup: () => void;
}

export function SignupView({
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    onSignup,
}: SignupViewProps) {
    return (
        <View style={styles.container}>
            <Title text="Create Account" />

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

            <Button onPress={onSignup} title="Sign Up" disabled={loading} loading={loading} />

            <AuthFooter
                text="Already have an account?"
                linkText="Log in"
                linkPath="/login"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        marginBottom: 24,
    },
});
