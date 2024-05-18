import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private _http: HttpClient) { }

  // TODO: da aggiustare
  upload(file: File){
    // invio del file al backend
    if(!file) return
    const formData = new FormData();
    formData.append("thumbnail", file);
   
    const upload$ = this._http.post("/api/thumbnail-upload", formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      finalize(() => {
       
      })
   );
  }
}

