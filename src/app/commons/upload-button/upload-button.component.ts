import { HttpClient, HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadButtonComponent {


  @Input() requiredFileType: string | undefined
  @Input() default: string = 'Nessun file caricato'
  fileName: string | undefined = undefined
  uploadProgress : number | null = null
  uploadSub : Subscription | null = null
  upload : boolean = false
  @Output() onUploadComplete = new EventEmitter<any>()
  @Output() onUploadDelete = new EventEmitter<any>()
  @ViewChild('fileUpload') uploadButton!: ElementRef
  
  constructor(private http: HttpClient, private changeDetector: ChangeDetectorRef) {}

  uploadFile() {
    this.uploadButton.nativeElement.click()
  }

  onFileSelected(event : any) {
    const file:File = event.target.files[0];
    console.log(`Selezionato il file: ${file.name}`)
    this.changeDetector.detectChanges()

    

    //TODO: Implementare la logica per estrapolare i dati dal file excel
    const reader:FileReader = new FileReader()

    reader.onloadstart = () => {
      console.log(`Iniziato l'upload`)
      this.upload = true
      this.changeDetector.detectChanges()
    }
  
    reader.onprogress = (ev) => {
      if(ev.lengthComputable) {
        if(!this.upload) this.upload = true
        this.uploadProgress = Math.round(100 * (ev.loaded / ev.total!))
        this.changeDetector.detectChanges()
        console.log(`Progessi upload: ${Math.round(100 * (ev.loaded / ev.total!))}%`)
      }
    }

    reader.onloadend = () => {
      setTimeout(()=>{
        this.upload = false
        console.log('Upload terminato')
        this.onUploadComplete.emit(this.fileName)
        this.changeDetector.detectChanges()
      },800)
      
    }

    
    
    if (file) {
      this.fileName = file.name;
      this.upload = true
      reader.readAsArrayBuffer(file)
      this.uploadProgress = 10.5
      this.changeDetector.detectChanges()
      
      /*
      // Invio del file al backend
      const formData = new FormData();
      formData.append("thumbnail", file);
     
      const upload$ = this.http.post("/api/thumbnail-upload", formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(
        finalize(() => this.reset())
     );

     this.uploadSub = upload$.subscribe(event => {
      if (event.type == HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total!));
      }
     })
     */
    }

  }

  cancelUpload() {
    console.log(`cancelUpload`)
    //this.uploadSub!.unsubscribe();
    this.reset();
  }

  reset() {
    console.log(`reset`)
    this.onUploadDelete.emit(this.fileName)
    this.uploadProgress = null;
    this.uploadSub = null;
    this.upload = false;
    this.fileName = undefined;
    this.changeDetector.detectChanges()
  }

}
