import React from 'react';
import {View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import { BaitCard } from '../ui/BaitCard';

type BaitResult = {
    bait: string;
    count: number;
}

type Props = {
    species: string;
    onSpeciesChange: (species: string) => void;
    results: BaitResult[];
    loading: boolean;
    error: string | null;
    onSearch: () => void;
};

export function TopBaitView({species, onSpeciesChange, results, loading, error, onSearch}: Props){
    return (
        <View style={styles.container}>
            <Text style={styles.title}> Top Bait by Species</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter species (e.g. Bass)"
                value={species}
                onChangeText={onSpeciesChange}
            />

            <Button
                title="Search"
                onPress={onSearch}
            />

            {loading && <ActivityIndicator style={{marginTop: 20}} />}
            {error && <Text style={styles.error}>{error}</Text>}

            <FlatList
                data={results}
                keyExtractor={(item) => item.bait}
                //renderItem will generate a bait card for each item in results. Then FlatList will organize
                //these cards into a list.
                renderItem={({item, index}) => {
                    return <BaitCard bait={item.bait} count={item.count} rank={index + 1} />
                }}
                />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    title: {fontSize: 22, fontWeight: 'bold', marginBottom: 12},
    input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8},
    error: {color: 'red', marginTop: 8},
});