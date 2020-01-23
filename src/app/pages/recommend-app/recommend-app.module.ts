import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecommendAppPageRoutingModule } from './recommend-app-routing.module';

import { RecommendAppPage } from './recommend-app.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PopoverModule,
    TranslateModule.forChild(),
    RecommendAppPageRoutingModule
  ],
  declarations: [RecommendAppPage]
})
export class RecommendAppPageModule {}
