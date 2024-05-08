import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Column } from 'src/app/commons/table/table-column';
import { Activity, StudenteActivity } from './activity-table-row/Activity';

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
