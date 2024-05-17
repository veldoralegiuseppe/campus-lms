import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './User';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users : User[] = [
    {nome: 'nome1', cognome: 'cognome1', email: 'email1', codiceFiscale: 'cf1', ruolo: 'ruolo1'},
  ]
  private usersPaginated : User[] = []
  private _pathUtenti = '/api/utente/search'
  private _pathCorsi = '/api/corso/list/nome'

  constructor(private _http:HttpClient){}

  getUsers() : Observable<User[]> {
    return of(this.users)
  }

  getUsersPaginated(pagination: {page: number, size:number}, filtri: SearchUtenteRequest):  Promise<{users: User[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined>{
    let startTime = performance.now()
    let url = `${environment.http_server_host}${this._pathUtenti}/${pagination.size}/${pagination.page-1}`
    console.log(`UserService - url: ${url}`)

    return this._http.post(url, filtri).pipe(
      map((response) => {
       
        // converto la response
        const resp = <UtenteDTOPaginated>(response)
       
        let utenti: User[] = resp.content.map(a =>  {

          let utente: User = {
            nome: a.nome ? a.nome : "",
            cognome: a.cognome ? a.cognome : "",
            codiceFiscale: a.codiceFiscale ? a.codiceFiscale : "",
            email: a.email ? a.email : "",
            ruolo: a.ruolo ? a.ruolo : ""
          }

          return utente
        })
        for(let i=utenti.length; i<pagination.size; i++) utenti.push(this.getEmptyUtente())
        console.log(`Utenti: ${JSON.stringify(utenti)}, sizeDesiderata: ${pagination.size}`)

        let pag = {totalPages: resp.totalPages > 0 ? resp.totalPages : 1, currentPage: resp.pageable.pageNumber, size: pagination.size} 

        return {users: utenti, pagination: pag, execTime: performance.now() - startTime}
      })
    ).toPromise()
  }

  paginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.users.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.usersPaginated = this.users.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }


  getCorsi() : Promise<{nome: string}[] | undefined>{
    
    let url = `${environment.http_server_host}${this._pathCorsi}`
    console.log(`UserService - url nome corsi: ${url}`)

    return this._http.get(url).pipe(
      map((response) => {
        
        // converto la response
        let resp: {nome: string}[] = [{nome: "Tutti"}]
        const list = <{nome: string}[]>(response)
        if(list) resp = resp.concat(list)
        return resp
      })
    ).toPromise()
  }

  getEmptyUtente() : User{
    return {nome: "", codiceFiscale: "", cognome: "", ruolo: "", email: ""}
  }

}

export interface SearchUtenteRequest{
  [key: string]: any
  "utente": UtenteDTO,
  "nomeCorso": String | null
}

export interface UtenteDTO{
  [key: string]: any
  "nome": String | null,
  "cognome": String | null,
  "codiceFiscale": String | null,
  "email": String | null,
  "ruolo": String | null,
}

interface UtenteDTOPaginated{
  "totalPages": number,
    "totalElements": number,
    "size": number,
    "content": [UtenteDTO],
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