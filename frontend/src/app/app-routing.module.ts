import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { WebsiteDetailComponent } from './website-detail/website-detail.component';
import { WebpageDetailsComponent } from './webpage-details/webpage-details.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'website/:id', component: WebsiteDetailComponent },
  { path: 'webpage/:id', component: WebpageDetailsComponent },
  { path: '', redirectTo: '/index', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
