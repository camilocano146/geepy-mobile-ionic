import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecommendAppPage } from './recommend-app.page';

const routes: Routes = [
  {
    path: '',
    component: RecommendAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecommendAppPageRoutingModule {}
