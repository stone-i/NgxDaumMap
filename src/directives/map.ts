import { DaumMap } from './../services/daum-maps-types';
import {Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {MouseEvent} from '../map-types';
import {DaumMapsAPIWrapper} from '../services/daum-maps-api-wrapper';
import {
  daum, FullscreenControlOptions, LatLng, LatLngLiteral, MapTypeControlOptions, MapTypeId, PanControlOptions,
  RotateControlOptions, ScaleControlOptions, StreetViewControlOptions, ZoomControlOptions
} from '../services/daum-maps-types';
import {LatLngBounds, LatLngBoundsLiteral, MapTypeStyle} from '../services/daum-maps-types';
import {InfoWindowManager} from '../services/managers/info-window-manager';
import {MarkerManager} from '../services/managers/marker-manager';
import {WindowRef} from "../utils/browser-globals";

/**
 * admMap renders a Daum Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the
 * element `adm-map`.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  styles: [`
 *    adm-map {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <adm-map [latitude]="lat" [longitude]="lng" [level]="level">
 *    </adm-map>
 *  `
 * })
 * ```
 */
@Component({
  selector: 'adm-map',
  providers: [
    DaumMapsAPIWrapper, MarkerManager, InfoWindowManager
  ],
  inputs: [
    'longitude', 'latitude', 'level', 'draggable',
    'disableDoubleClickZoom', 'disableCoudbleClick', 'scrollwheel',
    'keyboardShortcuts', 'projectionId', 'tileAnimation'
  ],
  outputs: [
    'center_changed', 'zoom_start', 'zoom_changed', 'bounds_changed',
    'click', 'dblclick', 'rightclick', 'mousemove', 'dragstart', 'dragend',
    'idle', 'tilesloaded', 'maptypeid_changed', 'mapReady'
  ],
  host: {
    // todo: deprecated - we will remove it with the next version
    '[class.sebm-google-map-container]': 'true'
  },
  styles: [`
    .adm-map-container-inner {
      width: inherit;
      height: inherit;
    }
    .adm-map-content {
      display:none;
    }
  `],
  template: `
    <div class='adm-map-container-inner sebm-google-map-container-inner'></div>
    <div class='adm-map-content'>
      <ng-content></ng-content>
    </div>
  `
})
export class AdmMap implements OnChanges, OnInit, OnDestroy {

  longitude: number = 0;
  latitude: number = 0;

  level: number = 8;

  draggable: boolean = true;

  disableDoubleClickZoom: boolean = false;
  disableDoubleClick: boolean = false;

  scrollwheel: boolean = true;

  keyboardShortcuts: boolean = true;

  projectionId: string = 'WCONG';

  tileAnimation: boolean = true;

  mapTypeId: MapTypeId = MapTypeId.ROADMAP;

  usePanning: boolean = true;

  private static _mapOptionsAttributes: string[] = [
    'longitude', 'latitude', 'level', 'draggable',
    'disableDoubleClickZoom', 'disableCoudbleClick', 'scrollwheel',
    'keyboardShortcuts', 'projectionId', 'tileAnimation'
  ];

  private _observableSubscriptions: Subscription[] = [];


/**
 * Events
 *     'center_changed', 'zoom_start', 'zoom_changed', 'bounds_changed',
 *     'click', 'dblclick', 'rightclick', 'mousemove', 'dragstart', 'dragend',
 *     'idle', 'tilesloaded', 'maptypeid_changed'
 */
  click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  rightclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  dblclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  mousemove: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  center_changed: EventEmitter<LatLngLiteral> = new EventEmitter<LatLngLiteral>();
  bounds_changed: EventEmitter<LatLngBounds> = new EventEmitter<LatLngBounds>();
  idle: EventEmitter<void> = new EventEmitter<void>();
  zoom_change: EventEmitter<number> = new EventEmitter<number>();
  mapReady: EventEmitter<DaumMap> = new EventEmitter<DaumMap>();
  dragend: EventEmitter<LatLngLiteral> = new EventEmitter<LatLngLiteral>();

  constructor(private _elem: ElementRef, private w: WindowRef, private _mapsWrapper: DaumMapsAPIWrapper) {}

  /** @internal */
  ngOnInit() {
    // todo: this should be solved with a new component and a viewChild decorator
    const container = this._elem.nativeElement.querySelector('.adm-map-container-inner');
    this._initMapInstance(container);
  }

  private _initMapInstance(el: HTMLElement) {
    this._mapsWrapper.createMap(el, {
      center: {lat: this.latitude || 0, lng: this.longitude || 0} as LatLngLiteral,
      level: this.level,
      draggable: this.draggable,
      disableDoubleClickZoom: this.disableDoubleClickZoom,
      disableDoubleClick: this.disableDoubleClick,
      scrollwheel: this.scrollwheel,
      keyboardShortcuts: this.keyboardShortcuts,
      projectionId: this.projectionId,
      tileAnimation: this.tileAnimation,
      mapTypeId: MapTypeId.ROADMAP
      /**
       * 'longitude', 'latitude', 'level', 'draggable',
       * 'disableDoubleClickZoom', 'disableCoudbleClick', 'scrollwheel',
       * 'keyboardShortcuts', 'projectionId', 'tileAnimation'
       */
    })
      .then(() => this._mapsWrapper.getNativeMap())
      .then(map => {
        this.w.getNativeWindow().onresize = (event: any) => {
          this.relayout();
        };
        return this.mapReady.emit(map);
      });

    // register event listeners
    this._handleMapCenterChange();
    this._handleMapZoomChange();
    this._handleMapMouseEvents();
    this._handleBoundsChange();
    this._handleIdleEvent();
  }

  /** @internal */
  ngOnDestroy() {
    // unsubscribe all registered observable subscriptions
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }

  /* @internal */
  ngOnChanges(changes: SimpleChanges) {
    this._updateMapOptionsChanges(changes);
    this._updatePosition(changes);
  }

  private _updateMapOptionsChanges(changes: SimpleChanges) {
    let options: {[propName: string]: any} = {};
    let optionKeys =
        Object.keys(changes).filter(k => AdmMap._mapOptionsAttributes.indexOf(k) !== -1);
    optionKeys.forEach((k) => { options[k] = changes[k].currentValue; });
    this._mapsWrapper.setMapOptions(options);
  }

  // /**
  //  * Triggers a resize event on the daum map instance.
  //  * When recenter is true, the of the daum map gets called with the current lat/lng values or fitBounds value to recenter the map.
  //  * Returns a promise that gets resolved after the event was triggered.
  //  */
  // triggerResize(recenter: boolean = true): Promise<void> {
  //   // Note: When we would trigger the resize event and show the map in the same turn (which is a
  //   // common case for triggering a resize event), then the resize event would not
  //   // work (to show the map), so we trigger the event in a timeout.
  //   return new Promise<void>((resolve) => {
  //     setTimeout(() => {
  //       return this._mapsWrapper.triggerMapEvent('resize').then(() => {
  //         if (recenter) {
  //           this.fitBounds != null ? ()=>{} : this._setCenter();
  //         }
  //         resolve();
  //       });
  //     });
  //   });
  // }

  private _updatePosition(changes: SimpleChanges) {
    if (changes['latitude'] == null && changes['longitude'] == null &&
        changes['fitBounds'] == null) {
      // no position update needed
      return;
    }

    // // we prefer fitBounds in changes
    // if (changes['fitBounds'] && this.fitBounds != null) {
    //   this._fitBounds();
    //   return;
    // }

    if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
      return;
    }

    this._setCenter();
  }

  private _setCenter() {
    let newCenter = {
      lat: this.latitude,
      lng: this.longitude,
    };
    this._mapsWrapper.setCenter(newCenter);
    // this._mapsWrapper.panTo(newCenter);
  }

  _panTo(lat?: number, lng?: number){
    if (lat && lng) {
      this.latitude = lat;
      this.longitude = lng;
    }
    let newCenter: LatLngLiteral = {
        lat: this.latitude,
        lng: this.longitude,
      };
    this._mapsWrapper.panTo(newCenter);
  }

  private relayout() {
    this._mapsWrapper.relayout();
  }

  private _handleMapCenterChange() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('center_changed').subscribe(() => {
      this._mapsWrapper.getCenter().then((center: LatLng) => {
        this.latitude = center.getLat();
        this.longitude = center.getLng();
        this.center_changed.emit(<LatLngLiteral>{lat: this.latitude, lng: this.longitude});
      });
    });
    this._observableSubscriptions.push(s);
  }

  private _handleBoundsChange() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('bounds_changed').subscribe(() => {
      this._mapsWrapper.getBounds().then(
          (bounds: LatLngBounds) => { this.bounds_changed.emit(bounds); });
    });
    this._observableSubscriptions.push(s);
  }

  private _handleMapZoomChange() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('zoom_changed').subscribe(() => {
      this._mapsWrapper.getZoom().then((z: number) => {
        this.level = z;
        this.zoom_change.emit(z);
      });
    });
    this._observableSubscriptions.push(s);
  }

  private _handleDragEnd() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('dragend').subscribe(() => {
      this._mapsWrapper.getCenter().then((center: LatLng) => {
        this.latitude = center.getLat();
        this.longitude = center.getLng();
        this.dragend.emit(<LatLngLiteral>{lat: this.latitude, lng: this.longitude});
      });
    });
    this._observableSubscriptions.push(s);
  }

  private _handleIdleEvent() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('idle').subscribe(
        () => {
          this._setCenter();
          return this.idle.emit(void 0);
        });
    this._observableSubscriptions.push(s);
  }

  private _handleMapMouseEvents() {
    interface Emitter {
      emit(value: any): void;
    }
    type Event = {name: string, emitter: Emitter};

    const events: Event[] = [
      {name: 'click', emitter: this.click},
      {name: 'rightclick', emitter: this.rightclick},
      {name: 'dblclick', emitter: this.dblclick},
    ];

    events.forEach((e: Event) => {
      const s = this._mapsWrapper.subscribeToMapEvent<{latLng: LatLng}>(e.name).subscribe(
          (event: {latLng: LatLng}) => {
            const value = <MouseEvent>{coords: {lat: event.latLng.getLat(), lng: event.latLng.getLng()}};
            e.emitter.emit(value);
          });
      this._observableSubscriptions.push(s);
    });
  }
}
