import { HttpClient } from '@angular/common/http';
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
    
    if(file){
      const formData = new FormData();
      formData.append("thumbnail", file);
      sessione.provaScritta = formData
    }

    return this._http.post(url, sessione, {
      reportProgress: true,
      observe: 'events'
    })

  }
}


export interface SessioneDTO{
  nomeCorso: String,
  data: Date, 
  tipo: String,
  provaScritta?: FormData
}