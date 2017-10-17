import {Directive, Input, OnDestroy, OnInit} from "@angular/core";
import {DaumMapsAPIWrapper} from "../services/daum-maps-api-wrapper";
import {ControlPosition, ZoomControl} from "../services/daum-maps-types";

@Directive({
  selector: 'adm-zoom-control'
})
export class AdmZoomControl implements OnInit, OnDestroy {

  @Input() position: ControlPosition = ControlPosition.TOP_RIGHT;
  private zoomControl: ZoomControl;

  constructor(private _mapWrapper: DaumMapsAPIWrapper){}

  ngOnInit() {
    this._mapWrapper.createZoomControl()
      .then(zoomControl => {
        this.zoomControl = zoomControl;
      });
    this._mapWrapper.addControl(this.zoomControl, this.position);
  }

  ngOnDestroy() {
    this._mapWrapper.removeControl(this.zoomControl);
  }
}
