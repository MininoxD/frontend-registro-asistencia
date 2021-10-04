import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { AppState } from '../app.state';
import { Login } from '../store/user/user.actions';
import { User } from '../store/user/user.model';
import { userSelector } from '../store/user/user.selector';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  user$: Observable<User>  = this.store.select(userSelector).pipe(map((user)=>{
    return user
  }))

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;


  login(): Observable<boolean> {

    return of(true).pipe(
      delay(1000),
      tap(() => this.isLoggedIn = true)
    );
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  constructor(private store: Store<AppState>) {
    this.user$.subscribe((user) => {
      console.log("desde guardian",user);
      this.isLoggedIn = user.isLogin
    })
   }
}
