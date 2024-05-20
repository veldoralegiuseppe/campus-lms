import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, throwError } from 'rxjs';
import { AuthService, IAuthInfo } from '../authentication/auth.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // recupero le informazioni sull'utente corrente
        let currentUser = localStorage.getItem("user")
        let userInfo: IAuthInfo = currentUser ? JSON.parse(currentUser) : undefined
        
        if(userInfo && !this.authService.isTokenExpired(userInfo.accessToken.toString())){

            let contentType = req.headers.has('Content-Type') ? req.headers.get('Content-Type') : 'application/json; charset=utf-8'
            if(contentType?.includes("multipart/form-data")){
                console.log("rimuovo il content type")
                req = req.clone({
                    headers : req.headers.delete('Content-Type'),
                    setHeaders: {
                        'Accept'       : 'application/json',
                        'Authorization': `Bearer ${userInfo.accessToken}`,
                    },
                });
        
                console.log(req)
            }
            else {
                req = req.clone({
                    setHeaders: {
                        'Content-Type' : contentType!,
                        'Accept'       : 'application/json',
                        'Authorization': `Bearer ${userInfo.accessToken}`,
                    },
                });
            }

            console.log(req)
        }
        
        return next.handle(req);
  }
}