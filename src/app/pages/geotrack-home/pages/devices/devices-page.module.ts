import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import {DevicesComponent} from './devices.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {PopoverModule} from '../../../../common-components/popover/popover.module';
import {TranslateModule} from '@ngx-translate/core';
import {DeviceRegisterComponent} from './device-register/device-register.component';


@NgModule({
  declarations: [
    DevicesComponent,
    DeviceRegisterComponent,
  ],
  imports: [
    CommonModule,
    DevicesRoutingModule,
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
    TranslateModule.forChild()
  ],
  entryComponents: [
    DeviceRegisterComponent,
  ]
})
export class DevicesPageModule { }
