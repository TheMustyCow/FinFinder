declare module '*.css';

declare module 'leaflet' {
    export type LatLngExpression = [number, number] | { lat: number; lng: number };
    export type LatLngBoundsExpression = LatLngExpression[];

    export interface LeafletMouseEvent {
        latlng: {
            lat: number;
            lng: number;
        };
        originalEvent: MouseEvent;
    }

    export interface LeafletEventHandlerFnMap {
        click?: (event: LeafletMouseEvent) => void;
        contextmenu?: (event: LeafletMouseEvent) => void;
        [key: string]: ((event: LeafletMouseEvent) => void) | undefined;
    }

    export interface IconOptions {
        iconRetinaUrl?: string;
        iconUrl?: string;
        shadowUrl?: string;
        iconSize?: [number, number];
    }

    export class Icon {
        constructor(options?: IconOptions);
        static Default: typeof IconDefault;
    }

    export class IconDefault extends Icon {
        static prototype: object;
        static mergeOptions(options: IconOptions): void;
    }

    export interface LayerOptions {
        pane?: string;
        attribution?: string;
    }

    export interface InteractiveLayerOptions extends LayerOptions {
        interactive?: boolean;
        bubblingMouseEvents?: boolean;
    }

    export interface PathOptions extends InteractiveLayerOptions {
        stroke?: boolean;
        color?: string;
        weight?: number;
        opacity?: number;
        fill?: boolean;
        fillColor?: string;
        fillOpacity?: number;
    }

    export interface MarkerOptions extends InteractiveLayerOptions {
        icon?: Icon;
        keyboard?: boolean;
        title?: string;
        alt?: string;
    }

    export interface MapOptions {
        center?: LatLngExpression;
        zoom?: number;
        scrollWheelZoom?: boolean;
    }

    export interface FitBoundsOptions {
        paddingTopLeft?: [number, number];
        paddingBottomRight?: [number, number];
        padding?: [number, number];
        maxZoom?: number;
    }

    export interface TileLayerOptions extends LayerOptions {
        minZoom?: number;
        maxZoom?: number;
        subdomains?: string | string[];
    }

    export interface WMSOptions extends TileLayerOptions {
        layers?: string;
        styles?: string;
        format?: string;
        transparent?: boolean;
    }

    export interface WMSParams {
        [key: string]: string | number | boolean | undefined;
    }

    export interface PopupOptions {
        maxWidth?: number;
        minWidth?: number;
        closeButton?: boolean;
    }

    export interface TooltipOptions {
        permanent?: boolean;
        sticky?: boolean;
        direction?: string;
    }

    export interface CircleMarkerOptions extends PathOptions {
        radius?: number;
    }

    export interface CircleOptions extends CircleMarkerOptions {
        radius?: number;
    }

    export interface PolylineOptions extends PathOptions {
        smoothFactor?: number;
        noClip?: boolean;
    }

    export interface ImageOverlayOptions extends InteractiveLayerOptions {
        opacity?: number;
        alt?: string;
        interactive?: boolean;
    }

    export interface VideoOverlayOptions extends ImageOverlayOptions {
        autoplay?: boolean;
        loop?: boolean;
        keepAspectRatio?: boolean;
    }

    export interface GeoJSONOptions extends InteractiveLayerOptions {
        style?: PathOptions | ((feature?: unknown) => PathOptions);
    }

    export interface GridLayerOptions extends LayerOptions {
        tileSize?: number | [number, number];
        opacity?: number;
    }

    export interface ControlOptions {
        position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    }

    export class Evented {}
    export class Layer extends Evented {}
    export class GridLayer extends Layer {}
    export class Path extends Layer {}
    export class FeatureGroup extends Layer {}
    export class LayerGroup extends Layer {}
    export class Map extends Evented {}
    export class Marker<T = unknown> extends Layer {}
    export class Popup extends Layer {}
    export class Tooltip extends Layer {}
    export class TileLayer extends GridLayer {}
    export class Circle extends Path {}
    export class CircleMarker extends Circle {}
    export class Polygon extends Path {}
    export class Polyline extends Path {}
    export class Rectangle extends Polygon {}
    export class ImageOverlay extends Layer {}
    export class SVGOverlay extends ImageOverlay {}
    export class VideoOverlay extends ImageOverlay {}
    export class GeoJSON extends Layer {}

    export namespace Control {
        class Layers extends Evented {}
    }

    export class Control extends Evented {}

    const L: {
        Icon: typeof Icon & { Default: typeof IconDefault };
        Map: typeof Map;
        Marker: typeof Marker;
        Popup: typeof Popup;
        TileLayer: typeof TileLayer;
        Control: typeof Control;
    };

    export default L;
}
