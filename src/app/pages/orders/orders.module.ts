import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { TranslateModule } from '@ngx-translate/core';
import { DialogOrderDetailComponent } from './dialog-order-detail/dialog-order-detail.component';

@NgModule({
    imports: [
        TranslateModule.forChild(),
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule,
        OrdersPageRoutingModule
    ],
    declarations: [OrdersPage,DialogOrderDetailComponent],
    entryComponents: [DialogOrderDetailComponent]
})
export class OrdersPageModule { }
