import { Injectable } from '@angular/core';
import { Course } from './Course';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { IAuthInfo, UserRole } from 'src/app/commons/authentication/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService{


  private _path = '/api/corso/summary'

  constructor(private _http: HttpClient) { }

  getCoursesPaginated(pagination: {page: number, size:number}):  Promise<{courses: Course[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined>{
    
    let startTime = performance.now()
    let url = `${environment.http_server_host}${this._path}/${pagination.size > 0 ? pagination.size : 100}/${pagination.page-1}`
    let minTableSize = 3
    //console.log(`CourseService - url: ${url}`)
    
    return this._http.get(url).pipe(
      map((response) => {
        // recupero le informazioni sull'utente
        let currentUser = localStorage.getItem("user")
        let userInfo: IAuthInfo = currentUser ? JSON.parse(currentUser) : undefined
        let role = userInfo.payload!.role
        
        // converto la response
        const resp = <UtenteSummaryResponse>(response)
        const numberOfElements = resp.summaries.numberOfElements

        let courses: Course[] = resp.summaries.content.map(c =>  {

          let course: Course = {
            docenteCourse: role == UserRole.DOCENTE ? {id: c.id ,corso: c.nomeCorso, sessioni: c.sessioni.toLocaleString(), studenti: c.studenti.toLocaleString()} : undefined,
            studenteCourse: role == UserRole.STUDENTE ? {id: c.id ,corso: c.nomeCorso, sessioni: c.sessioni.toLocaleString(), moduli: c.moduli.toLocaleString()} : undefined,
            adminCourse: role == UserRole.ADMIN ? {id: c.id ,corso: c.nomeCorso, sessioni: c.sessioni.toLocaleString(), studenti: c.studenti.toLocaleString()} : undefined
          }

          return course
        })
        if(pagination.size && pagination.size > courses.length) for(let i=courses.length; i<pagination.size; i++) courses.push(this.getEmptyElement())
        else if(courses.length < minTableSize) for(let i=courses.length; i<minTableSize; i++) courses.push(this.getEmptyElement())
        //console.log(`Course: ${JSON.stringify(courses)}, sizeDesiderata: ${pagination.size}`)

        let pag = {totalPages: resp.summaries.totalPages, currentPage: resp.summaries.pageable.pageNumber, size: pagination.size} 

        return {courses: courses, pagination: pag, execTime: performance.now() - startTime}
      })
    ).toPromise()
   
  }

  private getEmptyElement() : Course {
    return {studenteCourse: {id: -1, corso: "", sessioni:"", moduli: ""}, docenteCourse: {id: -1, corso: "", sessioni:"", studenti: "" }, adminCourse: {id: 0, corso: "", sessioni:"", studenti: "" }}
  }
}

interface UtenteSummaryResponse{
    "summaries": {
      "totalPages": number,
      "totalElements": number,
      "size": number,
      "content": [
        {
          "id": number,
          "nomeCorso": String,
          "moduli": Number,
          "sessioni": Number,
          "studenti": Number
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