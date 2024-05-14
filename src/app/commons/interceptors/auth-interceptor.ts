import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthInfo } from '../authentication/auth.service';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // recupero le informazioni sull'utente corrente
        let currentUser = localStorage.getItem("user")
        let userInfo: IAuthInfo = currentUser ? JSON.parse(currentUser) : undefined

        // verifico se il token è scaduto
        console.log(`Verifico se il token è scaduto\nAccess token: ${jwt_decode.jwtDecode(userInfo.accessToken.toString())}`)
        
        if(userInfo){
            req = req.clone({
                setHeaders: {
                    'Content-Type' : 'application/json; charset=utf-8',
                    'Accept'       : 'application/json',
                    'Authorization': `Bearer ${userInfo.accessToken}`,
                },
            });
        } else throw new HttpErrorResponse({
                error: new ErrorEvent('Utente non autenticato'),
                status: 403,
                statusText: 'Warning',
                url: this.router.url
            });
        
   
        return next.handle(req);
  }
}