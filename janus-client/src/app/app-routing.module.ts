import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./+home/home.module').then(module => module.HomeModule),
  },
  {
    path: 'conference',
    loadChildren: () => import('./+conference/conference.module').then(module => module.ConferenceModule),
  },
  {
    path: 'webinar',
    loadChildren: () => import('./+webinar/webinar.module').then(module => module.WebinarModule),
  },
  {
    path: 'webinar/auto-start',
    loadChildren: () => import('./+webinar-auto-start/webinar-auto-start.module').then(module => module.WebinarAutoStartModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
