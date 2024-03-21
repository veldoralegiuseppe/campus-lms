import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users : User[] = [
    {id: 1,nome: 'nome1', cognome: 'cognome1', email: 'email1', corso: 'corso1', classe: 'classe1', sessione: 'sessione1'},
    {id: 2,nome: 'nome2', cognome: 'cognome2', email: 'email2', corso: 'corso2', classe: 'classe2', sessione: 'sessione2'},
    {id: 3,nome: 'nome3', cognome: 'cognome3', email: 'email3', corso: 'corso3', classe: 'classe3', sessione: 'sessione3'},
    {id: 4,nome: 'nome4', cognome: 'cognome4', email: 'email4', corso: 'corso4', classe: 'classe4', sessione: 'sessione4'},
    {id: 5,nome: 'nome5', cognome: 'cognome5', email: 'email5', corso: 'corso5', classe: 'classe5', sessione: 'sessione5'},
    {id: 6,nome: 'nome6', cognome: 'cognome6', email: 'email6', corso: 'corso6', classe: 'classe6', sessione: 'sessione6'},
    {id: 7,nome: 'nome7', cognome: 'cognome7', email: 'email7', corso: 'corso7', classe: 'classe7', sessione: 'sessione7'},
    {id: 8,nome: 'nome8', cognome: 'cognome8', email: 'email8', corso: 'corso8', classe: 'classe8', sessione: 'sessione8'},
    {id: 9,nome: 'nome9', cognome: 'cognome9', email: 'email9', corso: 'corso9', classe: 'classe9', sessione: 'sessione9'},
    {id: 10,nome: 'nome10', cognome: 'cognome10', email: 'email10', corso: 'corso10', classe: 'classe10', sessione: 'sessione10'},
  ]
  private usersPaginated : User[] = []

  getUsers() : Observable<User[]> {
    return of(this.users)
  }

  getUsersPaginated(pagination: {page: number, size:number}):  Promise<{users: User[], pagination: {totalPages: number, currentPage: number, size: number}, execTime: number}>{
    let startTime = performance.now()
    let pag = this.paginate(pagination)
    return new Promise<any>((resolve, error) =>{
      setTimeout(() => {
        resolve({users: this.usersPaginated, pagination: pag, execTime: performance.now() - startTime})
      }, 0)
    })
  }

  paginate(pagination: {page: number, size:number}): {totalPages: number, currentPage: number, size: number}{
    // CODICE DI BACKEND
    let pag = {totalPages: Math.ceil(this.users.length/pagination.size), currentPage: pagination.page, size: pagination.size} 
    let offset = 0
    let startIndex = ((pagination.page-1)*pagination.size) + offset
    this.usersPaginated = this.users.slice(startIndex,startIndex+pagination.size)
    
    return pag
  }

}
