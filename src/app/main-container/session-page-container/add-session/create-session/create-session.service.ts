import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CreateSessionService {

  private _pathSessione = '/api/sessione'
  

  constructor(private _http:HttpClient) { }


  create(sessione: SessioneDTO, file: File | null){

    let url = `${environment.http_server_host}${this._pathSessione}`
  
    const formData = new FormData();
    formData.append("sessione", new Blob([JSON.stringify(sessione)], { type: 'application/json' }) )
    if(file) formData.append("file", file)
      
    return this._http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({ "Content-Type": "multipart/form-data"})
    })

  }
}


export interface SessioneDTO{
  nomeCorso: String,
  data: Date, 
  tipo: String,
  provaScritta?: File
}