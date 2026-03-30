import {userPool} from '../lib/cognito';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { COGNITO_CONFIG } from '../constants/cognito';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const currentUser = userPool.getCurrentUser();

        if (currentUser) {
            currentUser.getSession((err: Error | null, session: any) => {
                if (!err && session.isValid()) {
                    router.replace('/home');
                } else {
                    router.replace('/login');
                }
            });
        } else {
            router.replace('/login');
        }
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}