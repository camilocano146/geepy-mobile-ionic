import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopCartPageRoutingModule } from './shop-cart-routing.module';

import { ShopCartPage } from './shop-cart.page';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';
import { CardItemShoppingCartComponent } from './card-item-shopping-cart/card-item-shopping-cart.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        TranslateModule.forChild(),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ShopCartPageRoutingModule
    ],
    declarations: [
        ShopCartPage,
        CardItemShoppingCartComponent
    ],
    providers: [


    ]
})
export class ShopCartPageModule { }
