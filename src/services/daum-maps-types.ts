export var daum: any;

export interface DaumMap extends MVCObject {
  data?: Data;
  constructor(el: HTMLElement, opts?: MapOptions): void;

  setCenter(latLng: LatLng|LatLngLiteral): void;
  getCenter(): LatLng;

  setLevel(level: number,options?:Object): void;
  getLevel(): number;

  setMapTypeId(mapTypeId: MapTypeId): void;
  getMapTypeId(): MapTypeId;

  setBounds(bounds: LatLngBounds, paddingTop?: number, paddingRight?: number,paddingBottom?: number,paddingLeft?: number): void;
  getBounds(): LatLngBounds;

  PanBy(dx: number, dy: number): void;
  panTo(latLng: LatLng|LatLngLiteral, padding?: number): void;

  addControl(control: MapTypeControl|ZoomControl,position: number): void;
  removeControl(control: MapTypeControl|ZoomControl) :void;

  setDraggable(draggable: boolean): void;
  getDraggable(): boolean;

  setZoomable(zoomable: boolean): void;
  getZoomable(): boolean;

  setProjectionId(projectionId: ProjectionId): void;
  getProjectionId(): ProjectionId;

  relayout(): void;

  addOverlayMapTypeId(mapTypeId: MapTypeId): void;
  removeOverlayMapTypeId(mapTypeId: MapTypeId): void;

  setKeyboardShortcuts(active: boolean): void;
  getKeyboardShortcuts(): boolean;

  setCopyrightPosition(copyrightPosition: CopyrightPosition,reversed?: boolean): void;

  getProjection(): MapProjection;

  setCursor(style: string): void;
}



export interface Marker extends MVCObject {
  constructor(options?: MarkerOptions): void;
  setMap(map: DaumMap): void;
  getMap(): DaumMap;
  setImage(image: MarkerImage): void;
  getImage(): MarkerImage;
  setPosition(latLng: LatLng|LatLngLiteral): void;
  getPosition(): LatLng;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
  setVisible(visible: boolean): void;
  getVisible(): boolean;
  setTitle(title: string): void;
  getTitle(): string;
  setDraggable(draggable: boolean): void;
  getDraggable(): boolean;
  setClickable(clickable: boolean): void;
  getClickable(): boolean;
  setAltitude(altitude: number): void;
  getAltitude(): number;
  setRange(range: number): void;
  getRange(): number;
  setOpacity(opacity: number): void;
  getOpacity(): number;
}

export interface MarkerOptions {
  map?: DaumMap;
  position?: LatLng|LatLngLiteral|Viewpoint;
  image?: MarkerImage;
  title?: string;
  draggable?: boolean;
  clickable?: boolean;
  zIndex?: number;
  opacity?: number;
  altitude?: number;
  range?: number;
}

export interface MarkerImage {
  constructor(src: string,size: Size, options?:MarkerImageOptions): void;
}

export interface MarkerImageOptions{
  alt?: string;
  coords?: string;
  offset?: Point;
  shape?: string;
  spriteOrigin?: Point;
  spriteSize?: Size;
}
export interface Viewpoint{
  constructor(pan: number, tilt: number, zoom: number, panoId?: number): void;
}

export interface Circle extends MVCObject {
  getBounds(): LatLngBounds;
  getCenter(): LatLng;
  getDraggable(): boolean;
  getEditable(): boolean;
  getMap(): DaumMap;
  getRadius(): number;
  getVisible(): boolean;
  setCenter(center: LatLng|LatLngLiteral): void;
  setDraggable(draggable: boolean): void;
  setEditable(editable: boolean): void;
  setMap(map: DaumMap): void;
  setOptions(options: CircleOptions): void;
  setRadius(radius: number): void;
  setVisible(visible: boolean): void;
}

export interface CircleOptions {
  center?: LatLng|LatLngLiteral;
  clickable?: boolean;
  draggable?: boolean;
  editable?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  map?: DaumMap;
  radius?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokePosition?: 'CENTER'|'INSIDE'|'OUTSIDE';
  strokeWeight?: number;
  visible?: boolean;
  zIndex?: number;
}

export interface LatLngBounds {
  constructor(sw:LatLng, ne:LatLng): void;
  equals(other: LatLngBounds|LatLngBoundsLiteral): boolean;
  toString(): string;
  getNorthEast(): LatLng;
  getSouthWest(): LatLng;
  isEmpty(): boolean;
  extend(point: LatLng): void;
  contain(latLng: LatLng): boolean;
}

