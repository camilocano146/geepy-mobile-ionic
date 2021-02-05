import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPlatformPageRoutingModule } from './select-platform-routing.module';

import { SelectPlatformPage } from './select-platform.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import {SimModalESimsCompatibleAndroidDevicesComponent} from './sim-modal-e-sim-compatible-android-devices/sim-modal-e-sims-compatible-android-devices.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverModule,
    TranslateModule.forChild(),
    SelectPlatformPageRoutingModule,
    MatDividerModule,
    MatListModule
  ],
  declarations: [
    SelectPlatformPage,
    SimModalESimsCompatibleAndroidDevicesComponent,
  ],
  entryComponents: [
    SimModalESimsCompatibleAndroidDevicesComponent,
  ]
})
export class SelectPlatformPageModule {}
