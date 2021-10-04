import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginRegisterComponent } from './login-register/login-register.component';


const routes: Routes = [
  {
    path:'',
    component: LoginRegisterComponent
  },
  {
    path:'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'**',
    redirectTo: '',
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
