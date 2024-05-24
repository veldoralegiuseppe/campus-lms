import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorsoService {

  private _pathCorso = '/api/corso'
  private _pathDocumentale ='/api/documentale'

  constructor(private _http: HttpClient) { }

  getDettaglioCorso(id: number){
    let url = `${environment.http_server_host}${this._pathCorso}/dettaglio/M_A_F/${id}`
    console.log(url)

    return this._http.get(url).pipe(
      map((response) => {
        return <CorsoDetailsDTO> response
      })
    )
  }

  download(file: DocumentaleDTO){
    let url = `${environment.http_server_host}${this._pathDocumentale}/download`

    const formData = new FormData()
    formData.append("uuid", file.id)
    

    return this._http.post(url, formData, { 
        headers: new HttpHeaders({ "Content-Type": "multipart/form-data", "accept":"*/*"}),
        responseType: 'blob'
    }).pipe(
        map((response) => {
          return response;
        })
    )

  }

  createAttivita(attivita: CreateAttivitaRequest, file: File){
    let url =  `${environment.http_server_host}${this._pathCorso}/attivita`
    
    const formData = new FormData()
    formData.append('attivita', new Blob([JSON.stringify(attivita)], {type: "application/json" }))
    formData.append('file', file)

    return this._http.post(url, formData, { headers: new HttpHeaders({ "Content-Type": "multipart/form-data"}), }).pipe(
      map((response) => {
        return response
      })
    )

  }

  createModulo(req: CreateModuloRequest){
    let url =  `${environment.http_server_host}${this._pathCorso}/modulo`

    return this._http.post(url,req).pipe(
      map((response) => {
        return response
      })
    )

  }
}

export interface CorsoDetailsDTO{
  id: String,
  nome: String,
  descrizione: String,
  moduli: ModuloDetailsDTO[],
}

export interface ModuloDetailsDTO{
  id: number,
  nome: string,
  descrizione: string | null,
  attivita: AttivitaDetailsDTO[]
}

export interface AttivitaDetailsDTO{
  descrizione: string | null,
  tipo: string,
  settimanaProgrammata: string,
  idModulo: number,
  id: number,
  file: DocumentaleDTO
}

export interface DocumentaleDTO{
  id: string,
  nome: string,
  contentType: string,
  data: Blob | null,
  insertDate: string,
  updateDate: string
}

export interface CreateAttivitaRequest{
  tipo: string,
  settimanaProgrammata: string,
  idModulo: number,
  idCorso: number
}

export interface CreateModuloRequest{
  idCorso: number,
  descrizione: string | null,
  nome: string
}

