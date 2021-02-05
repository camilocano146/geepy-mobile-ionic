import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapGroupViewDevicesComponent} from './map-group-view-devices.component';


const routes: Routes = [
  {
    path: '',
    component: MapGroupViewDevicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapGroupViewDeviceRoutingModule { }
