import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageGridBackground } from '../components/ui/ImageGridBackground';
import { colors } from '../constants/colors';

type WeatherData = {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
};

const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
const heroBannerImage = require('../assets/homeFishingBannerWide.png');

const getTodaysDate = () => new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

export default function Home() {
    const router = useRouter();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const todaysDate = useMemo(getTodaysDate, []);

    useEffect(() => {
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

        setWeather({
            temp: Math.floor(Math.random() * 30 + 50),
            humidity: Math.floor(Math.random() * 40 + 40),
            windSpeed: Math.floor(Math.random() * 15 + 1),
            condition: randomCondition,
        });
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBanner}>
                <Image
                    source={heroBannerImage}
                    resizeMode="cover"
                    style={styles.topBannerImage}
                />
                <View style={styles.topBannerOverlay} />
            </View>

            <ImageGridBackground>
                <View style={styles.contentContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.heroSection}>
                            <Text style={styles.heroTitle}>Welcome</Text>
                            <Text style={styles.heroText}>
                                Track your catches, check fishing conditions, and find your next spot.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Today's Conditions</Text>
                            <View style={styles.conditionsGrid}>
                                <ConditionItem label="Temp" value={weather ? `${weather.temp}°F` : '--'} />
                                <ConditionItem label="Weather" value={weather?.condition ?? '--'} />
                                <ConditionItem label="Wind" value={weather ? `${weather.windSpeed} mph` : '--'} />
                                <ConditionItem label="Humidity" value={weather ? `${weather.humidity}%` : '--'} />
                                <ConditionItem label="Date" value={todaysDate} />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Who We Are</Text>
                            <Text style={styles.bodyText}>
                                Fin Finder helps anglers track catches, discover fish data, review catch locations,
                                and stay connected with the community.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Explore</Text>
                            <View style={styles.navGrid}>
                                <NavCard label="Fish Data" onPress={() => router.push('/fishdata')} />
                                <NavCard label="My Catches" onPress={() => router.push('/mycatches')} />
                                <NavCard label="Spot Map" onPress={() => router.push('/spotsmap')} />
                                <NavCard label="Community" onPress={() => router.push('/community')} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </ImageGridBackground>
        </SafeAreaView>
    );
}

function ConditionItem({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>{label}</Text>
            <Text style={styles.conditionValue} numberOfLines={1}>{value}</Text>
        </View>
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
    safeArea: {
        flex: 1,
        backgroundColor: colors.pageBackground,
    },
    topBanner: {
        height: 220,
        width: '100%',
        backgroundColor: '#0f2f34',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBannerImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    topBannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.bannerOverlay,
        borderBottomWidth: 1,
        borderBottomColor: colors.bannerBorder,
    },
    contentContainer: {
        flex: 1,
        margin: 30,
        marginHorizontal: 100,
        marginTop: 30,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 22,
        rowGap: 22,
    },
    heroSection: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 20,
        alignItems: 'center',
    },
    heroTitle: {
        color: colors.primaryText,
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 6,
        textAlign: 'center',
    },
    heroText: {
        color: '#64748b',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
    section: {
        rowGap: 12,
        alignItems: 'center',
    },
    sectionTitle: {
        color: colors.primaryText,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 12,
        width: '100%',
    },
    conditionItem: {
        minHeight: 76,
        flex: 1,
        minWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#d7e2e8',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    conditionLabel: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    conditionValue: {
        color: colors.primaryText,
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    bodyText: {
        color: '#334155',
        fontSize: 15,
        lineHeight: 23,
        maxWidth: 860,
        textAlign: 'center',
    },
    navGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        width: '100%',
    },
    navCard: {
        width: '23%',
        minWidth: 150,
        minHeight: 72,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primaryButtonBackground,
        borderRadius: 8,
        paddingHorizontal: 14,
    },
    navText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
    },
});
