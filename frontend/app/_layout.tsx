// app/_layout.tsx
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { authService } from '../services/auth';

// App title component for the header left side
function AppTitle() {
    return (
        <Text style={styles.appTitle}>Fin Finder</Text>
    );
}

// Navigation buttons component for the header
function NavigationButtons() {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { name: 'home', label: 'Home' },
        { name: 'fishdata', label: 'Fish' },
        { name: 'mycatches', label: 'Catches' },
        { name: 'spotsmap', label: 'Map' },
        { name: 'community', label: 'Community' },
    ];

    return (
        <View style={styles.navContainer}>
            {navItems.map((item) => {
                const isActive = pathname === `/${item.name}`;
                return (
                    <TouchableOpacity
                        key={item.name}
                        onPress={() => router.push(`/${item.name}`)}
                        style={[styles.navButton, isActive && styles.activeNavButton]}
                    >
                        <Text style={styles.navButtonText}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// Logout button component
function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        router.replace('/login');
    };

    return (
        <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
        >
            <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
    );
}

// Header right component combining navigation and logout
function HeaderRight() {
    return (
        <View style={styles.headerRightContainer}>
            <NavigationButtons />
            <LogoutButton />
        </View>
    );
}

export default function RootLayout() {
    return (
        <>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#0f172a' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerLeft: () => <AppTitle />,
                    headerTitle: () => null,
                    headerRight: () => <HeaderRight />,
                    headerBackVisible: false,
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
                <Stack.Screen name="confirm" options={{ headerShown: false }} />
                <Stack.Screen name="resetpassword" options={{ headerShown: false }} />
                
                {/* Main app pages with navigation buttons in header */}
                <Stack.Screen name="home" options={{}} />
                <Stack.Screen name="fishdata" options={{}} />
                <Stack.Screen name="mycatches" options={{}} />
                <Stack.Screen name="spotsmap" options={{}} />
                <Stack.Screen name="community" options={{}} />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}

const styles = StyleSheet.create({
    appTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    navButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginHorizontal: 2,
        borderRadius: 6,
    },
    activeNavButton: {
        backgroundColor: 'rgba(255, 255,  255, 0.2)',
    },
    navButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    logoutButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginHorizontal: 8,
        marginRight: 16,
        borderRadius: 6,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.5)',
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 12,
        fontWeight: '600',
    },
});
