import { Injectable } from '@angular/core';
import { Progress } from './Progress';
import { map } from 'rxjs';
import { IAuthInfo, UserRole } from 'src/app/commons/authentication/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private _pathCorso = '/api/corso'
  private _pathSessione = '/api/sessione'

  constructor(private _http: HttpClient){}
  
  getProgressPaginated(pagination: { page: number; size: number; }, filtri: SearchProgressiRequest): Promise<{progressi: Progress[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined> {
    let startTime = performance.now()
    let url = `${environment.http_server_host}${this._pathSessione}/progressi/${pagination.size > 0 ? pagination.size : 100}/${pagination.page-1}`
    
   return this._http.post(url, filtri).pipe(
      map((response) => {
        // recupero le informazioni sull'utente
        let currentUser = localStorage.getItem("user")
        let userInfo: IAuthInfo = currentUser ? JSON.parse(currentUser) : undefined
        let role = userInfo.payload!.role
        let minTableSize = 3
        
        // converto la response
        const resp = <SearchProgressiResponse>(response)
        const numberOfElements = resp.numberOfElements

        let progressi: Progress[] = resp.content.map(s =>  {

          let progresso: Progress = {
            nome: s.nome,
            cognome: s.cognome,
            codiceFiscale: s.codiceFiscale,
            tipo: s.tipoSessione,
            data: s.dataSessione,
            corso: s.nomeCorso,
            esito: s.esito ? s.esito : ""
          }

          return progresso
        })
        if(pagination.size && pagination.size > progressi.length) for(let i=progressi.length; i<pagination.size; i++) progressi.push(this.getEmptyElement())
        else if(progressi.length < minTableSize) for(let i=progressi.length; i<minTableSize; i++) progressi.push(this.getEmptyElement())
        //console.log(`Course: ${JSON.stringify(courses)}, sizeDesiderata: ${pagination.size}`)

        let pag = {totalPages: resp.totalPages > 0 ? resp.totalPages : 1, currentPage: resp.pageable.pageNumber, size: pagination.size} 

        return {progressi: progressi, pagination: pag, execTime: performance.now() - startTime}
      })
    ).toPromise()
  }

  getEmptyElement(): Progress {
    return <Progress>{nome:"", codiceFiscale:"", cognome:"", corso:"", tipo:"", data:"", esito:""}
  }

  getCorsi(ruolo: UserRole) : Promise<{nome: string}[] | undefined>{
    
    let path = ""

    if(ruolo == UserRole.STUDENTE) path = "list/studente"
    else if(ruolo == UserRole.DOCENTE) path = "list/docente/nome"
    else if(ruolo == UserRole.ADMIN) path = "list/nome"

    let url = `${environment.http_server_host}${this._pathCorso}/${path}`
    console.log(`SessionService - url nome corsi: ${url}`)

    return this._http.get(url).pipe(
      map((response) => {
        
        // converto la response
        const list = <{nome: string}[]>(response)
        return list
      })
    ).toPromise()
  }
  
}

export interface SearchProgressiRequest{
  "nomeCorso": string|null,
  "nome": string|null,
  "cognome": string|null,
  "codiceFiscale": string|null,
  "tipoSessione": string|null,
  "dataDa": string|null,
  "dataA": string|null
}

export interface SearchProgressiResponse{
  "totalPages": number,
    "totalElements": number,
    "size": number,
    "content": [ProgressiDTO],
    "number": number,
    "sort": [
      {
        "direction": String,
        "nullHandling": String,
        "ascending": Boolean,
        "property": String,
        "ignoreCase": Boolean
      }
    ],
    "pageable": {
      "offset": number,
      "sort": [
        {
          "direction": String,
          "nullHandling": String,
          "ascending": Boolean,
          "property": String,
          "ignoreCase": Boolean
        }
      ],
      "paged": Boolean,
      "unpaged": Boolean,
      "pageNumber": number,
      "pageSize": number
    },
    "numberOfElements": number,
    "first": Boolean,
    "last": Boolean,
    "empty": Boolean
}

export interface ProgressiDTO{
  nome: string,
  cognome: string,
  codiceFiscale: string,
  nomeCorso: string,
  esito: string|null,
  tipoSessione: string,
  dataSessione: string
}