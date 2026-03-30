import {userPool} from '../lib/cognito';
import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import {
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from '../constants/cognito';


export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = () => {
        const cognitoUser = new CognitoUser({
            Username: email.trim(),
            Pool: userPool
        });

        cognitoUser.forgotPassword({
            onSuccess: () => {
                console.log('Reset code sent');
                setError('Password reset code sent to your email');
                router.push({pathname: '/resetpassword', params: {email: email.trim()}});
                },
            onFailure: (err) => {
                console.log('Forgot password error:', err.message);
                setError(err.message);
            }
        });
    };

    const handleLogin = () => {
        setError('');
        setLoading(true);
        console.log('Email being sent:', JSON.stringify(email.trim()));
        console.log('UserPoolId:', COGNITO_CONFIG.UserPoolId);
        console.log('ClientId:', COGNITO_CONFIG.ClientId);

        const authDetails = new AuthenticationDetails({
            Username: email.trim(),
            Password: password,
        });

        const cognitoUser = new CognitoUser({
            Username: email.trim(),
            Pool: userPool
        });

        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
                const token = result.getIdToken().getJwtToken();
                console.log('Login success');
                // TODO: store token (AsyncStorage or context) for later API calls
                console.log('Login successful, token:', token);
                setLoading(false);
                router.replace('/home');

            },
            onFailure: (err) => {
                console.log('Login failure code:', err.code);
                console.log('Login failure message:', err.message);
                setLoading(false);
                setError(err.message || 'Login failed');
            },
            newPasswordRequired: () => {
                console.log('New password required');
                setLoading(false);
                setError('Password reset required');
            }
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <Text style={styles.title}>Fin Finder</Text>
        <Text style={styles.subtitle}>Sign in to start fishing!</Text>

    <TextInput
    style={styles.input}
    placeholder="Email"
    autoCapitalize="none"
    keyboardType="email-address"
    onChangeText={setEmail}
    value={email}
    />
    <TextInput
    style={styles.input}
    placeholder="Password"
    secureTextEntry
    onChangeText={setPassword}
    value={password}
    />

    {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
        >
        {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Log In</Text>
    }
        </TouchableOpacity>

            {/* Code to sign up if you don't have an account. */}
        <TouchableOpacity onPress={() => router.push('signup')} style={{marginTop: 16}}>
            <Text style={{textAlign: 'center', color: '#2e7d32'}}>
                Don't have an account? Sign up
            </Text>
        </TouchableOpacity>

            {/* code for handling a forgotten password */}
        <TouchableOpacity onPress={handleForgotPassword} style={{marginTop: 8}}>
            <Text style={{textAlign: 'center', color: '#667'}}>Forgot password?</Text>
        </TouchableOpacity>


        </KeyboardAvoidingView>
    );
    }

    const styles = StyleSheet.create({
        container: { flex: 1, justifyContent: 'center', padding: 24 },
        title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
        subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32 },
        input: {
            borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
            padding: 12, marginBottom: 16, fontSize: 16
        },
        error: { color: 'red', marginBottom: 12, textAlign: 'center' },
        button: {
            backgroundColor: '#2e7d32', borderRadius: 8,
            padding: 14, alignItems: 'center'
        },
        buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
    });