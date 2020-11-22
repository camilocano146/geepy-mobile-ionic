import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopHomePage } from './shop-home.page';

const routes: Routes = [
    {
        path: '',
        component: ShopHomePage,
        children: [
            {
                path: 'store',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../category/category.module').then(m => m.CategoryPageModule)
                    }
                ]
            },
            {
                path: 'category',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../product/product.module').then(m => m.ProductPageModule)
                    }
                ]
            },
            {
                path: 'shop-cart',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../shop-cart/shop-cart.module').then(m => m.ShopCartPageModule)
                    }
                ]
            },
            {
                path: 'orders',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../orders/orders.module').then(m => m.OrdersPageModule)
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/shop-home/store',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShopHomePageRoutingModule { }
