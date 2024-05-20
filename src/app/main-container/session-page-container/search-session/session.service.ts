import { Injectable } from '@angular/core';
import { Session } from './Session';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  private session: Session[] = [
    {corso: 'corso1', modulo: 'modulo1', tipo: 'tipo1', data: 'data1', oraInizio: 'oraInizio1', oraFine: 'oraFine1', durata: 'durata1', pausa: 'pausa1', docente: 'docente1'} as Session,
    {corso: 'corso2', modulo: 'modulo2', tipo: 'tipo2', data: 'data2', oraInizio: 'oraInizio2', oraFine: 'oraFine2', durata: 'durata2', pausa: 'pausa2', docente: 'docente2'} as Session,
    {corso: 'corso3', modulo: 'modulo3', tipo: 'tipo3', data: 'data3', oraInizio: 'oraInizio3', oraFine: 'oraFine3', durata: 'durata3', pausa: 'pausa3', docente: 'docente3'} as Session,
    {corso: 'corso4', modulo: 'modulo4', tipo: 'tipo4', data: 'data4', oraInizio: 'oraInizio4', oraFine: 'oraFine4', durata: 'durata4', pausa: 'pausa4', docente: 'docente4'} as Session,
    {corso: 'corso5', modulo: 'modulo5', tipo: 'tipo5', data: 'data5', oraInizio: 'oraInizio5', oraFine: 'oraFine5', durata: 'durata5', pausa: 'pausa5', docente: 'docente5'} as Session,
    {corso: 'corso6', modulo: 'modulo6', tipo: 'tipo6', data: 'data6', oraInizio: 'oraInizio6', oraFine: 'oraFine6', durata: 'durata6', pausa: 'pausa6', docente: 'docente6'} as Session,
    {corso: 'corso7', modulo: 'modulo7', tipo: 'tipo7', data: 'data7', oraInizio: 'oraInizio7', oraFine: 'oraFine7', durata: 'durata7', pausa: 'pausa7', docente: 'docente7'} as Session,
    {corso: 'corso8', modulo: 'modulo8', tipo: 'tipo8', data: 'data8', oraInizio: 'oraInizio8', oraFine: 'oraFine8', durata: 'durata8', pausa: 'pausa8', docente: 'docente8'} as Session,
    {corso: 'corso9', modulo: 'modulo9', tipo: 'tipo9', data: 'data9', oraInizio: 'oraInizio9', oraFine: 'oraFine9', durata: 'durata9', pausa: 'pausa9', docente: 'docente9'} as Session,
    {corso: 'corso10', modulo: 'modulo10', tipo: 'tipo10', data: 'data10', oraInizio: 'oraInizio10', oraFine: 'oraFine10', durata: 'durata10', pausa: 'pausa10', docente: 'docente10'} as Session,
    {corso: 'corso11', modulo: 'modulo11', tipo: 'tipo11', data: 'data11', oraInizio: 'oraInizio11', oraFine: 'oraFine11', durata: 'durata11', pausa: 'pausa11', docente: 'docente11'} as Session,
  ]
  private emptySession: Session[] = [
    {corso: '', modulo: '', tipo: '', data: '', oraInizio: '', oraFine: '', durata: '', pausa: '', docente: ''} as Session,
    {corso: '', modulo: '', tipo: '', data: '', oraInizio: '', oraFine: '', durata: '', pausa: '', docente: ''} as Session,
    {corso: '', modulo: '', tipo: '', data: '', oraInizio: '', oraFine: '', durata: '', pausa: '', docente: ''} as Session,
  ]
  private _pathCorsi = '/api/corso/list/docente/nome'
  private sessionPaginated: Session[] = []

  constructor(private _http:HttpClient){}

  getSessionPaginated(pagination: { page: number; size: number; }) {
    let startTime = performance.now()
    let pag = this.paginate(pagination)
    return new Promise<any>((resolve, error) =>{
      setTimeout(() => {
        resolve({session: this.sessionPaginated, pagination: pag, execTime: performance.now() - startTime})
      }, 0)
    })
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