export interface LatLngBoundsLiteral {
  east: number;
  north: number;
  south: number;
  west: number;
}



export interface MouseEvent { latLng: LatLng; }

export interface MapOptions {
  center?: LatLngLiteral|LatLng;
  level?: number;
  mapTypeId?: MapTypeId;
  draggable?: boolean;
  scrollwheel?: boolean;
  disableDoubleClick?: boolean;
  disableDoubleClickZoom?: boolean;
  projectionId?: string;
  tileAnimation?: boolean;
  keyboardShortcuts?: boolean|Object;
}

export interface MapTypeStyle {
  elementType?: 'all'|'geometry'|'geometry.fill'|'geometry.stroke'|'labels'|'labels.icon'|
      'labels.text'|'labels.text.fill'|'labels.text.stroke';
  featureType?: 'administrative'|'administrative.country'|'administrative.land_parcel'|
      'administrative.locality'|'administrative.neighborhood'|'administrative.province'|'all'|
      'landscape'|'landscape.man_made'|'landscape.natural'|'landscape.natural.landcover'|
      'landscape.natural.terrain'|'poi'|'poi.attraction'|'poi.business'|'poi.government'|
      'poi.medical'|'poi.park'|'poi.place_of_worship'|'poi.school'|'poi.sports_complex'|'road'|
      'road.arterial'|'road.highway'|'road.highway.controlled_access'|'road.local'|'transit'|
      'transit.line'|'transit.station'|'transit.station.airport'|'transit.station.bus'|
      'transit.station.rail'|'water';
  stylers: MapTypeStyler[];
}

/**
 *  If more than one key is specified in a single MapTypeStyler, all but one will be ignored.
 */
export interface MapTypeStyler {
  color?: string;
  gamma?: number;
  hue?: string;
  invert_lightness?: boolean;
  lightness?: number;
  saturation?: number;
  visibility?: string;
  weight?: number;
}

export interface InfoWindow extends MVCObject {
  constructor(opts?: InfoWindowOptions): void;
  open(map?: DaumMap, marker?: Marker): void;
  close(): void;
  getMap(): DaumMap;

  getContent(): string|Node;
  getPosition(): LatLng;
  getZIndex(): number;
  getAltitude(): number;
  getRange(): number;

  setContent(content: string|Node): void;
  setOptions(options: InfoWindowOptions): void;
  setPosition(position: LatLng|LatLngLiteral): void;
  setZIndex(zIndex: number): void;
  setAltitude(altitude: number): void;
  setRange(range: number): void;
}

export interface MVCObject { addListener(eventName: string, handler: Function): MapsEventListener; }

export interface MapsEventListener { remove(): void; }

export interface Size {
  height: number;
  width: number;
  equals(other: Size): boolean;
  toString(): string;
}

export interface Event{
    addListener(target:EventTarget,type:string,handler:Function): void
    removeListener(target:EventTarget,type:string,handler:Function): void;
}

export interface InfoWindowOptions {
  content?: string|Node;
  disableAutoPan?: boolean;
  map?: DaumMap,
  position?: LatLngLiteral|LatLng,
  removable?:boolean,
  zIndex?: number,
  altitude?: number,
  range?: number
}

export interface Point {
  x: number;
  y: number;
  equals(other: Point): boolean;
  toString(): string;
}

export interface GoogleSymbol {
  anchor?: Point;
  fillColor?: string;
  fillOpacity?: string;
  labelOrigin?: Point;
  path?: string;
  rotation?: number;
  scale?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
}

export interface IconSequence {
  fixedRotation?: boolean;
  icon?: GoogleSymbol;
  offset?: string;
  repeat?: string;
}

export interface PolylineOptions {
  clickable?: boolean;
  draggable?: boolean;
  editable?: boolean;
  geodesic?: boolean;
  icon?: Array<IconSequence>;
  map?: DaumMap;
  path?: Array<LatLng>|Array<LatLng|LatLngLiteral>;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  visible?: boolean;
  zIndex?: number;
}

export interface Polyline extends MVCObject {
  getDraggable(): boolean;
  getEditable(): boolean;
  getMap(): DaumMap;
  getPath(): Array<LatLng>;
  getVisible(): boolean;
  setDraggable(draggable: boolean): void;
  setEditable(editable: boolean): void;
  setMap(map: DaumMap): void;
  setOptions(options: PolylineOptions): void;
  setPath(path: Array<LatLng|LatLngLiteral>): void;
  setVisible(visible: boolean): void;
}

/**
 * PolyMouseEvent gets emitted when the user triggers mouse events on a polyline.
 */
