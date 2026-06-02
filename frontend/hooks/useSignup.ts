import { useState, useCallback } from 'react';
import { authService } from '../services/auth';
import { useRouter } from 'expo-router';

interface UseSignupReturn {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    loading: boolean;
    handleSignup: () => Promise<void>;
}

export function useSignup(): UseSignupReturn {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = useCallback(async () => {
        setError('');
        setLoading(true);

        const result = await authService.signup(email.trim(), password);

        setLoading(false);

        if (result.success) {
            router.push({ pathname: '/confirm', params: { email: email.trim() } });
        } else {
            setError(result.error || 'Signup failed');
        }
    }, [email, password, router]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleSignup,
    };
}
