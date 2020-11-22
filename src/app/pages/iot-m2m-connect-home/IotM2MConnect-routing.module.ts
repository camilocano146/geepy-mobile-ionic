import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IotM2MConnectPage } from './iot-m2-m-connect-page.component';


const routes: Routes = [
  {
    path: '',
    component: IotM2MConnectPage,
    children: [
      {
        path: 'simcards',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../sim-cards-iot-m2m-connect/sim-cards.module').then(m => m.SimCardsPageModule)
          }
        ]
      },
      {
        path: 'itinerary',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../itinerary-iot/itinerary.module').then(m => m.ItineraryPageModule)
          }
        ]
      },
      {
        path: 'zones',
        children: [
          {
            path: '',
            loadChildren: () => import('../zones-iot/zones.module').then(m => m.ZonesPageModule)
          }
        ]
      },
      {
        path: 'packages',
        children: [
          {
            path: '',
            loadChildren: () => import('../packages/packages.module').then(m => m.PackagesPageModule)
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
        path: '',
        redirectTo: '/iot-m2m-connect-home/simcards',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/iot-m2m-connect-home/simcards',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
