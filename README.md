# NgxDaumMap

angular2+ 다음지도 컴포넌트 입니다.

현재 Map, Maker, InfoWindow만 작업 중 입니다.

아직 동작하지 않는 기능이 많습니다.

필요하신 분들은 커스텀하시고 기능을 추가하신다면

컨트리뷰션 해주시면 감사드리겠습니다~!

[Ngx-Daum-Map on GitHub](https://github.com/stone-i/NgxDaumMap)


#Install :
```
npm install ngx-daum-map
```


#Example

### MainModule :
```
//AdmCoreModule 임포트
import {AdmCoreModule} from 'ngx-daum-map';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //apiKey입력 
    AdmCoreModule.forRoot({
      apiKey: '이곳에 다음지도 api키를 입력하세요'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### HTML :
```
//*adm-map의 style:height는 필수로 입력해야 합니다.(px로!)!!*
//Event는 (Event이름)="Method이름()" 의 형식으로 붙일 수 있습니다
<adm-map (bounds_changed)="onBoundsChanged($event)" [latitude]="37" [longitude]="127" style="height: 300px"> 

    <adm-marker [latitude]="37" [longitude]="127">

        <adm-info-window [disableAutoPan]="true">
           Hi, this is the content of the <strong>info window</strong>
         </adm-info-window>

    </adm-marker>

</adm-map>
```

### TS :
```
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-comp',
  templateUrl: './app-comp.html',
  styleUrls: ['./app-comp.css']
})
export class DetailInfoComponent {

  bounds_changed(event) {
  
    console.log(event);
    
  }
  
  constructor() {}

}

```






