import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UssdCodesPageRoutingModule } from './ussd-codes-routing.module';

import { UssdCodesPage } from './ussd-codes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UssdCodesPageRoutingModule
  ],
  declarations: [UssdCodesPage]
})
export class UssdCodesPageModule {}
