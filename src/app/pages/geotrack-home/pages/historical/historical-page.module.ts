import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricalRoutingModule } from './historical-routing.module';
import {HistoricalComponent} from './historical.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {PopoverModule} from '../../../../common-components/popover/popover.module';
import {TranslateModule} from '@ngx-translate/core';
import {AgmCoreModule} from '@agm/core';
import {DialogFilterRoutesComponent} from './filter-routes/dialog-filter-routes.component';
import {MatRadioModule} from '@angular/material/radio';
import {LazyLoadDirective} from '../../../../directives/detect-lazy-load/lazy-load.directive';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatNativeDateModule} from '@angular/material/core';
import {AgmDirectionModule} from 'agm-direction';


@NgModule({
  declarations: [
    HistoricalComponent,
    DialogFilterRoutesComponent,
  ],
  imports: [
    CommonModule,
    HistoricalRoutingModule,
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
    PopoverModule,
    TranslateModule.forChild(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBMtHVqHc6m1dPc85aFmzg4uS8r6SlzosQ' + '&libraries=visualization'
    }),
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgmDirectionModule,
  ],
  providers: [
    LazyLoadDirective,
  ]
})
export class HistoricalPageModule { }
