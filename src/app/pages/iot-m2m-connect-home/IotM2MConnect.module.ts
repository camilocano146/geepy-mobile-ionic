import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { HomePageRoutingModule } from './IotM2MConnect-routing.module';

import { IotM2MConnectPage } from './iot-m2-m-connect-page.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    //Traductor
    TranslateModule.forChild(),
    HomePageRoutingModule
  ],
  declarations: [IotM2MConnectPage]
})
export class IotM2MConnectPageModule {}
