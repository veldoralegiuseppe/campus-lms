import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import {catchError} from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router){}
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        return next.handle(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMsg = '';
                if (error.error instanceof ErrorEvent) {
                    console.log('This is client side error');
                    errorMsg = `Error: ${error.error.message}`;
                    console.log(errorMsg);
                    if(error.status == 403){ this.router.navigate(['login'])}
                } else {
                    //console.log(`This is server side error: ${error.message}`);
                    
                    let message = error.message
                    if(error.message.includes("Http failure response")) message = "Errore interno"
                    errorMsg = message
                    
                    //console.log(errorMsg);
                    if(error.status == 403){ this.router.navigate(['login'])}
                }
               
                return throwError(errorMsg);
            })
        )
    }
}
