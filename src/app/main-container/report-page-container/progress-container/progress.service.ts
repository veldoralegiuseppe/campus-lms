import { Injectable } from '@angular/core';
import { Progress } from './Progress';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  
  private progress: Progress[] = [
    {nome: "nome1", cognome:"cognome1", codiceFiscale:"codiceFiscale1", attivita:"attivita1", tipo:"tipo1", data:"data1", oraInizio:"inizio1", oraFine:"fine1", completata:"completata1"} as Progress,
    {nome: "nome2", cognome:"cognome2", codiceFiscale:"codiceFiscale2", attivita:"attivita2", tipo:"tipo2", data:"data2", oraInizio:"inizio2", oraFine:"fine2", completata:"completata2"} as Progress,
    {nome: "nome3", cognome:"cognome3", codiceFiscale:"codiceFiscale3", attivita:"attivita3", tipo:"tipo3", data:"data3", oraInizio:"inizio3", oraFine:"fine3", completata:"completata3"} as Progress,
    {nome: "nome4", cognome:"cognome4", codiceFiscale:"codiceFiscale4", attivita:"attivita4", tipo:"tipo4", data:"data4", oraInizio:"inizio4", oraFine:"fine4", completata:"completata4"} as Progress,
    {nome: "nome5", cognome:"cognome5", codiceFiscale:"codiceFiscale5", attivita:"attivita5", tipo:"tipo5", data:"data5", oraInizio:"inizio5", oraFine:"fine5", completata:"completata5"} as Progress,
    {nome: "nome6", cognome:"cognome6", codiceFiscale:"codiceFiscale6", attivita:"attivita6", tipo:"tipo6", data:"data6", oraInizio:"inizio6", oraFine:"fine6", completata:"completata6"} as Progress,
    {nome: "nome7", cognome:"cognome7", codiceFiscale:"codiceFiscale7", attivita:"attivita7", tipo:"tipo1", data:"data7", oraInizio:"inizio7", oraFine:"fine7", completata:"completata7"} as Progress,
  ]
  private progressPaginated: Progress[] = []

  getProgressPaginated(pagination: { page: number; size: number; }) {
    let startTime = performance.now()
    let pag = this.paginate(pagination)
    return new Promise<any>((resolve, error) =>{
      setTimeout(() => {
        resolve({progress: this.progressPaginated, pagination: pag, execTime: performance.now() - startTime})
      }, 0)
    })
  }

  private paginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.progress.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.progressPaginated = this.progress.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }
}
