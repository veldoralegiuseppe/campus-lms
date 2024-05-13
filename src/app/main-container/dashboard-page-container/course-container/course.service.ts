import { Injectable } from '@angular/core';
import { Course } from './Course';

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

  constructor() { }

  getCoursesPaginated(pagination: {page: number, size:number}):  Promise<{courses: Course[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number}>{
    let startTime = performance.now()
    let pag = this.paginate(pagination)
    return new Promise<any>((resolve, error) =>{
      setTimeout(() => {
        resolve({courses: this.coursesPaginated, pagination: pag, execTime: performance.now() - startTime})
      }, 0)
    })
  }

  private paginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.courses.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.coursesPaginated = this.courses.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }
}
