import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePage} from './home.page';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'simcards',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../sim-cards/sim-cards.module').then(m => m.SimCardsPageModule)
          },
          {
            path: 'purchase-activate-e-sims',
            loadChildren: () =>
              import('../sim-cards/e-sims/e-sims.module').then(m => m.ESimsPageModule)
          },
          {
            path: 'my-e-sims',
            loadChildren: () =>
              import('../sim-cards/my-e-sims/my-e-sims.module').then(m => m.MyESimsPageModule)
          },
          {
            path: 'purchase-activate-physical-sims',
            loadChildren: () =>
              import('../sim-cards/physical-sims/physical-sims.module').then(m => m.PhysicalPageModule)
          },
          {
            path: 'my-physical-sims',
            loadChildren: () =>
              import('../sim-cards/my-physical-sims/my-physical-sims.module').then(m => m.MyPhysicalSimsPageModule)
          },
          {
            path: 'physical-sims',
            loadChildren: () =>
              import('../sim-cards-settings/sim-cards-settings.module').then(m => m.SimCardsSettingsPageModule),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('../sim-cards-settings/sim-cards-settings.module').then(m => m.SimCardsSettingsPageModule)
          }
        ]
      },

      {
        path: 'itinerary-voyager',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../itinerary/itinerary.module').then(m => m.ItineraryPageModule)
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
        path: 'zones',
        children: [
          {
            path: '',
            loadChildren: () => import('../zones/zones.module').then(m => m.ZonesPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/simcards',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/simcards',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
