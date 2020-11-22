import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GeotrackHomeRoutingModule} from './geotrack-home-routing.module';
import {GeotrackHomePage} from './geotrack-home-page.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    GeotrackHomePage,
  ],
  imports: [
    CommonModule,
    GeotrackHomeRoutingModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
  ]
})
export class GeotrackHomeModule { }
