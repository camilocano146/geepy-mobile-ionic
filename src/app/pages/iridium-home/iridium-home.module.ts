import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IridiumHomeRoutingModule } from './iridium-home-routing.module';

import { IridiumHomePage } from './iridium-home.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    IridiumHomeRoutingModule
  ],
  declarations: [IridiumHomePage]
})
export class IridiumHomePageModule {}
