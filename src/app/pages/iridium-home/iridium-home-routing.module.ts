import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IridiumHomePage } from './iridium-home.page';


const routes: Routes = [
  {
    path: '',
    component: IridiumHomePage,
    children: [
      {
        path: 'devices',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../devices/devices.module').then(m => m.DevicesPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'transacitions',
        children: [
          {
            path: '',
            loadChildren: () => import('../transacitions/transacitions.module').then(m => m.TransacitionsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/iridium-home/devices',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/iridium-home/devices',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IridiumHomeRoutingModule {}
