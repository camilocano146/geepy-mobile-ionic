import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZonesPageRoutingModule } from './zones-routing.module';

import { ZonesPage } from './zones.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverModule,
    ReactiveFormsModule,
    //Traductor
    TranslateModule.forChild(),
    ZonesPageRoutingModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  declarations: [ZonesPage]
})
export class ZonesPageModule { }
