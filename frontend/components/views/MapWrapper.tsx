// components/views/MapWrapper.tsx
import { Platform } from 'react-native';

let MapComponent;

if (Platform.OS === 'web') {
    MapComponent = require('./WebMap').default;
} else {
    MapComponent = require('./TheMap.native').default;
}

export default function MapWrapper() {
    return <MapComponent />;
}