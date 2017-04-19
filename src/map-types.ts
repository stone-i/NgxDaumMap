import {LatLngLiteral} from './services/daum-maps-types';

// exported map types
export {KmlMouseEvent, DataMouseEvent, LatLngBounds, LatLngBoundsLiteral, LatLngLiteral, PolyMouseEvent} from './services/daum-maps-types';

/**
 * MouseEvent gets emitted when the user triggers mouse events on the map.
 */
export interface MouseEvent { coords: LatLngLiteral; }
