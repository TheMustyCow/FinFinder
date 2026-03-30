import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#0f172a' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{headerShown: false}} />
                <Stack.Screen name="signup" options={{headerShown: false}} />
                <Stack.Screen name="confirm" options={{headerShown: false}} />
                <Stack.Screen name="home" options={{title: 'Home'}} />
                <Stack.Screen name="resetpassword" options={{headerShown: false}} />

                {/* Later: add <Stack.Screen name="home" /> etc. */}
            </Stack>
            <StatusBar style="light" />
        </>
    );
}