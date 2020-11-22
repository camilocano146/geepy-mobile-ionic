import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryPageRoutingModule } from './category-routing.module';

import { CategoryPage } from './category.page';
import { CategoryCardComponent } from './category-card/category-card.component';

import { NgxGalleryModule } from 'ngx-gallery-9';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    NgxGalleryModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    CategoryPageRoutingModule
  ],
  declarations: [CategoryPage,
    CategoryCardComponent]
})
export class CategoryPageModule {}
