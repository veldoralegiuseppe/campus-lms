import { Injectable } from '@angular/core';
import { Course } from './Course';

@Injectable({
  providedIn: 'root'
})
export class CourseService{

 
  private courses : Course[] = [
    {corso: "corso1", studenti:"1", classi: "1"} as Course,
    {corso: "corso2", studenti:"2", classi: "2"} as Course,
    {corso: "corso3", studenti:"3", classi: "3"} as Course,
    {corso: "corso4", studenti:"4", classi: "4"} as Course,
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
