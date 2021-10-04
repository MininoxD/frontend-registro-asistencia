import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.state';
import { User } from '../store/user/user.model';
import { userSelector } from '../store/user/user.selector';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  user$: Observable<User> = this.store.select(userSelector).pipe(map((user) => {
    console.log(user);
    return user
  }))
  constructor(private authService: AuthService,private router: Router, private store: Store<AppState>){
    this.user$.subscribe((user) => {
      if (user.isLogin) {
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate([''])
      }
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
/*     true | UrlTree */
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise <boolean | UrlTree>
    {
    return this.store.select(userSelector).pipe(map((user)=>{
      if(!user.isLogin){
        return this.router.createUrlTree([''])
      }
      return true
    }))
/*     const url: string = state.url;
    return this.checkLogin(url); */
  }

  checkLogin(url: string): true | UrlTree {
    if (this.authService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Redirect to the login page
    return this.router.parseUrl('');
  }
}
