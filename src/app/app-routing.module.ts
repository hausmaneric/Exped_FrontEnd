import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { MaindetailsComponent } from './components/maindetails/maindetails.component';

const routes: Routes = [
  {
    path:'',redirectTo:'exped',pathMatch:'full'
  },
  {
    path:'exped',
    component: MainComponent
  },
  {
    path:'exped/:id',
    component: MaindetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
