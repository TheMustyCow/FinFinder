// pages/mycatches.tsx
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/community/Card';
import { catchesService, type Catch } from '../services/catches';

export default function MyCatchesScreen() {
    const [catches, setCatches] = useState<Catch[]>([]);

    useEffect(() => {
        loadCatches();
        return catchesService.subscribe(loadCatches);
    }, []);

    const loadCatches = async () => {
        const myCatches = await catchesService.getMyCatches();
        setCatches(myCatches);
    };

    const postCatch = async (catchId: string) => {
        const result = await catchesService.postCatchToCommunity(catchId);

        if (!result.success) {
            Alert.alert('Unable to post catch', result.error ?? 'Please try again.');
            return;
        }

        await loadCatches();
    };

    const previewCatch = catches.find((catchData) => !catchData.isPostedToCommunity) ?? catches[0];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>My Catches</Text>
                <Text style={styles.subtitle}>Choose a logged catch and add it to the community feed.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {previewCatch && (
                    <View style={styles.previewSection}>
                        <Text style={styles.sectionTitle}>Community card mock</Text>
                        <Card catchData={previewCatch} variant="preview" />
                    </View>
                )}

                <View style={styles.listSection}>
                    <Text style={styles.sectionTitle}>Logged catches</Text>
                    {catches.map((catchData) => (
                        <View key={catchData.id} style={styles.catchRow}>
                            <View style={styles.catchInfo}>
                                <Text style={styles.catchName}>{catchData.fish}</Text>
                                <Text style={styles.catchMeta}>
                                    {catchData.location} | {catchData.weight} lbs | {catchData.length} in
                                </Text>
                                <Text style={styles.catchDesc} numberOfLines={2}>{catchData.desc}</Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.postButton,
                                    catchData.isPostedToCommunity && styles.postButtonDisabled,
                                ]}
                                onPress={() => postCatch(catchData.id)}
                                disabled={catchData.isPostedToCommunity}
                            >
                                <Text style={styles.postButtonText}>
                                    {catchData.isPostedToCommunity ? 'Posted' : 'Post'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
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
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    subtitle: {
        color: '#64748b',
        fontSize: 13,
        marginTop: 6,
        textAlign: 'center',
    },
    content: {
        padding: 24,
        paddingHorizontal: 40,
    },
    previewSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    listSection: {
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
    },
    sectionTitle: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    catchRow: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d7e2e8',
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    catchInfo: {
        flex: 1,
        paddingRight: 14,
    },
    catchName: {
        color: '#0f172a',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    catchMeta: {
        color: '#005c87',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 5,
    },
    catchDesc: {
        color: '#475569',
        fontSize: 13,
        lineHeight: 18,
    },
    postButton: {
        backgroundColor: '#005c87',
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 10,
        minWidth: 84,
        alignItems: 'center',
    },
    postButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    postButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
    },
});
