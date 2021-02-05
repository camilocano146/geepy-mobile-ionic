import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepurchasePackagePageRoutingModule } from './repurchase-package-routing.module';

import { RepurchasePackagePage } from './repurchase-package.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    IonicModule,
    RepurchasePackagePageRoutingModule
  ],
  declarations: [RepurchasePackagePage]
})
export class RepurchasePackagePageModule {}
