//export { default } from '../pages/mycatches';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useState } from 'react';

type Catch = {
    id: number;
    fish: string;
    location: string;
    weight: string;
    length: string;
    bait: string;
    notes: string;
    photo?: string;
};

export default function MyCatches() {
    const [modalVisible, setModalVisible] = useState(false);

    const [fish, setFish] = useState('');
    const [location, setLocation] = useState('');
    const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [bait, setBait] = useState('');
    const [notes, setNotes] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

    const [catches, setCatches] = useState<Catch[]>([]);

    const addCatch = () => {
    if (!fish || !location || !weight) return;

    const newCatch: Catch = {
        id: Date.now(),
        fish,
        location,
        weight,
        length,
        bait,
        notes,
        photo: photo ?? undefined,
    };

    setCatches([newCatch, ...catches]);

    setFish('');
    setLocation('');
    setWeight('');
    setLength('');
    setBait('');
    setNotes('');
    setPhoto(null);
    setModalVisible(false);
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
            <ScrollView>
                {catches.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Text style={styles.fish}>🐟 {item.fish}</Text>

                        <Text style={styles.text}>📍 {item.location}</Text>
                        <Text style={styles.text}>⚖️ {item.weight} lbs</Text>
                        <Text style={styles.text}>📏 {item.length} in</Text>
                        <Text style={styles.text}>🪱 {item.bait}</Text>
                        <Text style={styles.text}>📝 {item.notes}</Text>
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
                        <TouchableOpacity
                            style={styles.photoButton}
                            onPress={() => setPhoto('fake-photo-placeholder')}
                        >
                            <Text style={{ color: '#fff' }}>
                                📸 Add Photo (placeholder)
                            </Text>
                        </TouchableOpacity>

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
                        />

                        <TextInput
                            placeholder="Length (inches)"
                            placeholderTextColor="#cbd5f5"
                            style={styles.input}
                            value={length}
                            onChangeText={setLength}
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

                        <TouchableOpacity style={styles.saveButton} onPress={addCatch}>
                            <Text style={styles.saveText}>Save 🎣</Text>
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

    saveButton: {
        backgroundColor: '#0ea5e9',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },

    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    cancelText: {
        color: '#9096ac',
        textAlign: 'center',
        marginTop: 10,
    },

    photoButton: {
    backgroundColor: '#155e75',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
},
});