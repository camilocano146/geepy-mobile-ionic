import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZonesPageRoutingModule } from './zones-routing.module';

import { ZonesPage } from './zones.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';

@NgModule({
  imports: [
    CommonModule,
    PopoverModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ZonesPageRoutingModule
  ],
  declarations: [ZonesPage]
})
export class ZonesPageModule {}
