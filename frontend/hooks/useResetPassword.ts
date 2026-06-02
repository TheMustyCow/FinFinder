import { useState, useCallback } from 'react';
import { authService, ResetPasswordParams } from '../services/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface UseResetPasswordReturn {
    code: string;
    setCode: (code: string) => void;
    newPassword: string;
    setNewPassword: (password: string) => void;
    error: string;
    loading: boolean;
    handleReset: () => Promise<void>;
}

export function useResetPassword(): UseResetPasswordReturn {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = useCallback(async () => {
        setError('');
        setLoading(true);

        const params: ResetPasswordParams = {
            email,
            code,
            newPassword,
        };

        const result = await authService.confirmPassword(params);

        setLoading(false);

        if (result.success) {
            router.replace('/login');
        } else {
            setError(result.error || 'Password reset failed');
        }
    }, [email, code, newPassword, router]);

    return {
        code,
        setCode,
        newPassword,
        setNewPassword,
        error,
        loading,
        handleReset,
    };
}
