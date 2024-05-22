import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map, catchError} from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate, OnInit {
  private _path = '/api/login'
  private _loginUrl = `${environment.http_server_host}${this._path}`;
  private stateItem: BehaviorSubject<IAuthInfo | null> = new BehaviorSubject<IAuthInfo | null>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);
  stateItem$: Observable<IAuthInfo | null> = this.stateItem.asObservable();

  constructor(private _http: HttpClient, private router: Router, private jwtService: JwtHelperService) {}
  ngOnInit(): void {
   console.log(`AuthService onInit`)
  }
 
  login(username: string, password: string): Observable<any> {
   
    const credentials = {username: username, password: password} as CredentialsRequest
    
    return this._http.post(this._loginUrl, credentials).pipe(
      map((response) => {
    
        // recupero il token 
        const resp: XTokenResponse = <XTokenResponse>(response);
        const token = resp.xToken.toString();
        const tokenInfo: TokenInfo = this.jwtService.decodeToken(token)!
        
        // compongo IAuthInfo
        const currentUser: IAuthInfo = {
          accessToken: token,
          expiresAt: tokenInfo.exp,
          payload:{email: tokenInfo.sub, role: tokenInfo.ruolo, nome: tokenInfo.nome, cognome: tokenInfo.cognome, cf: tokenInfo.cf, username: tokenInfo.nome}
        }
        localStorage.setItem('user', JSON.stringify(currentUser));
        this.stateItem.next(currentUser);

        return currentUser;
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

  isTokenExpired(token: String): boolean{
    if(this.jwtService.isTokenExpired(token.toString())) {
      this.stateItem.next(null)
      return true
    }
    return false
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
    if (this.stateItem.getValue()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return new Error('Something bad happened; please try again later.');
  }

}

// user model
export interface IUser {
  email: String;
  id?: String;
  role: UserRole;
  nome: String;
  cognome: String;
  username?: String;
  cf: String;
}

// auth model
export interface IAuthInfo {
  payload?: IUser;
  accessToken: String;
  refreshToken?: string;
  expiresAt?: number
}

// roles
export enum UserRole {
  STUDENTE = "STUDENTE",
  DOCENTE = "DOCENTE",
  ADMIN = "ADMIN"
}

interface XTokenResponse{
  xToken: String
}

interface CredentialsRequest{
  username: String,
  password: String
}

interface TokenInfo{
  sub: String,
  nome: String,
  cognome: String,
  ruolo: UserRole,
  exp: number,
  cf: String
}


