// components/views/MapWrapper.tsx
import { Platform } from 'react-native';
import type { CatchCoordinate } from '../../services/catchDraft';

export type MapWrapperProps = {
    selectionMode?: boolean;
    selectedCoordinate?: CatchCoordinate | null;
    showCommunityPins?: boolean;
    onSelectCoordinate?: (coordinate: CatchCoordinate) => void;
    onCancelSelection?: () => void;
};

let MapComponent;

if (Platform.OS === 'web') {
    MapComponent = require('./WebMap').default;
} else {
    MapComponent = require('./TheMap.native').default;
}

export default function MapWrapper(props: MapWrapperProps) {
    return <MapComponent {...props} />;
}
