import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabelsRoutingModule } from './labels-routing.module';
import {LabelsComponent} from './labels.component';
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


@NgModule({
  declarations: [
    LabelsComponent,
  ],
  imports: [
    CommonModule,
    LabelsRoutingModule,
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
  ]
})
export class LabelsPageModule { }
