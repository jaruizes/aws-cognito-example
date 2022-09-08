import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PublicComponent } from "./public.component";

const routes = [
  { path: 'public', component: PublicComponent}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PublicRoutingModule {}
