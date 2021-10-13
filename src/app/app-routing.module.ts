import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SunburstComponent } from './sunburst/sunburst.component';

const routes: Routes = [
  { path: 'sunburst', component: SunburstComponent },
  { path: '', redirectTo: '/sunburst', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
