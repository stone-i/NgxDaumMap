import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import {AdmMarker} from './../../directives/marker';

import {DaumMapsAPIWrapper} from '../daum-maps-api-wrapper';
import {Marker} from '../daum-maps-types';

// todo: add types for this
declare var daum: any;

@Injectable()
export class MarkerManager {
  private _markers: Map<AdmMarker, Promise<Marker>> =
      new Map<AdmMarker, Promise<Marker>>();

  constructor(private _mapsWrapper: DaumMapsAPIWrapper, private _zone: NgZone) {}

  deleteMarker(marker: AdmMarker): Promise<void> {
    const m = this._markers.get(marker);
    if (m == null) {
      // marker already deleted
      return Promise.resolve();
    }
    return m.then((m: Marker) => {
      return this._zone.run(() => {
        m.setMap(null);
        this._markers.delete(marker);
      });
    });
  }

  updateMarkerPosition(marker: AdmMarker): Promise<void> {
    return this._markers.get(marker).then(
        (m: Marker) => m.setPosition(new daum.maps.LatLng(marker.latitude, marker.longitude)));
  }

  updateTitle(marker: AdmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setTitle(marker.title));
  }

  updateLabel(marker: AdmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => { m.setTitle(marker.label); });
  }

  updateDraggable(marker: AdmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setDraggable(marker.draggable));
  }

  updateIcon(marker: AdmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => {
      console.log('image : ');
      m.setImage( new daum.maps.MarkerImage(
        marker.image.src, new daum.maps.Point(marker.image.size.width, marker.image.size.height)
      ));
    });
  }

  updateOpacity(marker: AdmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setOpacity(marker.opacity));
  }

  updateVisible(marker: AdmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setVisible(marker.visible));
  }

  updateZIndex(marker: AdmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setZIndex(marker.zIndex));
  }

  addMarker(marker: AdmMarker) {
    const markerPromise = this._mapsWrapper.createMarker({
      position: {lat: marker.latitude, lng: marker.longitude},
      image: marker.image,
      title: marker.label,
      draggable: marker.draggable,
      clickable: true,
      opacity: marker.opacity,
      zIndex: marker.zIndex
    });
    this._markers.set(marker, markerPromise);
  }

  getNativeMarker(marker: AdmMarker): Promise<Marker> {
    return this._markers.get(marker);
  }

  createEventObservable<T>(eventName: string, marker: AdmMarker): Observable<void> {
    return Observable.create((observer: Observer<T>) => {
      this._markers.get(marker).then((m: Marker) => {
        daum.maps.event.addListener(m, eventName, () => this._zone.run(() => observer.next(null)));
      });
    });
  }
}
