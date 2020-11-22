import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductPageRoutingModule } from './product-routing.module';
import { ProductPage } from './product.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import { DialogProductDetailsComponent } from './dialog-product-details/dialog-product-details.component';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';

@NgModule({
    imports: [
        NgxGalleryModule,
        PopoverModule,
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        ProductPageRoutingModule
    ],
    declarations: [
        ProductPage,
        DialogProductDetailsComponent
    ],
    entryComponents: [
        DialogProductDetailsComponent
    ],
    providers: [
        ShoppingCartService
    ]
})
export class ProductPageModule { }
