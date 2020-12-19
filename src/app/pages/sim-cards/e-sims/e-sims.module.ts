import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ESimsPageRoutingModule} from './e-sims-routing.module';

import {ESimsPage} from './e-sims.page';
import {PopoverModule} from '../../../common-components/popover/popover.module';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslateModule} from '@ngx-translate/core';
import {AgmCoreModule} from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    //Traductor
    TranslateModule.forChild(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBMtHVqHc6m1dPc85aFmzg4uS8r6SlzosQ" + '&libraries=visualization'
    }),
    ReactiveFormsModule,
    ESimsPageRoutingModule,
  ],
  declarations: [
    ESimsPage,
  ]
})
export class ESimsPageModule {}
