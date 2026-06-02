import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ImageGridBackground } from '../ui/ImageGridBackground';
import { colors } from '../../constants/colors';

interface SignupViewProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    loading: boolean;
    onSignup: () => void;
}

export function SignupView({
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    onSignup,
}: SignupViewProps) {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Fin Finder</Text>
            </View>

            <ImageGridBackground scale={1.75}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.contentContainer}>
                            <View style={styles.formContainer}>
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>Sign up to start tracking your fishing dashboard.</Text>

                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput
                                    placeholder="Email address"
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                />

                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    style={styles.input}
                                />

                                {!!error && <Text style={styles.errorText}>{error}</Text>}

                                <TouchableOpacity
                                    style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                                    onPress={onSignup}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#ffffff" />
                                    ) : (
                                        <Text style={styles.signupButtonText}>Sign Up</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.footerRow}>
                                    <Text style={styles.footerText}>Already have an account?</Text>
                                    <TouchableOpacity onPress={() => router.push('/login')}>
                                        <Text style={styles.footerLink}>Log in</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageGridBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        zIndex: 2,
        elevation: 2,
    },
    headerTitle: {
        color: colors.primaryText,
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 30,
        justifyContent: 'center',
    },
    contentContainer: {
        width: '100%',
        maxWidth: 620,
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.82)',
        overflow: 'hidden',
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.24,
        shadowRadius: 24,
    },
    formContainer: {
        paddingVertical: 34,
        paddingHorizontal: 42,
    },
    title: {
        color: colors.primaryText,
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        color: '#64748b',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 28,
    },
    inputLabel: {
        color: '#334155',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 7,
    },
    input: {
        backgroundColor: '#f8fafc',
        color: colors.primaryText,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d7e2e8',
        marginBottom: 16,
        fontSize: 15,
    },
    errorText: {
        color: '#b91c1c',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 14,
    },
    signupButton: {
        backgroundColor: colors.primaryButtonBackground,
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 2,
    },
    signupButtonDisabled: {
        backgroundColor: colors.disabledButtonBackground,
    },
    signupButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    footerText: {
        color: '#64748b',
        fontSize: 14,
        marginRight: 5,
    },
    footerLink: {
        color: colors.primaryText,
        fontSize: 14,
        fontWeight: '700',
    },
});
