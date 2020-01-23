import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UssdCodesPageRoutingModule } from './ussd-codes-routing.module';

import { UssdCodesPage } from './ussd-codes.page';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import { TranslateModule } from '@ngx-translate/core';
import { UssdCodeModalCallComponent } from './ussd-code-modal-call/ussd-code-modal-call.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PopoverModule,
    ReactiveFormsModule,
    //Traductor
    TranslateModule.forChild(),
    IonicModule,
    UssdCodesPageRoutingModule
  ],
  declarations: [
    UssdCodesPage,
    UssdCodeModalCallComponent
  ],
  entryComponents: [
    UssdCodeModalCallComponent
  ]
})
export class UssdCodesPageModule {}
