import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItineraryPageRoutingModule } from './itinerary-routing.module';

import { ItineraryPage } from './itinerary.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ItineraryModalCreate } from './itinerary-modal-create/itinerary-modal-create.component';
import { ItineraryModalEditCancel } from './itinerary-modal-edit-cancel/itinerary-modal-edit-cancel.component';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatIconModule,
    PopoverModule,
    ItineraryPageRoutingModule
  ],
  providers: [
    DatePipe
  ],
  declarations: [
    ItineraryPage,
    ItineraryModalCreate,
    ItineraryModalEditCancel
  ],
  entryComponents: [
    ItineraryModalCreate,
    ItineraryModalEditCancel
  ]
})
export class ItineraryPageModule {}
