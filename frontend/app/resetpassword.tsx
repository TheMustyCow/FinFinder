import 'react-native-get-random-values';
import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '../lib/cognito';


export default function ResetPasswordScreen() {
    const router = useRouter();
    const {email} = useLocalSearchParams<{ email: string }>();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = () => {
        setError('');
        setLoading(true);

        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: userPool
        });

        cognitoUser.confirmPassword(code, newPassword, {
            onSuccess: () => {
                console.log('Password reset successful');
                setLoading(false);
                router.replace('/login');
            },
            onFailure: (err) => {
                const error = err as any; //this lets us override typescript and call ".code" on err
                console.log('Reset failure code:', error.code);
                console.log('Reset failure message:', err.message);
                setLoading(false);
                setError(err.message);
            }
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
                Enter the code sent to {email} and your new password
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Reset code"
                keyboardType="number-pad"
                onChangeText={setCode}
                value={code}
            />

            <TextInput
                style={styles.input}
                placeholder="New password"
                secureTextEntry
                onChangeText={setNewPassword}
                value={newPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
                style={styles.button}
                onPress={handleReset}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff"/>
                    : <Text style={styles.buttonText}>Reset Password</Text>
                }

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



