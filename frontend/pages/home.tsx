//export { default } from '../pages/home';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
// import * as Location from 'expo-location';

type WeatherData = {
    main: {
        temp: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
    weather: {
        main: string;
        description: string;
    }[];
    name: string;
};

export default function Home() {
    const router = useRouter();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loadingWeather, setLoadingWeather] = useState(true);

    useEffect(() => {
    const fetchWeather = async () => {
        try {
            setLoadingWeather(true);

            console.log("☀️ GENERATING FAKE WEATHER");

            const conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"];

            const randomCondition =
                conditions[Math.floor(Math.random() * conditions.length)];

            const fakeWeather = {
                main: {
                    temp: Math.floor(Math.random() * 30 + 50), // 50–80°F
                    humidity: Math.floor(Math.random() * 40 + 40),
                },
                wind: {
                    speed: Math.floor(Math.random() * 15 + 1), // 1–15 mph
                },
                weather: [
                    {
                        main: randomCondition,
                        description: randomCondition.toLowerCase(),
                    },
                ],
                name: "Spokane",
            };

            setWeather(fakeWeather);

        } catch (err) {
            console.log("ERROR:", err);
            setWeather(null);
        } finally {
            setLoadingWeather(false);
        }
    };

    fetchWeather();
}, []);

    return (
        <ScrollView style={styles.container}>
            
            {/* HERO SECTION */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' }}
                style={styles.hero}
                imageStyle={{ opacity: 0.6 }}
            >
                <View style={styles.heroOverlay}>
                    <Text style={styles.welcome}>WELCOME TO</Text>
                    <Text style={styles.title}>Fin Finder</Text>
                    <Text style={styles.subtitle}>
                        Real-time fish data, catch locations, regulations & community — all in one place.
                    </Text>
                </View>
            </ImageBackground>

            {/* CONDITIONS */}
            <View style={styles.section}>
    <Text style={styles.sectionTitle}>Today's Conditions</Text>

    <View style={styles.weatherCard}>

        {/* HEADER */}
        <Text style={styles.locationText}>
            🌍 Spokane
        </Text>

        {loadingWeather ? (
            <Text style={styles.loadingText}>Loading weather...</Text>
        ) : weather ? (
            <>
                {/* BIG TEMP */}
                <Text style={styles.bigTemp}>
                    {Math.round(weather.main.temp)}°
                </Text>

                <Text style={styles.conditionText}>
                    {weather.weather[0].main}
                </Text>

                {/* DETAILS ROW */}
                <View style={styles.row}>

                    <View style={styles.box}>
                        <Text style={styles.icon}>🌡️</Text>
                        <Text style={styles.boxText}>
                            {weather.main.humidity}%
                        </Text>
                        <Text style={styles.label}>Humidity</Text>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.icon}>💨</Text>
                        <Text style={styles.boxText}>
                            {weather.wind.speed} mph
                        </Text>
                        <Text style={styles.label}>Wind</Text>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.icon}>
                            {weather.weather[0].main === "Sunny"
                                ? "☀️"
                                : weather.weather[0].main === "Rainy"
                                ? "🌧️"
                                : "☁️"}
                        </Text>
                        <Text style={styles.boxText}>
                            {weather.weather[0].main}
                        </Text>
                        <Text style={styles.label}>Condition</Text>
                    </View>

                </View>
            </>
        ) : (
            <Text style={styles.loadingText}>Weather unavailable</Text>
        )}
    </View>
</View>

            {/* WHO WE ARE */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Who We Are</Text>

                <View style={styles.aboutCard}>
                    <Text style={styles.aboutText}>
                        Fin Finder helps anglers track catches, discover fish data, and log real-time fishing conditions.
                        Built for both beginners and experienced fishermen, our goal is to make fishing smarter,
                        easier, and more connected.
                    </Text>
                </View>
            </View>

            {/* EXPLORE */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Explore</Text>

                <View style={styles.grid}>
                    <NavCard label="Fish Data" onPress={() => router.push('/fishdata')} />
                    <NavCard label="My Catches" onPress={() => router.push('/mycatches')} />
                    <NavCard label="Spot Map" onPress={() => router.push('/spotsmap')} />
                    <NavCard label="Community" onPress={() => router.push('/community')} />
                </View>
            </View>

        </ScrollView>
    );
}

function NavCard({ label, onPress }: { label: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.navCard} onPress={onPress}>
            <Text style={styles.navText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },

    hero: {
        height: 220,
        justifyContent: 'flex-end',
    },

    heroOverlay: {
        padding: 20,
    },

    welcome: {
        color: '#cbd5f5',
        fontSize: 12,
        letterSpacing: 2,
    },

    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 5,
    },

    subtitle: {
        color: '#e2e8f0',
        fontSize: 14,
        maxWidth: '90%',
    },

    section: {
        padding: 16,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1e293b',
    },

    card: {
        backgroundColor: '#1e6f8b',
        borderRadius: 12,
        padding: 20,
    },

    conditionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    conditionItem: {
        alignItems: 'center',
    },

    conditionValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    conditionLabel: {
        color: '#cbd5f5',
        fontSize: 12,
        marginTop: 4,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    navCard: {
        width: '48%',
        backgroundColor: '#1e6f8b',
        padding: 20,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
    },

    navText: {
        color: '#fff',
        fontWeight: '600',
    },
    weatherCard: {
    backgroundColor: '#1e6f8b', // EXACT same as Fish Data + nav cards
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
},

locationText: {
    color: '#d1fae5',
    fontSize: 14,
    marginBottom: 10,
},

bigTemp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
},

conditionText: {
    fontSize: 18,
    color: '#e0f2fe',
    marginBottom: 15,
},

row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
},

box: {
    alignItems: 'center',
    flex: 1,
},

icon: {
    fontSize: 22,
    marginBottom: 5,
},

boxText: {
    color: '#fff',
    fontWeight: 'bold',
},

label: {
    color: '#bae6fd',
    fontSize: 12,
},
loadingText: {
    color: '#d1fae5',
    marginTop: 10,
    fontSize: 14,
},

aboutCard: {
    backgroundColor: '#1e6f8b',
    padding: 15,
    borderRadius: 12,
},

aboutText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
},
});