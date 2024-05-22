import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog,} from '@angular/material/dialog'
import { UploadButtonComponent } from 'src/app/commons/upload-button/upload-button.component';
import { AttivitaDTO, CorsoDetailsDTO, CorsoService, ModuloDetailsDTO } from './corso.service';


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
   * Utility function
   */
  groupBy = function(xs: any, key: any) {
    return xs.reduce(function(rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private _service: CorsoService, private _changeDetector: ChangeDetectorRef) {
    super()
    this.idCorso = Number(this.route.snapshot.paramMap.get('id'))
  }
  
  ngOnInit(): void {
    
    //Inizializzo il dettaglio
    this._service.getDettaglioCorso(this.idCorso).subscribe(c => {
        this.corso = c
        this.progress = null
        //console.log(this.groupBy(this.corso.moduli![0].attivita, 'settimanaProgrammata'))
        this._changeDetector.detectChanges()
    })
  }

  createModulo() {
    console.log('Creazione nuovo modulo')
  }

  addActivity() {
    console.log("Aggiungi attività")
  }

  groupBySettimana(modulo: ModuloDetailsDTO): { [key: number] : Array<AttivitaDTO>}{
    return this.groupBy(modulo.attivita, 'settimanaProgrammata')
  }


  openAttivitaDialog(modulo: ModuloDetailsDTO): void {
    const dialogRef = this.dialog.open(AddActivityDialogComponent, {
      data: {idCorso: this.idCorso, idModulo: modulo.id} as AttivitaData,
      height: '25%',
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  openModuloDialog(): void{
    const dialogRef = this.dialog.open(AddModuloDialogComponent, {
      data: {idCorso: this.idCorso} as ModuloData,
      height: '25%',
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'add-activity-dialog.html',
  styleUrls: ['./add-activity-dialog.scss']
})
export class AddActivityDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttivitaData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileUpload(file: File){
    
  }
}


@Component({
  selector: 'add-modulo-dialog',
  templateUrl: 'add-modulo-dialog.html',
  styleUrls: ['./add-activity-dialog.scss']
})
export class AddModuloDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddModuloDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuloData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface AttivitaData {
  idCorso: number,
  idModulo: number,
  nomeModulo: string
}

export interface ModuloData {
  idCorso: number,
}
