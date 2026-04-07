import { useState, useCallback } from 'react';
import { authService } from '../services/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface UseConfirmReturn {
    code: string;
    setCode: (code: string) => void;
    error: string;
    loading: boolean;
    handleConfirm: () => Promise<void>;
}

export function useConfirm(): UseConfirmReturn {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = useCallback(async () => {
        setError('');
        setLoading(true);

        const result = await authService.confirmRegistration(email, code);

        setLoading(false);

        if (result.success) {
            router.replace('/login');
        } else {
            setError(result.error || 'Confirmation failed');
        }
    }, [email, code, router]);

    return {
        code,
        setCode,
        error,
        loading,
        handleConfirm,
    };
}
