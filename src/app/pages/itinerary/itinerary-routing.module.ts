import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItineraryPage } from './itinerary.page';
import {ItineraryHomeComponent} from './itinerary-home/itinerary-home.component';
import {ItineraryGroupComponent} from './itinerary-group/itinerary-group.component';

const routes: Routes = [
  {
    path: '',
    component: ItineraryHomeComponent
  },
  {
    path: 'group',
    component: ItineraryGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItineraryPageRoutingModule {}
