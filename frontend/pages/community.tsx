// pages/community.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import Card from '../components/community/Card';

export default function CommunityScreen() {
    const cards = Array.from({ length: 63 }, (_, i) => i);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 18;
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }, 0);
    }, [currentPage]);

    const currentCards = cards.slice(
        currentPage * cardsPerPage,
        (currentPage + 1) * cardsPerPage
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Community</Text>
            </View>
            <View style={styles.contentContainer}>
                <ScrollView 
                    ref={scrollViewRef}
                    style={styles.scrollView} 
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.grid}>
                        {currentCards.map((_, index) => (
                            <Card 
                                key={currentPage * cardsPerPage + index} 
                                cardNumber={currentPage * cardsPerPage + index + 1} 
                            />
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.pagination}>
                    <TouchableOpacity
                        style={[styles.button, currentPage === 0 && styles.buttonDisabled]}
                        onPress={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                    >
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageIndicator}>Page {currentPage + 1} of {totalPages}</Text>
                    <TouchableOpacity
                        style={[styles.button, currentPage === totalPages - 1 && styles.buttonDisabled]}
                        onPress={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    contentContainer: {
        flex: 1,
        margin: 30,
        marginHorizontal: 100,
        marginTop: 30,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        flexDirection: 'column',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#005c87',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 15,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    pageIndicator: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
});
