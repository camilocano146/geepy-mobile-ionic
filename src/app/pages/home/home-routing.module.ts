import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';


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
          }
        ]
      },
      {
        path: 'itinerary',
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
        path: 'help',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../help/help.module').then(m => m.HelpPageModule)
          }
        ]
      },
      {
        path: 'transacitions',
        children: [
          {
            path: '',
            loadChildren: () => import('../transacitions/transacitions.module').then( m => m.TransacitionsPageModule)
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
export class HomePageRoutingModule {}
