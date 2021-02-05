import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevicesPageRoutingModule } from './devices-routing.module';

import { DevicesPage } from './devices.page';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceImportComponent } from './device-import/device-import.component';
import { DeviceSettingsComponent } from './device-settings/device-settings.component';
import { DeviceBuyComponent } from './device-buy/device-buy.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    PopoverModule,
    TranslateModule.forChild(),
    DevicesPageRoutingModule
  ],
  declarations: [
    DevicesPage,
    DeviceImportComponent,
    DeviceSettingsComponent,
    DeviceBuyComponent
  ],
  entryComponents: [
    DeviceImportComponent,
    DeviceSettingsComponent,
    DeviceBuyComponent
  ]
})
export class DevicesPageModule { }
