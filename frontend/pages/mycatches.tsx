import { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { catchesService, type Catch } from '../services/catches';

export default function MyCatches() {
    const [modalVisible, setModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [fish, setFish] = useState('');
    const [location, setLocation] = useState('');
    const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [bait, setBait] = useState('');
    const [notes, setNotes] = useState('');
    const [postToCommunity, setPostToCommunity] = useState(false);

    const [catches, setCatches] = useState<Catch[]>([]);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        loadCatches();
        return catchesService.subscribe(loadCatches);
    }, []);

    const loadCatches = async () => {
        try {
            const myCatches = await catchesService.getMyCatches();
            setCatches(myCatches);
            setLoadError('');
        } catch (error) {
            setLoadError(error instanceof Error ? error.message : 'Unable to load catches');
        }
    };

    const resetForm = () => {
        setFish('');
        setLocation('');
        setWeight('');
        setLength('');
        setBait('');
        setNotes('');
        setPostToCommunity(false);
    };

    const shareCatchToCommunity = async (catchId: string) => {
        const result = await catchesService.postCatchToCommunity(catchId);

        if (!result.success) {
            Alert.alert('Unable to share catch', result.error ?? 'Please try again.');
        }
    };

    const addCatch = async () => {
        const parsedWeight = Number(weight);
        const parsedLength = Number(length);

        if (
            !fish ||
            !location ||
            !weight ||
            !length ||
            Number.isNaN(parsedWeight) ||
            Number.isNaN(parsedLength) ||
            isSaving
        ) {
            return;
        }

        setIsSaving(true);

        try {
            const savedCatch = await catchesService.createCatch({
                fish,
                location,
                weight: parsedWeight,
                length: parsedLength,
                bait: bait || undefined,
                desc: notes || '',
            });

            if (postToCommunity) {
                await shareCatchToCommunity(savedCatch.id);
            }

            resetForm();
            setModalVisible(false);
            setLoadError('');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <Text style={styles.title}>🎣 My Catches</Text>

            {/* ADD BUTTON */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>+ Add Catch</Text>
            </TouchableOpacity>

            {/* LIST */}
            {!!loadError && <Text style={styles.errorText}>{loadError}</Text>}
            <ScrollView>
                {catches.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Text style={styles.fish}>🐟 {item.fish}</Text>

                        <Text style={styles.text}>📍 {item.location}</Text>
                        <Text style={styles.text}>⚖️ {item.weight} lbs</Text>
                        <Text style={styles.text}>📏 {item.length} in</Text>
                        {!!item.bait && <Text style={styles.text}>🪱 {item.bait}</Text>}
                        {!!item.desc && <Text style={styles.text}>📝 {item.desc}</Text>}
                        {item.isPostedToCommunity ? (
                            <Text style={styles.sharedText}>Shared to Community</Text>
                        ) : (
                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={() => shareCatchToCommunity(item.id)}
                            >
                                <Text style={styles.shareButtonText}>Share to Community</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* MODAL */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>

                    <View style={styles.modalContent}>

                        <Text style={styles.modalTitle}>Add New Catch 🎣</Text>

                        <TextInput
                            placeholder="Fish type"
                            placeholderTextColor="#cbd5f5"
                            style={styles.input}
                            value={fish}
                            onChangeText={setFish}
                        />

                        <TextInput
                            placeholder="Location"
                            placeholderTextColor="#cbd5f5"
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                        />

                        <TextInput
                            placeholder="Weight (lbs)"
                            placeholderTextColor="#cbd5f5"
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                        />

                        <TextInput
                            placeholder="Length (inches)"
                            placeholderTextColor="#cbd5f5"
                            style={styles.input}
                            value={length}
                            onChangeText={setLength}
                            keyboardType="numeric"
                        />

                        <TextInput
                            placeholder="Bait used"
                            placeholderTextColor="#cbd5f5"
                            style={styles.input}
                            value={bait}
                            onChangeText={setBait}
                        />

                        <TextInput
                            placeholder="Notes (weather, location details, etc.)"
                            placeholderTextColor="#cbd5f5"
                            style={styles.input}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                        />

                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setPostToCommunity((value) => !value)}
                        >
                            <View style={[styles.checkbox, postToCommunity && styles.checkboxChecked]}>
                                {postToCommunity && <Text style={styles.checkboxMark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>Post to Community</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                            onPress={addCatch}
                            disabled={isSaving}
                        >
                            <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save 🎣'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        padding: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1e293b',
    },

    addButton: {
        backgroundColor: '#0ea5e9',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },

    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    card: {
        backgroundColor: '#1e6f8b',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },

    fish: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    text: {
        color: '#cbd5f5',
        marginTop: 2,
    },

    errorText: {
        color: '#b91c1c',
        fontWeight: 'bold',
        marginBottom: 10,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: '70%',
        height: '70%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'space-between',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0ea5e9',
        marginBottom: 10,
        textAlign: 'center',
    },

    input: {
        backgroundColor: '#155e75',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },

    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#0ea5e9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    checkboxChecked: {
        backgroundColor: '#0ea5e9',
    },

    checkboxMark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 18,
    },

    checkboxLabel: {
        color: '#155e75',
        fontWeight: 'bold',
    },

    saveButton: {
        backgroundColor: '#0ea5e9',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },

    saveButtonDisabled: {
        backgroundColor: '#94a3b8',
    },

    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    shareButton: {
        backgroundColor: '#0ea5e9',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },

    shareButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    sharedText: {
        color: '#bbf7d0',
        fontWeight: 'bold',
        marginTop: 10,
    },

    cancelText: {
        color: '#9096ac',
        textAlign: 'center',
        marginTop: 10,
    },
});
