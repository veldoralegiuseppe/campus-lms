import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Column } from 'src/app/commons/table/table-column';
import { Activity } from './activity-table-row/Activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private activities : Activity[] = [
    {tipo: "tipo1", corso:"corso1", ora:"ora1", classe:"classe1", sessione:"sessione1", link:"link1"} as Activity,
    {tipo: "tipo2", corso:"corso2", ora:"ora2", classe:"classe2", sessione:"sessione2", link:"link2"} as Activity,
    {tipo: "tipo3", corso:"corso3", ora:"ora3", classe:"classe3", sessione:"sessione3", link:"link3"} as Activity,
    {tipo: "tipo4", corso:"corso4", ora:"ora4", classe:"classe4", sessione:"sessione4", link:"link4"} as Activity,
    {tipo: "tipo5", corso:"corso5", ora:"ora5", classe:"classe5", sessione:"sessione5", link:"link5"} as Activity,
    {tipo: "tipo6", corso:"corso6", ora:"ora6", classe:"classe6", sessione:"sessione6", link:"link6"} as Activity,
  
  ]
  
  private activitiesPaginated: Activity[] = []

  constructor() { }

  getActivitiesPaginated(pagination: {page: number, size:number}):  Promise<{activities: Activity[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number}>{
    let startTime = performance.now()
    let pag = this.paginate(pagination)
    return new Promise<any>((resolve, error) =>{
      setTimeout(() => {
        resolve({activities: this.activitiesPaginated, pagination: pag, execTime: performance.now() - startTime})
      }, 0)
    })
  }

  private paginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.activities.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.activitiesPaginated = this.activities.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }
}
