import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private _loginUrl = '/auth/login';
  private stateItem: BehaviorSubject<IAuthInfo | null> = new BehaviorSubject<IAuthInfo | null>(null);
  stateItem$: Observable<IAuthInfo | null> = this.stateItem.asObservable();

  constructor(private _http: HttpClient, private router: Router) {}
 
  Login(username: string, password: string): Observable<any> {
    return this._http.post(this._loginUrl, { username, password }).pipe(
      map((response) => {
        // prepare the response to be handled, then return
        // we'll tidy up later
        const retUser: IAuthInfo = <IAuthInfo>(<any>response).data;
        // save in localStorage
        localStorage.setItem('user', JSON.stringify(retUser));
        // also update state
        this.stateItem.next(retUser);
        return retUser;
      })
    );
    

  }

  fakeLogin(email: String, password: String){
    console.log(`Password inserita: ${password}`)
    switch (password){
      case "studente":{
        this.stateItem.next({accessToken: "", payload:{email: email, id:"", role: UserRole.STUDENTE, nome: "Giuseppe", cognome: "Veldorale", cf: "VLDGPP97E16F138C"}})
        break
      }
      case "docente":{
        this.stateItem.next({accessToken: "", payload:{email: email, id:"", role: UserRole.DOCENTE, nome: "Giuseppe", cognome: "Veldorale", cf: "VLDGPP97E16F138C"}})
        break
      }
      case "admin": {
        this.stateItem.next({accessToken: "", payload:{email: email, id:"", role: UserRole.ADMIN, nome: "Giuseppe", cognome: "Veldorale", cf: "VLDGPP97E16F138C"}})
        break
      }
      default: {
        this.stateItem.next({accessToken: "", payload:{email: email, id:"", role: UserRole.STUDENTE, nome: "Giuseppe", cognome: "Veldorale", cf: "VLDGPP97E16F138C"}})
        break
      }
    }
    console.log(this.stateItem)
 }

  logout(){
    this.stateItem.next(null)
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.stateItem.getValue() != null) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}

// user model
export interface IUser {
  email: String;
  id: String;
  role: UserRole;
  username?: String ;
  nome: String;
  cognome: String;
  cf: String;
}

// auth model
export interface IAuthInfo {
  payload?: IUser;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number
}

// roles
export enum UserRole {
  STUDENTE = "STUDENTE",
  DOCENTE = "DOCENTE",
  ADMIN = "ADMIN"
}
