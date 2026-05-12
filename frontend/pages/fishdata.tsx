// pages/fishdata.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTopBait } from '../hooks/useTopBait';
import { usePopularLocations } from '../hooks/usePopularLocations';
import {useBestTimeOfDay} from "../hooks/useBestTimeOfDay";
import { BaitCard } from '../components/ui/BaitCard';
import { LocationCard } from '../components/ui/LocationCard';
import { Checkbox } from '@components/ui/Checkbox';
import {BestTimeCard} from "@components/ui/BestTimeCard";

export default function FishingDataPage() {
    const [species, setSpecies] = useState<string>('');
    const [showBait, setShowBait] = useState<boolean>(false);
    const [showLocations, setShowLocations] = useState<boolean>(false);
    const [showBestTime, setBestTime] = useState<boolean>(false);

    //Note that when a hook function is called, all of the state variables defined in the hook function are
    //implicitly attached to the fibre node of the component that called that hook function.
    // In this case the FishingDataPage
    const { results: baitResults, loading: baitLoading, error: baitError, fetchTopBait } = useTopBait();
    const { results: locationResults, loading: locationLoading, error: locationError, fetchPopularLocations } = usePopularLocations();
    const { results: timeOfDayResults, loading: bestTimeLoading, error: bestTimeError, fetchBestTimeOfDay} = useBestTimeOfDay();
    const handleSearch = () => {
        if (showBait) fetchTopBait(species);
        if (showLocations) fetchPopularLocations(species);
        if(showBestTime) fetchBestTimeOfDay(species);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Fishing Data</Text>

            {/* Species Based Queries */}
            <Text style={styles.groupTitle}>Species Queries</Text>
            <View style={styles.checkboxGroup}>
                {/* Species Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter species (e.g. Bass)"
                    value={species}
                    onChangeText={setSpecies}
                />
                <Checkbox
                    label="Top Bait"
                    checked={showBait}
                    onPress={() => setShowBait(!showBait)}
                />
                <Checkbox
                    label="Popular Locations"
                    checked={showLocations}
                    onPress={() => setShowLocations(!showLocations)}
                />
                <Checkbox
                    label="Best Time Of Day To Catch"
                    checked={showBestTime}
                    onPress={() => setBestTime(!showBestTime)}
                />
            </View>

            {/* General Queries */}
            <Text style={styles.groupTitle}>General Queries</Text>
            <View style={styles.checkboxGroup}>
                {/* Top Anglers and Trending Catches will go here */}
            </View>

            {/* Search Button */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            {/* Results Box */}
            <View style={styles.resultsBox}>
                <Text style={styles.resultsTitle}>Results</Text>

                {/* Top Bait Results */}
                {showBait && (
                    <View>
                        <Text style={styles.sectionTitle}>Top Bait</Text>
                        {baitLoading && <Text>Loading...</Text>}
                        {baitError && <Text style={styles.error}>{baitError}</Text>}
                        {baitResults.map((item, index) => (
                            <BaitCard key={item.bait} bait={item.bait} count={item.count} rank={index + 1} />
                        ))}
                    </View>
                )}

                {/* Popular Locations Results */}
                {showLocations && (
                    <View>
                        <Text style={styles.sectionTitle}>Popular Locations</Text>
                        {locationLoading && <Text>Loading...</Text>}
                        {locationError && <Text style={styles.error}>{locationError}</Text>}
                        {locationResults.map((item, index) => (
                            <LocationCard key={item.location} location={item.location} count={item.count} rank={index + 1} />
                        ))}
                    </View>
                )}
                {/* Best Time Of Day Results */}
                {showBestTime && (
                    <View>
                        <Text style={styles.sectionTitle}>Best Time Of Day To Catch</Text>
                        {bestTimeLoading && <Text>Loading...</Text>}
                        {bestTimeError && <Text style={styles.error}>{bestTimeError}</Text>}
                        {timeOfDayResults.map((item, index) => (
                            <BestTimeCard key={item.timeOfDay} timeOfDay={item.timeOfDay} count={item.count} rank={index + 1} />
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 },
    groupTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginTop: 12, marginBottom: 6 },
    checkboxGroup: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchButton: {
        backgroundColor: '#0f172a',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
        alignSelf: 'center',
        paddingHorizontal: 40
    },
    searchButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    resultsBox: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    resultsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 4, color: '#444' },
    error: { color: 'red' },
});