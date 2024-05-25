import { Injectable } from '@angular/core';
import { Session } from './Session';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IAuthInfo, UserRole } from 'src/app/commons/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  private _pathCorso = '/api/corso'
  private _pathSessione = '/api/sessione'
  
  constructor(private _http:HttpClient){}

  getSessionPaginated(filtri: SearchSessioniRequest, pagination: { page: number; size: number; }) : Promise<{sessioni: Session[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined> {
    let startTime = performance.now()
    let url = `${environment.http_server_host}${this._pathSessione}/search/${pagination.size > 0 ? pagination.size : 100}/${pagination.page-1}`
    
   return this._http.post(url, filtri).pipe(
      map((response) => {
        // recupero le informazioni sull'utente
        let currentUser = localStorage.getItem("user")
        let userInfo: IAuthInfo = currentUser ? JSON.parse(currentUser) : undefined
        let role = userInfo.payload!.role
        let minTableSize = 3
        
        // converto la response
        const resp = <SessioneDTOPaginated>(response)
        const numberOfElements = resp.numberOfElements

        let sessioni: Session[] = resp.content.map(s =>  {

          let sessione: Session = {
            corso: s.nomeCorso,
            tipo: s.tipo.toLocaleUpperCase(),
            data: s.data,
            docente: s.nomeDocente.toUpperCase() + " " + s.cognomeDocente.toUpperCase(),
            studenti: s.numeroStudenti,
            id: s.idSessione
          }

          return sessione
        })
        if(pagination.size && pagination.size > sessioni.length) for(let i=sessioni.length; i<pagination.size; i++) sessioni.push(this.getEmptyElement())
        else if(sessioni.length < minTableSize) for(let i=sessioni.length; i<minTableSize; i++) sessioni.push(this.getEmptyElement())
        //console.log(`Course: ${JSON.stringify(courses)}, sizeDesiderata: ${pagination.size}`)

        let pag = {totalPages: resp.totalPages > 0 ? resp.totalPages : 1, currentPage: resp.pageable.pageNumber, size: pagination.size} 

        return {sessioni: sessioni, pagination: pag, execTime: performance.now() - startTime}
      })
    ).toPromise()
  }

  getEmptyElement(): Session {
    return {
      corso: "",
      tipo: "",
      data: "",
      docente: "",
      studenti: "",
      id: -1
    }
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

  iscrizioneSessione(sessione: Session){
    let url = `${environment.http_server_host}${this._pathSessione}/${sessione.id}/iscrizione`

    return this._http.get(url).pipe(
      map((response) => {
        return response
      })
    )
  }
 
}

export interface SearchSessioneResponse{
  [key: string]: any
  nomeCorso: String,
  data: String, 
  tipo: String,
  nomeDocente: String,
  cognomeDocente: String,
  emailDocente: String,
  numeroStudenti: String,
  idSessione: number
}

interface SessioneDTOPaginated{
  "totalPages": number,
    "totalElements": number,
    "size": number,
    "content": [SearchSessioneResponse],
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

export interface SearchSessioniRequest{
  "nomeCorso":  String | null,
  "dataDa": String | null,
  "dataA": String | null,
  "tipo": String | null
}