import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private _pathCorso = '/api/corso'
  private _pathUtente = '/api/utente'
  constructor(private _http: HttpClient) { }

  getCorsi(): Promise<{nome: string}[] | undefined>{
    
    let url = `${environment.http_server_host}${this._pathCorso}/list/nome`
    
    return this._http.get(url).pipe(
      map((response) => {
        const list = <{nome: string}[]>(response)
        return list
      })
    ).toPromise()
  }

  getCorsiCattedraLibera(): Promise<{nome: string}[] | undefined>{
    let url = `${environment.http_server_host}${this._pathCorso}/list/cattedra-libera`
    
    return this._http.get(url).pipe(
      map((response) => {
        const list = <{nome: string}[]>(response)
        return list
      })
    ).toPromise()
  }

  create(utente: UtenteRequest){
    let url = `${environment.http_server_host}${this._pathUtente}`

    return this._http.post(url, utente, {
      reportProgress: true,
      observe: 'events',
    })
  }
}

export interface UtenteRequest{
  "nome": String,
  "cognome": String,
  "email": String,
  "codiceFiscale": String,
  "ruolo": String,
  "password": String | null,
  "corsi": String[] | null
}