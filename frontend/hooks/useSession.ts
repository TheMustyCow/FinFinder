import { useEffect } from 'react';
import { authService } from '../services/auth';
import { useRouter } from 'expo-router';

export function useSessionCheck() {
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const result = await authService.checkSession();

            if (result.success) {
                router.replace('/home');
            } else {
                router.replace('/login');
            }
        };

        checkSession();
    }, [router]);
}
