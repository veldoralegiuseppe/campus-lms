import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog,} from '@angular/material/dialog'
import { AttivitaDetailsDTO, CorsoDetailsDTO, CorsoService, CreateAttivitaRequest, CreateModuloRequest, DocumentaleDTO, ModuloDetailsDTO } from './corso.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyErrorStateMatcher } from '../login/login.component';
import { ErrorStateMatcher } from '@angular/material/core';


@Component({
  selector: 'app-course-page-container',
  templateUrl: './course-page-container.component.html',
  styleUrls: ['./course-page-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursePageContainerComponent extends AuthenticationComponent implements OnInit{

  /**
   * Path param
   */
  idCorso: number

  /**
   * Panel state
   */
  panelOpenState: boolean = false

  /**
   * Dettaglio corso
   */
  corso: CorsoDetailsDTO | null = null

  /**
   * Progress 
   */
  progress: number | null = 10

  /**
    * Matcher
    */
  matcher = new MyErrorStateMatcher();

  /**
   * Utility function
   */
  groupBy = function(xs: any, key: any) {
    return xs.reduce(function(rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private _service: CorsoService, private _changeDetector: ChangeDetectorRef, private _snackBar: MatSnackBar) {
    super()
    this.idCorso = Number(this.route.snapshot.paramMap.get('id'))
  }
  
  ngOnInit(): void {
    this._service.getDettaglioCorso(this.idCorso).subscribe(c => {
      this.corso = c
      this.progress = null
      this._changeDetector.detectChanges()
    })
  }

  createModulo() {
    console.log('Creazione nuovo modulo')
  }

  groupBySettimana(modulo: ModuloDetailsDTO): { [key: number] : Array<AttivitaDetailsDTO>}{
    return this.groupBy(modulo.attivita, 'settimanaProgrammata')
  }

  openAttivitaDialog(modulo: ModuloDetailsDTO): void {
    const dialogRef = this.dialog.open(AddActivityDialogComponent, {
      data: {idCorso: this.idCorso, idModulo: modulo.id, nomeModulo: modulo.nome, snackBar: this._snackBar} as AttivitaData,
      height: '60%',
      width: '60%'
    });

    let subscription: Subscription 
    
    dialogRef.afterOpened().subscribe(() => {
      subscription = dialogRef.componentInstance.creationActivityObserver.subscribe(isCreated => {
        if(isCreated == false){
          this.progress = 10;
          this._changeDetector.detectChanges()
        } 
        else if(isCreated) return
      })
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      subscription.unsubscribe()
    });
  }

  openModuloDialog(): void{
    const dialogRef = this.dialog.open(AddModuloDialogComponent, {
      data: {idCorso: this.idCorso, matcher: this.matcher, snackBar: this._snackBar} as ModuloData,
      height: '40%',
      width: '40%'
    });

    let subscription: Subscription 
    
    dialogRef.afterOpened().subscribe(() => {
      subscription = dialogRef.componentInstance.creationModuloObserver.subscribe(isCreated => {
        if(isCreated == false){
          this.progress = 10;
          this._changeDetector.detectChanges()
        } 
        else if(isCreated) return
      })
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      subscription.unsubscribe()
    });
  }

  download(documentale: DocumentaleDTO) {
    console.log(`Download file: ${JSON.stringify(documentale)}`)
    this._service.download(documentale).subscribe(file => {
      const blob = new Blob([file!], { type: documentale.contentType });
      const url= window.URL.createObjectURL(blob);
      window.open(url);
    })
    
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'add-activity-dialog.html',
  styleUrls: ['./add-activity-dialog.scss']
})
export class AddActivityDialogComponent {
  
  attivitaForm: FormGroup;
  private _file: File | null = null
  private creation$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  creationActivityObserver: Observable<boolean | null> = this.creation$.asObservable()
  
  constructor(public dialogRef: MatDialogRef<AddActivityDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AttivitaData, private _service: CorsoService) {
    this.attivitaForm = new FormGroup({
      "tipo": new FormControl("STUDIO", [Validators.required]),
      "settimanaProgrammata": new FormControl(1,[Validators.required])
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileUpload(file: File){
    this._file = file
  }

  onFileDelete(file: File){
    this._file = file
  }

  create(){
    
    const req: CreateAttivitaRequest = {
      tipo: this.attivitaForm.get("tipo")?.value,
      settimanaProgrammata: this.attivitaForm.get("settimanaProgrammata")?.value,
      idModulo: this.data.idModulo,
      idCorso: this.data.idCorso,
    }
    
    this.creation$.next(true)
    this._service.createAttivita(req, this._file!).subscribe(
      (event) => { },
      (error) =>{
        this.data.snackBar.open(error, "Chiudi")
        this.creation$.next(false)
      },
      () => { 
        this.data.snackBar.open("Attività creata con successo", "Chiudi")
        this.creation$.next(false) 
      }
    )
   
  }
}


@Component({
  selector: 'add-modulo-dialog',
  templateUrl: 'add-modulo-dialog.html',
  styleUrls: ['./add-activity-dialog.scss']
})
export class AddModuloDialogComponent {
  
  moduloForm: FormGroup;
  matcher: ErrorStateMatcher
  private creation$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  creationModuloObserver: Observable<boolean | null> = this.creation$.asObservable()

  constructor(public dialogRef: MatDialogRef<AddModuloDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ModuloData, private _service: CorsoService) {
    
    this.moduloForm = new FormGroup({
      "nome": new FormControl(null, [Validators.required, Validators.minLength(5)]),
      "descrizione": new FormControl(null, [Validators.required]),
    })

    this.matcher = data.matcher
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  create(){

    const req: CreateModuloRequest = {
      idCorso: this.data.idCorso,
      nome: this.moduloForm.get("nome")?.value,
      descrizione: this.moduloForm.get("descrizione")?.value
    }

    this.creation$.next(true)
    this._service.createModulo(req).subscribe(
      (event) => { },
      (error) =>{
        this.data.snackBar.open(error, "Chiudi")
        this.creation$.next(false)
      },
      () => { 
        this.data.snackBar.open("Modulo creato con successo", "Chiudi")
        this.creation$.next(false) 
      }
    )

  }
}

export interface AttivitaData {
  idCorso: number,
  idModulo: number,
  nomeModulo: string,
  snackBar: MatSnackBar
}

export interface ModuloData {
  idCorso: number,
  matcher: ErrorStateMatcher,
  snackBar: MatSnackBar
}
