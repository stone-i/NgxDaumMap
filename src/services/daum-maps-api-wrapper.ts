import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import * as mapTypes from './daum-maps-types';
import {
  Polyline, LatLngLiteral, MarkerImage, MarkerImageLiteral, ControlPosition,
  ZoomControl
} from './daum-maps-types';
import {PolylineOptions} from './daum-maps-types';
import {MapsAPILoader} from './maps-api-loader/maps-api-loader';

// todo: add types for this
declare var daum: any;

/**
 * Wrapper class that handles the communication with the Daum Maps Javascript
 * API v3
 */
@Injectable()
export class DaumMapsAPIWrapper {
  private _map: Promise<mapTypes.DaumMap>;
  private _mapResolver: (value?: mapTypes.DaumMap) => void;

  constructor(private _loader: MapsAPILoader, private _zone: NgZone) {
    this._map =
        new Promise<mapTypes.DaumMap>((resolve: () => void) => { this._mapResolver = resolve; });
  }

  createMap(el: HTMLElement, mapOptions: mapTypes.MapOptions): Promise<void> {
    return this._loader.load().then(() => {
      let literal: LatLngLiteral = mapOptions.center as LatLngLiteral;
        mapOptions.center = this.createLatLng(literal.lat, literal.lng);
        const map = new daum.maps.Map(el, mapOptions);
        this._mapResolver(<mapTypes.DaumMap>map);
      return;
    });
  }

  setMapOptions(options: mapTypes.MapOptions) {
    this._map.then((m: mapTypes.DaumMap) => {
      // m.setOptions(options);
    });
  }

  /**
   * Creates a daum map marker with the map context
   */
  createMarker(options: mapTypes.MarkerOptions = <mapTypes.MarkerOptions>{}):
      Promise<mapTypes.Marker> {
    return this._map.then((map: mapTypes.DaumMap) => {
      options.map = map;

      let li: LatLngLiteral = options.position as LatLngLiteral;

      if (options.image != null){
        let mImg: MarkerImageLiteral = options.image as MarkerImageLiteral;
        let image: MarkerImage = new daum.maps.MarkerImage(mImg.src, new daum.maps.Size(mImg.size.width, mImg.size.height));
        options.image = image;
      }

      options.position = new daum.maps.LatLng(li.lat, li.lng);

      return new daum.maps.Marker(options);
    });
  }

  createZoomControl(): Promise<mapTypes.ZoomControl> {
    return this._map.then((map: mapTypes.DaumMap) => {
      return new daum.maps.ZoomControl();
    });
  }

  addZommControl(zoomControl: ZoomControl, position: ControlPosition): Promise<void> {
    return this._map.then((map: mapTypes.DaumMap) => {
      map.addControl(zoomControl, position);
    });
  }

  createInfoWindow(options?: mapTypes.InfoWindowOptions): Promise<mapTypes.InfoWindow> {
    return this._map.then(() => { return new daum.maps.InfoWindow(options); });
  }

  /**
   * Creates a daum.map.Circle for the current map.
   */
  createCircle(options: mapTypes.CircleOptions): Promise<mapTypes.Circle> {
    return this._map.then((map: mapTypes.DaumMap) => {
      options.map = map;
      return new daum.maps.Circle(options);
    });
  }

  createPolyline(options: PolylineOptions): Promise<Polyline> {
    return this.getNativeMap().then((map: mapTypes.DaumMap) => {
      let line = new daum.maps.Polyline(options);
      line.setMap(map);
      return line;
    });
  }

  createPolygon(options: mapTypes.PolygonOptions): Promise<mapTypes.Polyline> {
    return this.getNativeMap().then((map: mapTypes.DaumMap) => {
      let polygon = new daum.maps.Polygon(options);
      polygon.setMap(map);
      return polygon;
    });
  }

  /**
   * Determines if given coordinates are insite a Polygon path.
   */
  containsLocation(latLng: mapTypes.LatLngLiteral, polygon: mapTypes.Polygon): Promise<boolean> {
    return daum.maps.geometry.poly.containsLocation(latLng, polygon);
  }

  subscribeToMapEvent<E>(eventName: string): Observable<E> {
    return Observable.create((observer: Observer<E>) => {
      this._map.then((m: mapTypes.DaumMap) => {
        daum.maps.event.addListener(m, eventName, (arg: E) => {
          this._zone.run(() => observer.next(arg));
        });
      });
    });
  }
  createLatLng(lat: number|(() => number), lng: number|(() => number)): any{
    return new daum.maps.LatLng(lat, lng);
  }

  addControl(control: any, position: any): Promise<void> {
    return this._map.then((map: mapTypes.DaumMap) => map.addControl(control, position));
  }

  removeControl(control: any): Promise<void> {
    return this._map.then((map: mapTypes.DaumMap) => map.removeControl(control));
  }

  setCenter(latLng: mapTypes.LatLngLiteral): Promise<void> {
    return this._map.then((map: mapTypes.DaumMap) => map.setCenter(new daum.maps.LatLng(latLng.lat, latLng.lng)));
  }

  getZoom(): Promise<number> { return this._map.then((map: mapTypes.DaumMap) => map.getLevel()); }

  getBounds(): Promise<mapTypes.LatLngBounds> {
    return this._map.then((map: mapTypes.DaumMap) => map.getBounds());
  }

  setZoom(zoom: number): Promise<void> {
    return this._map.then((map: mapTypes.DaumMap) => map.setLevel(zoom));
  }

  getCenter(): Promise<mapTypes.LatLng> {
    return this._map.then((map: mapTypes.DaumMap) => map.getCenter());
  }

  panTo(latLng: mapTypes.LatLngLiteral): Promise<void> {
    return this._map.then((map) => map.panTo(new daum.maps.LatLng(latLng.lat, latLng.lng)));
  }

  relayout(): void{
    this._map.then((map) => map.relayout());
  }

  // fitBounds(latLng: mapTypes.LatLngBounds|mapTypes.LatLngBoundsLiteral): Promise<void> {
  //   return this._map.then((map) => map.fitBounds(latLng));
  // }

  // panToBounds(latLng: mapTypes.LatLngBounds|mapTypes.LatLngBoundsLiteral): Promise<void> {
  //   return this._map.then((map) => map.panToBounds(latLng));
  // }

  /**
   * Returns the native Daum Maps Map instance. Be careful when using this instance directly.
   */
  getNativeMap(): Promise<mapTypes.DaumMap> { return this._map; }

  /**
   * Triggers the given event name on the map instance.
   */
  triggerMapEvent(eventName: string): Promise<void> {
    return this._map.then((m) => daum.maps.event.trigger(m, eventName));
  }
}
