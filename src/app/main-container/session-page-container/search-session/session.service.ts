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
  
  private session: Session[] = [
    {corso: 'corso1', tipo: 'tipo1', data: 'data1', docente: 'docente1', studenti: 'studenti1'} as Session,
  ]
  private emptySession: Session[] = [
    {corso: '', tipo: '', data: '', docente: '', studenti: ''} as Session,
  ]
  private _pathCorsi = '/api/corso/list/docente/nome'
  private _pathSessioni = '/api/sessione/search'
  private sessionPaginated: Session[] = []

  constructor(private _http:HttpClient){}

  getSessionPaginated(filtri: SearchSessioniRequest, pagination: { page: number; size: number; }) : Promise<{sessioni: Session[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined> {
    let startTime = performance.now()
    let url = `${environment.http_server_host}${this._pathSessioni}/${pagination.size > 0 ? pagination.size : 100}/${pagination.page-1}`
    let pag = this.paginate(pagination)

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
            studenti: s.numeroStudenti
          }

          return sessione
        })
        if(pagination.size && pagination.size > sessioni.length) for(let i=sessioni.length; i<pagination.size; i++) sessioni.push(this.getEmptyElement())
        else if(sessioni.length < minTableSize) for(let i=sessioni.length; i<minTableSize; i++) sessioni.push(this.getEmptyElement())
        //console.log(`Course: ${JSON.stringify(courses)}, sizeDesiderata: ${pagination.size}`)

        let pag = {totalPages: resp.totalPages, currentPage: resp.pageable.pageNumber, size: pagination.size} 

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
      studenti: ""
    }
  }

  private paginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.session.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.sessionPaginated = this.session.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }

  getEmptySessionPaginated(pagination: { page: number; size: number; }){
    let startTime = performance.now()
    let pag = this.emptyPaginate(pagination)
    return new Promise<any>((resolve, error) =>{
      setTimeout(() => {
        resolve({session: this.sessionPaginated, pagination: pag, execTime: performance.now() - startTime})
      }, 0)
    })
  }

  private emptyPaginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.emptySession.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.sessionPaginated = this.emptySession.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }

  getCorsi() : Promise<{nome: string}[] | undefined>{
    
    let url = `${environment.http_server_host}${this._pathCorsi}`
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

export interface SearchSessioneResponse{
  [key: string]: any
  nomeCorso: String,
  data: String, 
  tipo: String,
  nomeDocente: String,
  cognomeDocente: String,
  emailDocente: String,
  numeroStudenti: String
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