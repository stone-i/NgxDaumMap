import {Directive, EventEmitter, OnChanges, OnDestroy, SimpleChange,
  AfterContentInit, ContentChildren, QueryList} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {MouseEvent} from '../map-types';
import * as mapTypes from '../services/daum-maps-types';
import {MarkerManager} from '../services/managers/marker-manager';

import {AdmInfoWindow} from './info-window';
import {MarkerImage, MarkerImageLiteral} from '../services/daum-maps-types';

let markerId = 0;

/**
 * admMarker renders a map marker inside a {@link admMap}.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  styles: [`
 *    .adm-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <adm-map [latitude]="lat" [longitude]="lng" [level]="level">
 *      <adm-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
 *      </adm-marker>
 *    </adm-map>
 *  `
 * })
 * ```
 */
@Directive({
  selector: 'adm-marker',
  inputs: [
    'latitude', 'longitude', 'title', 'label', 'draggable: markerDraggable', 'image',
    'openInfoWindow', 'opacity', 'visible', 'zIndex'
  ],
  outputs: ['markerClick', 'dragEnd', 'mouseOver', 'mouseOut']
})
export class AdmMarker implements OnDestroy, OnChanges, AfterContentInit {
  /**
   * The latitude position of the marker.
   */
  latitude: number;

  /**
   * The longitude position of the marker.
   */
  longitude: number;

  /**
   * The title of the marker.
   */
  title: string;

  /**
   * The label (a single uppercase character) for the marker.
   */
  label: string;

  /**
   * If true, the marker can be dragged. Default value is false.
   */
  draggable: boolean = false;

  /**
   * Icon (the URL of the image) for the foreground.
   */
  image: MarkerImageLiteral;

  /**
   * If true, the marker is visible
   */
  visible: boolean = true;

  /**
   * Whether to automatically open the child info window when the marker is clicked.
   */
  openInfoWindow: boolean = true;

  /**
   * The marker's opacity between 0.0 and 1.0.
   */
  opacity: number = 1;

  /**
   * All markers are displayed on the map in order of their zIndex, with higher values displaying in
   * front of markers with lower values. By default, markers are displayed according to their
   * vertical position on screen, with lower markers appearing in front of markers further up the
   * screen.
   */
  zIndex: number = 1;

  /**
   * This event emitter gets emitted when the user clicks on the marker.
   */
  markerClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * This event is fired when the user stops dragging the marker.
   */
  dragEnd: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the user mouses over the marker.
   */
  mouseOver: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the user mouses outside the marker.
   */
  mouseOut: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * @internal
   */
  @ContentChildren(AdmInfoWindow) infoWindow: QueryList<AdmInfoWindow> = new QueryList<AdmInfoWindow>();

  private _markerAddedToManger: boolean = false;
  private _id: string;
  private _observableSubscriptions: Subscription[] = [];

  constructor(private _markerManager: MarkerManager) { this._id = (markerId++).toString(); }

  /* @internal */
  ngAfterContentInit() {
    this.handleInfoWindowUpdate();
    this.infoWindow.changes.subscribe(() => this.handleInfoWindowUpdate());
  }

  private handleInfoWindowUpdate() {
    if (this.infoWindow.length > 1) {
      throw new Error('Expected no more than one info window.');
    }
    this.infoWindow.forEach(marker => {
      marker.hostMarker = this;
    });
  }

  /** @internal */
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
      return;
    }
    if (!this._markerAddedToManger) {
      this._markerManager.addMarker(this);
      this._markerAddedToManger = true;
      this._addEventListeners();
      return;
    }
    if (changes['latitude'] || changes['longitude']) {
      this._markerManager.updateMarkerPosition(this);
    }
    if (changes['title']) {
      this._markerManager.updateTitle(this);
    }
    if (changes['label']) {
      this._markerManager.updateLabel(this);
    }
    if (changes['draggable']) {
      this._markerManager.updateDraggable(this);
    }
    if (changes['image']) {
      this._markerManager.updateIcon(this);
    }
    if (changes['opacity']) {
      this._markerManager.updateOpacity(this);
    }
    if (changes['visible']) {
      this._markerManager.updateVisible(this);
    }
    if (changes['zIndex']) {
      this._markerManager.updateZIndex(this);
    }
  }

  private _addEventListeners() {
    const cs = this._markerManager.createEventObservable('click', this).subscribe(() => {
      if (this.openInfoWindow) {
        this.infoWindow.forEach(infoWindow => infoWindow.open());
      }
      this.markerClick.emit(null);
    });
    this._observableSubscriptions.push(cs);

    const ds =
        this._markerManager.createEventObservable('dragend', this)
            .subscribe(() => {
              this.dragEnd.emit(null);
            });
    this._observableSubscriptions.push(ds);

    const mover =
        this._markerManager.createEventObservable('mouseover', this)
            .subscribe(() => {
              this.mouseOver.emit(null);
            });
    this._observableSubscriptions.push(mover);

    const mout =
        this._markerManager.createEventObservable<mapTypes.MouseEvent>('mouseout', this)
            .subscribe(() => {
              this.mouseOut.emit(null);
            });
    this._observableSubscriptions.push(mout);

    const de =
        this._markerManager.createEventObservable('dragstart', this)
            .subscribe(() => {
              this.mouseOver.emit(null);
            });
    this._observableSubscriptions.push(de);

    const rc =
        this._markerManager.createEventObservable('rightclick', this)
            .subscribe(() => {
              this.mouseOver.emit(null);
            });
    this._observableSubscriptions.push(rc);
  }

  /** @internal */
  id(): string { return this._id; }

  /** @internal */
  toString(): string { return 'admMarker-' + this._id.toString(); }

  /** @internal */
  ngOnDestroy() {
    this._markerManager.deleteMarker(this);
    // unsubscribe all registered observable subscriptions
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }
}
