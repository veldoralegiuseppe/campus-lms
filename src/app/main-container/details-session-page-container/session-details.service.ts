import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  updateEsiti(esiti: UpdateEsitoRequest[]){
    let url = `${environment.http_server_host}${this._pathSessione}/update/esito`

      return this._http.post(url, esiti).pipe(
        map((response) => {
          return response
        })
      )
  }

  download(idFile: string){
    let url = `${environment.http_server_host}${this._pathDocumentale}/download`

    const formData = new FormData()
    formData.append("uuid", idFile)
    

    return this._http.post(url, formData, { 
        headers: new HttpHeaders({ "Content-Type": "multipart/form-data", "accept":"*/*"}),
        responseType: 'blob'
    }).pipe(
        map((response) => {
          return response;
        })
    )

  }

  uploadEsame(idSessione: number, file: File){
    let url =  `${environment.http_server_host}${this._pathSessione}/upload/esame`
    
    const formData = new FormData()
    formData.append('idSessione', new Blob([idSessione.toString()], {type: "application/json" }))
    formData.append('file', file)

    return this._http.post(url, formData, { headers: new HttpHeaders({ "Content-Type": "multipart/form-data"}), }).pipe(
      map((response) => {
        return response
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
  nomeProvaSomministrata: string | null,
  numeroIscritti: number,
  dataSessione: string,
  contentType: string | null,
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
  nomeFileStudente: string | null,
  contentType: string | null,
  esito: string | null
}

export interface UpdateEsitoRequest{  
  idStudente: number,
  idSessione: number,
  esito: string | null
}