import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'slides', pathMatch: 'full' },
  {
    path: 'slides',
    loadChildren: () => import('./pages/slides/slides.module').then(m => m.SlidesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'activate-account',
    loadChildren: () => import('./pages/activate-account/activate-account.module').then(m => m.ActivateAccountPageModule)
  },
  {
    path: 'send-code',
    loadChildren: () => import('./pages/send-code/send-code.module').then(m => m.SendCodePageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'ussd-codes',
    loadChildren: () => import('./pages/ussd-codes/ussd-codes.module').then(m => m.UssdCodesPageModule)
  },
  {
    path: 'recommend-app',
    loadChildren: () => import('./pages/recommend-app/recommend-app.module').then(m => m.RecommendAppPageModule)
  },
  {
    path: 'repurchase-package',
    loadChildren: () => import('./pages/repurchase-package/repurchase-package.module').then( m => m.RepurchasePackagePageModule)
  },
  {
    path: 'iridium-home',
    loadChildren: () => import('./pages/iridium-home/iridium-home.module').then( m => m.IridiumHomePageModule)
  },
  {
    path: 'iot-m2m-connect-home',
    loadChildren: () => import('./pages/iot-m2m-connect-home/IotM2MConnect.module').then(m => m.IotM2MConnectPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then( m => m.SupportPageModule)
  },
  {
    path: 'select-platform',
    loadChildren: () => import('./pages/select-platform/select-platform.module').then( m => m.SelectPlatformPageModule)
  },
  {
    path: 'geotrack-home',
    loadChildren: () => import('./pages/geotrack-home/geotrack-home.module').then( m => m.GeotrackHomeModule)
  },
  {
    path: 'shop-home',
    loadChildren: () => import('./pages/shop-home/shop-home.module').then( m => m.ShopHomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
