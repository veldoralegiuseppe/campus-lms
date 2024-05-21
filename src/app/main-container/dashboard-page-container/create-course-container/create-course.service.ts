import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateCourseService {

  private _pathUtente = '/api/utente'
  private _pathCorso = '/api/corso'

  constructor(private _http: HttpClient) { }

  getDocenti(): Promise<DocenteResponse[] | undefined>{
    let url = `${environment.http_server_host}${this._pathUtente}/list/docenti`
    
    return this._http.get(url).pipe(
      map((response) => {
        const list = <DocenteResponse[]>(response)
        return list
      })
    ).toPromise()
  }

  create(corso: CreateCorsoRequest){
    let url = `${environment.http_server_host}${this._pathCorso}`

    return this._http.post(url, corso, {
      reportProgress: true,
      observe: 'events',
    })
  }
}

export interface DocenteResponse{
  "nome": String,
  "cognome": String,
  "codiceFiscale": String,
  "email": String,
  "ruolo": String
}

export interface CreateCorsoRequest{
  "nome": string,
  "descrizione": string | null,
  "emailDocente": string
}