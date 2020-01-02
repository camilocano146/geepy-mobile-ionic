import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItineraryPageRoutingModule } from './itinerary-routing.module';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { ItineraryPage } from './itinerary.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import { ItineraryModalCreateComponent } from './itinerary-modal-create/itinerary-modal-create.component';
import { ItineraryModalEditComponent } from './itinerary-modal-edit/itinerary-modal-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    IonicModule,
    PopoverModule,
    //Traductor
    TranslateModule.forChild(),
    ReactiveFormsModule,
    ItineraryPageRoutingModule
  ],
  declarations: [
    ItineraryPage,
    ItineraryModalCreateComponent,
    ItineraryModalEditComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "en-US" },
  ],
  entryComponents: [
    ItineraryModalCreateComponent,
    ItineraryModalEditComponent
  ]
})
export class ItineraryPageModule { }
