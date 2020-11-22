import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import {GroupsComponent} from './groups.component';
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
import {GroupRegisterComponent} from './group-register/group-register.component';


@NgModule({
  declarations: [
    GroupsComponent,
    GroupRegisterComponent,
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
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
    GroupRegisterComponent,
  ]
})
export class GroupsPageModule { }
