import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoadingComponent } from "../../../commons/loading/loading.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../login/login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateCorsoRequest, CreateCourseService } from './create-course.service';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: '.app-create-course-container',
    templateUrl: './create-course-container.component.html',
    styleUrl: './create-course-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCourseContainerComponent implements OnInit{

  /**
   * Utente form
   */
  corsoForm!: FormGroup

  /**
    * Matcher
    */
  matcher = new MyErrorStateMatcher();

  /** 
    * Progress
    */
  progress: number | null = null

  /**
   * Docenti
   */
  docenti: Docente[] = []

  /**
   * Event emitter
   */
  @Output() onCreationComplete = new EventEmitter<any>()

  constructor(private _snackBar: MatSnackBar, private _service: CreateCourseService, private _changeDetector: ChangeDetectorRef){}

  ngOnInit(): void {
    // Inizializzo i docenti
    this._service.getDocenti().then(d => {
      this.docenti = d!.map(v => { return {value: v.email.toUpperCase(), viewValue: `${v.nome.toUpperCase()} ${v.cognome.toUpperCase()} - ${v.codiceFiscale.toUpperCase()}`}})
    })

    // Inizializzazione form
    this.corsoForm = new FormGroup({
      "nome": new FormControl(null, [Validators.required]),
      "descrizione":  new FormControl(null),
      "docente":  new FormControl(null, [Validators.required])
    })
  }

  onSubmit() {
   
   const createCorsoRequest: CreateCorsoRequest = {
      nome: this.corsoForm.get('nome')?.value,
      descrizione: this.corsoForm.get('descrizione')?.value,
      emailDocente: this.corsoForm.get('docente')?.value
   }

   console.log(createCorsoRequest)

   this._service.create(createCorsoRequest).subscribe(
      (event) => {
        if (event.type == HttpEventType.UploadProgress){ 
          this.progress = Math.round(100 * (event.loaded / event.total!));
          this._changeDetector.detectChanges()
        }
      },

      (error) => {
        this.progress = null
        this.openSnackBar(error, "Chiudi")
        this._changeDetector.detectChanges()
      },

      () => {
        this.progress = null
        this.corsoForm.reset()
        this.openSnackBar("Corso creato con successo", "Chiudi")
        this.onCreationComplete.emit()
        this._changeDetector.detectChanges()
      }

    )
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  
}

interface Docente {
  value: string;
  viewValue: string;
}