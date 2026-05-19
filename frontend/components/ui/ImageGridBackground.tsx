import type { ReactNode } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

interface ImageGridBackgroundProps {
    children: ReactNode;
    blurRadius?: number;
    overlayColor?: string;
    scale?: number;
    style?: StyleProp<ViewStyle>;
}

const backgroundImage = require('../../assets/loginBackgroundImage.jpg');
const backgroundTiles = Array.from({ length: 9 });

export function ImageGridBackground({
    children,
    blurRadius = 1,
    overlayColor = 'rgba(255, 255, 255, 0.34)',
    scale = 1.12,
    style,
}: ImageGridBackgroundProps) {
    return (
        <View style={[styles.backgroundStage, style]}>
            <View
                pointerEvents="none"
                style={[styles.backgroundTileGrid, { transform: [{ scale }] }]}
            >
                {backgroundTiles.map((_, index) => (
                    <Image
                        key={index}
                        source={backgroundImage}
                        resizeMode="cover"
                        blurRadius={blurRadius}
                        style={styles.backgroundTile}
                    />
                ))}
            </View>
            <View
                pointerEvents="none"
                style={[styles.backgroundOverlay, { backgroundColor: overlayColor }]}
            />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundStage: {
        flex: 1,
        backgroundColor: '#0f172a',
        overflow: 'hidden',
    },
    backgroundTileGrid: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    backgroundTile: {
        width: '33.3334%',
        height: '33.3334%',
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
});
