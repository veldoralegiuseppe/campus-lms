import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SessionDetailsService {

  private _pathSessione = '/api/sessione'
  private _pathDocumentale ='/api/documentale'
  
  constructor(private _http: HttpClient) { }

  getDetails(id: number){
    let url = `${environment.http_server_host}${this._pathSessione}/${id}`

    return this._http.get(url).pipe(
      map((response) => {
        return <SessioneDetailsResponse> response
      })
    )
  }

}

export interface SessioneDetailsResponse{
  idCorso: number,
  idDocente: number,
  nomeDocente: string,
  cognomeDocente: string,
  emailDocente: string,
  nomeCorso: string,
  idSessione: number,
  tipoSessione: string,
  idProvaSomministrata: string | null,
  numeroIscritti: number,
  dataSessione: string,
  esami: IstanzaSessioneDTO[]
}

export interface IstanzaSessioneDTO{
  idSessione: number,
  idStudente: number,
  nomeStudente: string,
  cognomeStudente: string,
  emailStudente: string,
  codiceFiscale: string,
  idFileStudente: string | null,
  nomeFileStudente: string | null
}