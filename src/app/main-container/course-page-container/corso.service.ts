import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorsoService {

  private _pathCorso = '/api/corso'

  constructor(private _http: HttpClient) { }

  getDettaglioCorso(id: number){
    let url = `${environment.http_server_host}${this._pathCorso}/dettaglio/M_A/${id}`
    console.log(url)

    return this._http.get(url).pipe(
      map((response) => {
        return <CorsoDetailsDTO> response
      })
    )
  }
}

export interface CorsoDetailsDTO{
  id: String,
  nome: String,
  descrizione: String,
  moduli: ModuloDetailsDTO[] | null,
}

export interface ModuloDetailsDTO{
  id: number,
  nome: string,
  descrizione: string | null,
  attivita: AttivitaDTO[] | null
}

export interface AttivitaDTO{
  descrizione: string | null,
  tipo: string,
  settimanaProgrammata: string,
  idModulo: number,
  id: number
}