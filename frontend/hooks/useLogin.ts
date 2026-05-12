import { useState, useCallback } from 'react';//useCallback optimizes functions so they aren't recreated on every render.
import { authService } from '../services/auth';
import { useRouter } from 'expo-router';

//Interface defining the names and types of arguments that useLogin() must return.
interface UseLoginReturn {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    loading: boolean;
    handleLogin: () => Promise<void>;
    handleForgotPassword: () => Promise<void>;
}

export function useLogin(): UseLoginReturn {
    const router = useRouter();
    const [email, setEmail] = useState('');//state and state updating function for email.
    const [password, setPassword] = useState('');//state and state updating function for password.
    const [error, setError] = useState('');//state and state updating function for error.
    const [loading, setLoading] = useState(false);//state and state updating function for loading.

    const handleLogin = useCallback(async () => {
        setError('');
        setLoading(true);

        const result = await authService.login(email.trim(), password);

        setLoading(false);

        if (result.success) {
            console.log('Login successful, token:', result.token);
            router.replace('/home');
        } else {
            setError(result.error || 'Login failed');
        }
    }, [email, password, router]);//[email, password, router] defines the dependency array of useCallback(). If any of these
                                  //values changes then handleLogin will be recreated.

    const handleForgotPassword = useCallback(async () => {
        setError('');

        const result = await authService.forgotPassword(email.trim());

        if (result.success) {
            setError('Password reset code sent to your email');
            router.push({ pathname: '/resetpassword', params: { email: email.trim() } });
        } else {
            setError(result.error || 'Failed to send reset code');
        }
    }, [email, router]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleLogin,
        handleForgotPassword,
    };
}