export interface PolyMouseEvent extends MouseEvent {
  edge: number;
  path: number;
  vertex: number;
}

export interface PolygonOptions {
  clickable?: boolean;
  draggable?: boolean;
  editable?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  geodesic?: boolean;
  icon?: Array<IconSequence>;
  map?: DaumMap;
  paths?: Array<LatLng|LatLngLiteral>|Array<Array<LatLng|LatLngLiteral>>;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  visible?: boolean;
  zIndex?: number;
}

export interface Polygon extends MVCObject {
  getDraggable(): boolean;
  getEditable(): boolean;
  getMap(): DaumMap;
  getPath(): Array<LatLng>;
  getPaths(): Array<Array<LatLng>>;
  getVisible(): boolean;
  setDraggable(draggable: boolean): void;
  setEditable(editable: boolean): void;
  setMap(map: DaumMap): void;
  setPath(path: Array<LatLng>|Array<LatLng|LatLngLiteral>): void;
  setOptions(options: PolygonOptions): void;
  setPaths(paths: Array<Array<LatLng|LatLngLiteral>>|Array<LatLng|LatLngLiteral>): void;
  setVisible(visible: boolean): void;
}

export interface KmlLayer extends MVCObject {
  getDefaultViewport(): LatLngBounds;
  getMap(): DaumMap;
  getMetadata(): KmlLayerMetadata;
  getStatus(): KmlLayerStatus;
  getUrl(): string;
  getZIndex(): number;
  setMap(map: DaumMap): void;
  setOptions(options: KmlLayerOptions): void;
  setUrl(url: string): void;
  setZIndex(zIndex: number): void;
}

/**
 * See: https://developers.google.com/maps/documentation/javascript/reference?hl=de#KmlLayerStatus
 */
export type KmlLayerStatus = 'DOCUMENT_NOT_FOUND' |
    'DOCUMENT_TOO_LARGE' | 'FETCH_ERROR' | 'INVALID_DOCUMENT' | 'INVALID_REQUEST' |
    'LIMITS_EXCEEDED' | 'OK' | 'TIMED_OUT' | 'UNKNOWN';

/**
 * See: https://developers.google.com/maps/documentation/javascript/reference?hl=de#KmlLayerMetadata
 */
export interface KmlLayerMetadata {
  author: KmlAuthor;
  description: string;
  hasScreenOverlays: boolean;
  name: string;
  snippet: string;
}

export interface KmlAuthor {
  email: string;
  name: string;
  uri: string;
}

export interface KmlLayerOptions {
  clickable?: boolean;
  map?: DaumMap;
  preserveViewport?: boolean;
  screenOverlays?: boolean;
  suppressInfoWindows?: boolean;
  url?: string;
  zIndex?: number;
}

export interface KmlFeatureData {
  author: KmlAuthor;
  description: string;
  id: string;
  infoWindowHtml: string;
  name: string;
  snippet: string;
}

export interface KmlMouseEvent extends MouseEvent {
  featureData: KmlFeatureData;
  pixelOffset: Size;
}

export interface Data extends MVCObject {
  features: Feature[];
  constructor(options?: DataOptions): void;
  addGeoJson(geoJson: Object, options?: GeoJsonOptions): Feature[];
  remove(feature: Feature): void;
  setControlPosition(controlPosition: ControlPosition): void;
  setControls(controls: string[]): void;
  setDrawingMode(drawingMode: string): void;
  setMap(map: DaumMap): void;
  /* tslint:disable */
  /*
  * Tslint configuration check-parameters will prompt errors for these lines of code.
  * https://palantir.github.io/tslint/rules/no-unused-variable/
  */
  setStyle(style: () => void): void;
  forEach(callback: (feature: Feature) => void): void;
  /* tslint:enable */
}

export interface Feature extends MVCObject {
  id?: number|string|undefined;
  geometry: Geometry;
  properties: any;
}

export interface DataOptions{
  controlPosition?: ControlPosition;
  controls?: string[];
  drawingMode?: string;
  featureFactory?: (geometry: Geometry) => Feature;
  map?: DaumMap;
  style?: () => void;
}

export interface DataMouseEvent extends MouseEvent {
  feature: Feature;
}

export interface GeoJsonOptions {
  idPropertyName: string;
}

export interface Geometry {
  type: string;
}

/**
 * Identifiers used to specify the placement of controls on the map. Controls are
 * positioned relative to other controls in the same layout position. Controls that
 * are added first are positioned closer to the edge of the map.
 */
