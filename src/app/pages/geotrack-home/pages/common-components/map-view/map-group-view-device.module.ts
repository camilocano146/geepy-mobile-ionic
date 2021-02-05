import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapGroupViewDeviceRoutingModule } from './map-group-view-device-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslateModule} from '@ngx-translate/core';
import {MapGroupViewDevicesComponent} from './map-group-view-devices.component';
import {DialogDirectionAdvancedComponent} from './route-direction-advanced/dialog-direction-advanced.component';
import {DialogDistanceMatrixComponent} from './route-distance-matrix/dialog-distance-matrix.component';
import {AgmCoreModule} from '@agm/core';
import {DialogAutocompletePlacePlaceComponent} from './automplace-place/dialog-autocomplete-place-place.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AgmDirectionModule} from 'agm-direction';
import {LazyLoadDirective} from '../../../../../directives/detect-lazy-load/lazy-load.directive';


@NgModule({
  declarations: [
    MapGroupViewDevicesComponent,
    DialogDirectionAdvancedComponent,
    DialogDistanceMatrixComponent,
    DialogAutocompletePlacePlaceComponent,
  ],
  imports: [
    CommonModule,
    MapGroupViewDeviceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule.forChild(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBMtHVqHc6m1dPc85aFmzg4uS8r6SlzosQ' + '&libraries=visualization'
    }),
    MatAutocompleteModule,
    AgmDirectionModule,
  ],
  entryComponents: [
    DialogDirectionAdvancedComponent,
    DialogDistanceMatrixComponent,
    DialogAutocompletePlacePlaceComponent,
  ]
})
export class MapGroupViewDeviceModule { }
