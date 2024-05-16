import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Column } from 'src/app/commons/table/table-column';
import { Activity, StudenteActivity } from './activity-table-row/Activity';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IAuthInfo, UserRole } from 'src/app/commons/authentication/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private activities : Activity[] = [
    {studenteActivity: {tipo: "tipo1", corso:"corso1", data:"data1", dettaglio:"dettaglio1"}, docenteActivity: {corso: "corso1", sessione:"sessione1", correzione:"correzione1", data:"data1"}} as Activity,
    {studenteActivity: {tipo: "tipo2", corso:"corso2", data:"data2", dettaglio:"dettaglio2"}, docenteActivity: {corso: "corso1", sessione:"sessione1", correzione:"correzione1", data:"data1"}} as Activity,
    {studenteActivity: {tipo: "tipo3", corso:"corso3", data:"data3", dettaglio:"dettaglio3"}, docenteActivity: {corso: "corso1", sessione:"sessione1", correzione:"correzione1", data:"data1"}} as Activity,
    {studenteActivity: {tipo: "tipo4", corso:"corso4", data:"data4", dettaglio:"dettaglio4"}, docenteActivity: {corso: "corso1", sessione:"sessione1", correzione:"correzione1", data:"data1"}} as Activity,
    {studenteActivity: {tipo: "tipo5", corso:"corso5", data:"data5", dettaglio:"dettaglio5"}, docenteActivity: {corso: "corso1", sessione:"sessione1", correzione:"correzione1", data:"data1"}} as Activity,
    {studenteActivity: {tipo: "tipo6", corso:"corso6", data:"data6", dettaglio:"dettaglio6"}, docenteActivity: {corso: "corso1", sessione:"sessione1", correzione:"correzione1", data:"data1"}} as Activity,
  
  ]
  
  private activitiesPaginated: Activity[] = []

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

  getSessioniPaginated(pagination: {page: number, size:number}):  Promise<{activities: Activity[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined>{
    let startTime = performance.now()
    let url = `${environment.http_server_host}${this._pathSessioni}/${pagination.size}/${pagination.page-1}`
    console.log(`ActivityService - url sessioni: ${url}`)

    return this._http.get(url).pipe(
      map((response) => {
        // recupero le informazioni sull'utente
        let currentUser = localStorage.getItem("user")
        let userInfo: IAuthInfo = currentUser ? JSON.parse(currentUser) : undefined
        let role = userInfo.payload!.role
        
        // converto la response
        const resp = <SessioneDTO>(response)
       
        let activities: Activity[] = resp.content.map(s =>  {

          let activity: Activity = {
            docenteActivity: role == UserRole.DOCENTE ? {corso: s.nomeCorso, data: s.dataOra, sessione: s.tipo, correzione: ""} : undefined,
            studenteActivity: role == UserRole.STUDENTE ? {tipo: 'ESAME', corso: s.nomeCorso, data: s.dataOra, dettaglio: s.tipo} : undefined,
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

  private paginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.activities.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.activitiesPaginated = this.activities.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }

  private getEmptyActivity() : Activity {
    return {
      studenteActivity: {tipo: "", corso: "", data:"", dettaglio: ""}, 
      docenteActivity: {corso: "", sessione:"", correzione: "", data: ""}, 
  }

  }
}

interface SessioneDTO{
  
    "totalPages": number,
    "totalElements": number,
    "size": number,
    "content": [
      {
        "nomeCorso": String,
        "dataOra": String,
        "tipo": String
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