export enum ControlPosition {
  BOTTOM,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  LEFT,
  RIGHT,
  TOP,
  TOP_LEFT,
  TOP_RIGHT
}

export interface Tileset{
  constructor(width: number,
    height: number,
    urlFunc: number,
    copyright: number,
    dark: number,
    minZoom: number,
    maxZoom: number
  ): void;
  add(id: string, tileset:Tileset): void;
}
export interface TilesetCopyright{
  constructor(msg: string, shortMsg: string, minZoom: number): void;
}


/***** Controls *****/
/** Options for the rendering of the map type control. */
export interface MapTypeControlOptions {
  /** IDs of map types to show in the control. */
  mapTypeIds?: (MapTypeId|string)[];
  /**
   * Position id. Used to specify the position of the control on the map.
   * The default position is TOP_RIGHT.
   */
  position?: ControlPosition;
  /** Style id. Used to select what style of map type control to display. */
  style?: MapTypeControlStyle;
}

export enum MapTypeControlStyle {
  DEFAULT,
  DROPDOWN_MENU,
  HORIZONTAL_BAR
}

export interface OverviewMapControlOptions {
  opened?: boolean;
}

/** Options for the rendering of the pan control. */
export interface PanControlOptions {
  /**
   * Position id. Used to specify the position of the control on the map.
   * The default position is TOP_LEFT.
   */
  position?: ControlPosition;
}

/** Options for the rendering of the rotate control. */
export interface RotateControlOptions {
  /**
   * Position id. Used to specify the position of the control on the map.
   * The default position is TOP_LEFT.
   */
  position?: ControlPosition;
}

/** Options for the rendering of the scale control. */
export interface ScaleControlOptions {
  /** Style id. Used to select what style of scale control to display. */
  style?: ScaleControlStyle;
}

export enum ScaleControlStyle {
  DEFAULT
}

/** Options for the rendering of the Street View pegman control on the map. */
export interface StreetViewControlOptions {
  /**
   * Position id. Used to specify the position of the control on the map. The
   * default position is embedded within the navigation (level and pan) controls.
   * If this position is empty or the same as that specified in the
   * zoomControlOptions or panControlOptions, the Street View control will be
   * displayed as part of the navigation controls. Otherwise, it will be displayed
   * separately.
   */
  position?: ControlPosition;
}

/** Options for the rendering of the level control. */
export interface ZoomControlOptions {
  /**
   * Position id. Used to specify the position of the control on the map.
   * The default position is TOP_LEFT.
   */
  position?: ControlPosition;
  style?: ZoomControlStyle;
}

export enum ZoomControlStyle {
  DEFAULT,
  LARGE,
  SMALL
}

/** Options for the rendering of the fullscreen control. */
export interface FullscreenControlOptions {
  /**
   * Position id. Used to specify the position of the control on the map.
   * The default position is RIGHT_TOP.
   */
  position?: ControlPosition;
}

////////////////////////////////////////////////////
export interface MapTypeControl{

}

export interface ZoomControl{

}

export enum ProjectionId{
  /**
  * 투영 없는 API 내부의 좌표계 자체.
  * left-bottom을 (0,0)으로 하는 픽셀단위의 좌표계.
  */
  NONE,
  /**
  * API 내부 좌표계를 WCongnamul좌표계로 투영.
  * 외부에서 WCongnamul 좌표를 받아 사용가능.
  */
  WCONG
}

//copyright의 위치가 상수값으로 정의되어 있다.
export enum CopyrightPosition{
  //왼쪽아래
  BOTTOMLEFT,
  //오른쪽아래
  BOTTOMRIGHT
}

export interface MapProjection{
  pointFromCoords(latlng: LatLng): Point;
  coordsFromPoint(point: Point): LatLng;
  containerPointFromCoords(latlng: LatLng): Point;
  coordsFromContainerPoint(point: Point): LatLng;
}

export interface LatLng {
  constructor(lat: number, lng: number): void;
  getLat(): number;
  getLng(): number;
  equals(latlng: LatLng): boolean;
  toString(): string;
}

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export enum MapTypeId {
  /** This map type displays a transparent layer of major streets on satellite images. */
  ROADMAP,
  /** This map type displays a normal street map. */
  SKYVIEW,
  /** This map type displays satellite images. */
  HYBRID,
  /** This map type displays maps with physical features such as terrain and vegetation. */
  ROADVIEW,

  OVERLAY,

  TRAFFIC,

  TERRAIN,

  BICYCLE,

  BICYCLE_HYBRID,

  USE_DISTRICT
}
