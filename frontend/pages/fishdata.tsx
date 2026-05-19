// pages/fishdata.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTopBait } from '../hooks/useTopBait';
import { usePopularLocations } from '../hooks/usePopularLocations';
import {useBestTimeOfDay} from "../hooks/useBestTimeOfDay";
import {useRarestFish} from "../hooks/useRarestFish";
import {useTopAnglers} from "../hooks/useTopAnglers";
import { BaitCard } from '../components/ui/BaitCard';
import { LocationCard } from '../components/ui/LocationCard';
import { Checkbox } from '@components/ui/Checkbox';
import {BestTimeCard} from "@components/ui/BestTimeCard";
import {RarestFishCard} from "@components/ui/RarestFishCard";
import {TopAnglersCard} from "@components/ui/TopAnglersCard"
import { ImageGridBackground } from '../components/ui/ImageGridBackground';

export default function FishingDataPage() {
    const [species, setSpecies] = useState<string>('');
    const [showBait, setShowBait] = useState<boolean>(false);
    const [showLocations, setShowLocations] = useState<boolean>(false);
    const [showBestTime, setBestTime] = useState<boolean>(false);
    const [showRarestFish, setRarestFish] = useState<boolean>(false);
    const [showTopAnglers, setTopAnglers] = useState<boolean>(false);

    //Note that when a hook function is called, all of the state variables defined in the hook function are
    //implicitly attached to the fibre node of the component that called that hook function.
    // In this case the FishingDataPage
    const { results: baitResults, loading: baitLoading, error: baitError, fetchTopBait } = useTopBait();
    const { results: locationResults, loading: locationLoading, error: locationError, fetchPopularLocations } = usePopularLocations();
    const { results: timeOfDayResults, loading: bestTimeLoading, error: bestTimeError, fetchBestTimeOfDay} = useBestTimeOfDay();
    const { results: rarestFishResults, loading: rarestFishLoading, error: rarestFishError, fetchRarestFish} = useRarestFish();
    const { results: topAnglersResults, loading: topAnglersLoading, error: topAnglersError, fetchTopAnglers} = useTopAnglers();

    const handleSearch = () => {
        if (showBait) fetchTopBait(species);
        if (showLocations) fetchPopularLocations(species);
        if(showBestTime) fetchBestTimeOfDay(species);
        if(showRarestFish) fetchRarestFish();
        if(showTopAnglers) fetchTopAnglers();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Fishing Data</Text>
            </View>

            <ImageGridBackground>
                <View style={styles.contentContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.queryPanel}>
                            {/* Species Based Queries */}
                            <Text style={styles.groupTitle}>Species Queries</Text>
                            <View style={styles.checkboxGroup}>
                                {/* Species Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter species (e.g. Bass)"
                                    placeholderTextColor="#94a3b8"
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
                                <Checkbox
                                    label="Rarest Fish"
                                    checked={showRarestFish}
                                    onPress={() => setRarestFish(!showRarestFish)}
                                />
                                <Checkbox
                                    label="Top Anglers"
                                    checked={showTopAnglers}
                                    onPress={() => setTopAnglers(!showTopAnglers)}
                                />
                            </View>

                            {/* Search Button */}
                            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                                <Text style={styles.searchButtonText}>Search</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Results Box */}
                        <View style={styles.resultsBox}>
                            <Text style={styles.resultsTitle}>Results</Text>

                            {/* Top Bait Results */}
                            {showBait && (
                                <View style={styles.resultSection}>
                                    <Text style={styles.sectionTitle}>Top Bait</Text>
                                    {baitLoading && <Text style={styles.statusText}>Loading...</Text>}
                                    {baitError && <Text style={styles.error}>{baitError}</Text>}
                                    {baitResults.map((item, index) => (
                                        <BaitCard key={item.bait} bait={item.bait} count={item.count} rank={index + 1} />
                                    ))}
                                </View>
                            )}

                            {/* Popular Locations Results */}
                            {showLocations && (
                                <View style={styles.resultSection}>
                                    <Text style={styles.sectionTitle}>Popular Locations</Text>
                                    {locationLoading && <Text style={styles.statusText}>Loading...</Text>}
                                    {locationError && <Text style={styles.error}>{locationError}</Text>}
                                    {locationResults.map((item, index) => (
                                        <LocationCard key={item.location} location={item.location} count={item.count} rank={index + 1} />
                                    ))}
                                </View>
                            )}
                            {/* Best Time Of Day Results */}
                            {showBestTime && (
                                <View style={styles.resultSection}>
                                    <Text style={styles.sectionTitle}>Best Time Of Day To Catch</Text>
                                    {bestTimeLoading && <Text style={styles.statusText}>Loading...</Text>}
                                    {bestTimeError && <Text style={styles.error}>{bestTimeError}</Text>}
                                    {timeOfDayResults.map((item, index) => (
                                        <BestTimeCard key={item.timeOfDay} timeOfDay={item.timeOfDay} count={item.count} rank={index + 1} />
                                    ))}
                                </View>
                            )}
                            {/* Rarest Fish Results */}
                            {showRarestFish && (
                                <View style={styles.resultSection}>
                                    <Text style={styles.sectionTitle}>Rarest Fish</Text>
                                    {rarestFishLoading && <Text style={styles.statusText}>Loading...</Text>}
                                    {rarestFishError && <Text style={styles.error}>{rarestFishError}</Text>}
                                    {rarestFishResults.map((item, index) => (
                                        <RarestFishCard key={item.species} species={item.species} count={item.count} rank={index + 1}/>
                                    ))}
                                </View>
                            )}
                            {/* Top Anglers Results */}
                            {showTopAnglers && (
                                <View style={styles.resultSection}>
                                    <Text style={styles.sectionTitle}>Top Anglers</Text>
                                    {topAnglersLoading && <Text style={styles.statusText}>Loading...</Text>}
                                    {topAnglersError && <Text style={styles.error}>{topAnglersError}</Text>}
                                    {topAnglersResults.map((item, index) => (
                                        <TopAnglersCard key={item.username} username={item.username} count={item.count} rank={index + 1}/>
                                    ))}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </ImageGridBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        color: '#111827',
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
        padding: 18,
    },
    queryPanel: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 18,
        marginBottom: 18,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#d7e2e8',
        borderRadius: 8,
        color: '#0f172a',
        paddingVertical: 11,
        paddingHorizontal: 12,
        marginBottom: 12,
        fontSize: 14,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    checkboxGroup: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#d7e2e8',
    },
    searchButton: {
        backgroundColor: '#005c87',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    resultsBox: {
        borderWidth: 1,
        borderColor: '#d7e2e8',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    resultsTitle: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    resultSection: {
        marginTop: 12,
    },
    sectionTitle: {
        color: '#334155',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    statusText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },
    error: {
        color: '#b91c1c',
        fontWeight: '600',
    },
});
