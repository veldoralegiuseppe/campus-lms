import { Injectable } from '@angular/core';
import { Activity, StudenteActivity } from './activity-table-row/Activity';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IAuthInfo, UserRole } from 'src/app/commons/authentication/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private _pathAttivita = '/api/attivita'
  private _pathSessioni = '/api/sessione'

  constructor(private _http: HttpClient) { }

  getActivitiesPaginated(pagination: {page: number, size:number}):  Promise<{activities: Activity[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined>{
    let startTime = performance.now()
    let url = `${environment.http_server_host}${this._pathAttivita}/${pagination.size}/${pagination.page-1}`
    //console.log(`ActivityService - url: ${url}`)

    return this._http.get(url).pipe(
      map((response) => {
        // recupero le informazioni sull'utente
        let currentUser = localStorage.getItem("user")
        let userInfo: IAuthInfo = currentUser ? JSON.parse(currentUser) : undefined
        let role = userInfo.payload!.role
        
        // converto la response
        const resp = <AttivitaSummaryResponse>(response)
       
        let activities: Activity[] = resp.summaries.content.map(a =>  {

          let activity: Activity = {
            docenteActivity: undefined,
            studenteActivity: role == UserRole.STUDENTE ? {tipo: 'STUDIO', corso: a.nomeCorso, data: a.settimanaProgrammata, dettaglio: a.dettaglio} : undefined,
            adminActivity: undefined
          }

          return activity
        })
        for(let i=activities.length; i<pagination.size; i++) activities.push(this.getEmptyActivity())
        //console.log(`Activities: ${JSON.stringify(activities)}, sizeDesiderata: ${pagination.size}`)

        let pag = {totalPages: resp.summaries.totalPages, currentPage: resp.summaries.pageable.pageNumber, size: pagination.size} 

        return {activities: activities, pagination: pag, execTime: performance.now() - startTime}
      })
    ).toPromise()
  }

  getSessioniPaginated(pagination: {page: number, size:number}, corrette?: boolean):  Promise<{activities: Activity[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined>{
    let startTime = performance.now()
    console.log(pagination)
    let url = `${environment.http_server_host}${this._pathSessioni}/${pagination.size}/${pagination.page-1}` + (corrette!=undefined ? `?corrette=${corrette}` : "")
    console.log(`ActivityService - url sessioni: ${url}`)

    return this._http.get(url).pipe(
      map((response) => {
        // recupero le informazioni sull'utente
        let currentUser = localStorage.getItem("user")
        let userInfo: IAuthInfo = currentUser ? JSON.parse(currentUser) : undefined
        let role = userInfo.payload!.role
        
        // converto la response
        const resp = <SessioneDTOPaginated>(response)
       
        let activities: Activity[] = resp.content.map(s =>  {

          let activity: Activity = {
            docenteActivity: role == UserRole.DOCENTE ? {corso: s.nomeCorso, data: s.data, idSessione: s.idSessione, sessione: s.tipo, daCorreggere: ''+(s.proveConsegnate-s.proveCorrette)} : undefined,
            studenteActivity: role == UserRole.STUDENTE ? {tipo: 'ESAME', corso: s.nomeCorso, idSessione: s.idSessione, data: s.data, dettaglio: s.tipo} : undefined,
            adminActivity: undefined
          }

          return activity
        })
        for(let i=activities.length; i<pagination.size; i++) activities.push(this.getEmptyActivity())
        //console.log(`Activities: ${JSON.stringify(activities)}, sizeDesiderata: ${pagination.size}`)

        let pag = {totalPages: resp.totalPages, currentPage: resp.pageable.pageNumber, size: pagination.size} 

        return {activities: activities, pagination: pag, execTime: performance.now() - startTime}
      })
    ).toPromise()
  }

  private getEmptyActivity() : Activity {
    return {
      studenteActivity: {tipo: "", corso: "", data:"", dettaglio: "", idSessione: -1}, 
      docenteActivity: {corso: "", sessione:"", daCorreggere: "", data: "", idSessione: -1}, 
  }

  }
}


interface AttivitaSummaryResponse{
  "summaries": {
    "totalPages": number,
    "totalElements": number,
    "size": number,
    "content": [
      {
        "nomeCorso": String,
        "dettaglio": String,
        "settimanaProgrammata": String
      }
    ],
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

export interface SearchSessioneResponse{
  [key: string]: any
  nomeCorso: String,
  data: String, 
  tipo: String,
  nomeDocente: String,
  cognomeDocente: String,
  emailDocente: String,
  numeroStudenti: String,
  idSessione: number,
  proveConsegnate: number,
  proveCorrette: number,
}