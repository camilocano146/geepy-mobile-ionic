import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransacitionsPageRoutingModule } from './transacitions-routing.module';

import { TransacitionsPage } from './transacitions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransacitionsPageRoutingModule
  ],
  declarations: [TransacitionsPage]
})
export class TransacitionsPageModule {}
