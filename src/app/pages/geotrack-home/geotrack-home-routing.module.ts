import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GeotrackHomePage} from './geotrack-home-page.component';


const routes: Routes = [
  {
    path: '',
    component: GeotrackHomePage,
    children: [
      {
        path: 'devices',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/devices/devices-page.module').then(m => m.DevicesPageModule)
          }
        ]
      },
      {
        path: 'labels',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/labels/labels-page.module').then(m => m.LabelsPageModule)
          }
        ]
      },
      {
        path: 'groups',
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/groups/groups-page.module').then(m => m.GroupsPageModule)
          }
        ]
      },
      {
        path: 'historical',
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/historical/historical-page.module').then(m => m.HistoricalPageModule)
          }
        ]
      },
      {
        path: 'profile/:platform',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'tracking/:idDevice',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/common-components/map-view/map-group-view-device.module').then(m => m.MapGroupViewDeviceModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/geotrack-home/devices',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/geotrack-home/devices',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeotrackHomeRoutingModule { }
