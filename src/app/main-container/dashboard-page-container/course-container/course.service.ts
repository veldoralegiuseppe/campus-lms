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

  private courses : Course[] = [
    {studenteCourse: {corso: "corso1", sessioni:"1", moduli: "1"}, docenteCourse: {corso: "corso1", sessioni:"1", studenti: "1" }, adminCourse: {corso: "corso1", sessioni:"1", studenti: "1" }},
    {studenteCourse: {corso: "corso2", sessioni:"2", moduli: "2"}, docenteCourse: {corso: "corso2", sessioni:"2", studenti: "2" }, adminCourse: {corso: "corso2", sessioni:"2", studenti: "2" }},
    {studenteCourse: {corso: "corso3", sessioni:"3", moduli: "3"}, docenteCourse: {corso: "corso2", sessioni:"3", studenti: "3" }, adminCourse: {corso: "corso3", sessioni:"3", studenti: "3" }},
    {studenteCourse: {corso: "corso4", sessioni:"4", moduli: "4"}, docenteCourse: {corso: "corso2", sessioni:"4", studenti: "4" }, adminCourse: {corso: "corso4", sessioni:"4", studenti: "4" }},
  ]
  
  private coursesPaginated: Course[] = []
  
  private _path = '/api/corso/summary'

  constructor(private _http: HttpClient) { }

  getCoursesPaginated(pagination: {page: number, size:number}):  Promise<{courses: Course[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number} | undefined>{
    
    let startTime = performance.now()
    let url = `${environment.http_server_host}${this._path}/${pagination.size}/${pagination.page-1}`
    console.log(`CourseService - url: ${url}`)
    
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
            docenteCourse: role == UserRole.DOCENTE ? {corso: c.nomeCorso, sessioni: c.sessioni.toLocaleString(), studenti: c.studenti.toLocaleString()} : undefined,
            studenteCourse: role == UserRole.STUDENTE ? {corso: c.nomeCorso, sessioni: c.sessioni.toLocaleString(), moduli: c.moduli.toLocaleString()} : undefined,
            adminCourse: role == UserRole.ADMIN ? {corso: c.nomeCorso, sessioni: c.sessioni.toLocaleString(), studenti: c.studenti.toLocaleString()} : undefined
          }

          return course
        })
        for(let i=courses.length; i<pagination.size; i++) courses.push(this.getEmptyElement())
        console.log(`Course: ${JSON.stringify(courses)}, sizeDesiderata: ${pagination.size}`)

        let pag = {totalPages: resp.summaries.totalPages, currentPage: resp.summaries.pageable.pageNumber, size: pagination.size} 

        return {courses: courses, pagination: pag, execTime: performance.now() - startTime}
      })
    ).toPromise()
   
  }

  private paginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.courses.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.coursesPaginated = this.courses.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }

  private getEmptyElement() : Course {
    return {studenteCourse: {corso: "", sessioni:"", moduli: ""}, docenteCourse: {corso: "", sessioni:"", studenti: "" }, adminCourse: {corso: "", sessioni:"", studenti: "" }}
  }
}

interface UtenteSummaryResponse{
    "summaries": {
      "totalPages": number,
      "totalElements": number,
      "size": number,
      "content": [
        {
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