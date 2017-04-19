import { LatLngLiteral,LatLng } from './../services/daum-maps-types';
import {Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';

import {InfoWindowManager} from '../services/managers/info-window-manager';

import {AdmMarker} from './marker';

let infoWindowId = 0;

/**
 * admInfoWindow renders a info window inside a {@link admMarker} or standalone.
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
 *        <adm-info-window [disableAutoPan]="true">
 *          Hi, this is the content of the <strong>info window</strong>
 *        </adm-info-window>
 *      </adm-marker>
 *    </adm-map>
 *  `
 * })
 * ```
 */
@Component({
  selector: 'adm-info-window',
  inputs: ['latitude','longitude', 'disableAutoPan', 'position', 'removable', 'zIndex', 'isOpen'],
  outputs: ['infoWindowClose'],
  template: `<div class='adm-info-window-content'>
      <ng-content></ng-content>
    </div>
  `
})
export class AdmInfoWindow implements OnDestroy, OnChanges, OnInit {
  disableAutoPan:boolean;
  position: LatLngLiteral|LatLng;
  removable: boolean;
  zIndex: number;
  latitude: number;
  longitude: number;

  /**
   * Holds the marker that is the host of the info window (if available)
   */
  hostMarker: AdmMarker;

  /**
   * Holds the native element that is used for the info window content.
   */
  content: Node;

  isOpen: boolean;

  /**
   * Emits an event when the info window is closed.
   */
  infoWindowClose: EventEmitter<void> = new EventEmitter<void>();

  private static _infoWindowOptionsInputs: string[] = ['disableAutoPan', 'maxWidth'];
  private _infoWindowAddedToManager: boolean = false;
  private _id: string = (infoWindowId++).toString();

  constructor(private _infoWindowManager: InfoWindowManager, private _el: ElementRef) {}

  ngOnInit() {
    this.content = this._el.nativeElement.querySelector('.adm-info-window-content');
    this._infoWindowManager.addInfoWindow(this);
    this._infoWindowAddedToManager = true;
    this._updateOpenState();
    this._registerEventListeners();
  }

  /** @internal */
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (!this._infoWindowAddedToManager) {
      return;
    }
    if ((changes['latitude'] || changes['longitude']) && typeof this.latitude === 'number' &&
        typeof this.longitude === 'number') {
          console.log('changed postion');
      this._infoWindowManager.setPosition(this);
    }
    if (changes['zIndex']) {
      this._infoWindowManager.setZIndex(this);
    }
    if (changes['isOpen']) {
      this._updateOpenState();
    }
    this._setInfoWindowOptions(changes);
  }

  private _registerEventListeners() {
    this._infoWindowManager.createEventObservable('closeclick', this).subscribe(() => {
      this.isOpen = false;
      this.infoWindowClose.emit();
    });
  }

  private _updateOpenState() {
    this.isOpen ? this.open() : this.close();
  }

  private _setInfoWindowOptions(changes: {[key: string]: SimpleChange}) {
    let options: {[propName: string]: any} = {};
    let optionKeys = Object.keys(changes).filter(
        k => AdmInfoWindow._infoWindowOptionsInputs.indexOf(k) !== -1);
    optionKeys.forEach((k) => { options[k] = changes[k].currentValue; });
    this._infoWindowManager.setOptions(this, options);
  }

  /**
   * Opens the info window.
   */
  open(): Promise<void> { return this._infoWindowManager.open(this); }

  /**
   * Closes the info window.
   */
  close(): Promise<void> {
    return this._infoWindowManager.close(this).then(() => { this.infoWindowClose.emit(); });
  }

  /** @internal */
  id(): string { return this._id; }

  /** @internal */
  toString(): string { return 'admInfoWindow-' + this._id.toString(); }

  /** @internal */
  ngOnDestroy() { this._infoWindowManager.deleteInfoWindow(this); }
}
