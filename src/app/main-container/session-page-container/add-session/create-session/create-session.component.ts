import { trigger, state, style } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, Type, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaginationComponent } from 'src/app/commons/pagination/pagination.component';
import { Row } from 'src/app/commons/table-v2/Row';
import { TableV2Component } from 'src/app/commons/table-v2/table-v2.component';
import { Session } from '../../search-session/Session';
import { SessionTableRowComponent } from '../../search-session/session-table-row/session-table-row.component';
import { SessionService } from '../../search-session/session.service';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, map, of } from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import { UploadButtonComponent } from 'src/app/commons/upload-button/upload-button.component';

interface Corsi {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-session',
  templateUrl: './stepper-create-session.component.html',
  styleUrls: ['./create-session.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        'opacity': 1,
        'visibility': 'visible',
      })),
      state('close', style({
        'opacity': 0,
        'visibility': 'hidden',
    }))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateSessionComponent implements OnInit, AfterViewInit{

  /**
   * Model
   */
  private session: Session[] = []

  /**
   * Tipo della riga della tabella
   */
  rowType: Type<Row> = SessionTableRowComponent

  /**
   * Riferimento al component della tabella
   */
  @ViewChild(TableV2Component) private table?: TableV2Component

  /**
   * Riferimento alla tabella nel DOM
   */
  @ViewChild(TableV2Component, { read: ElementRef }) tableDOM?: ElementRef<HTMLElement>;

  /**
   * Riferimento alla paginazione
   */
  @ViewChild(PaginationComponent) private pagination?: PaginationComponent

  
  /**
   * Riferimento alle classi
   */
  @ViewChildren(UploadButtonComponent) private uploads?: QueryList<UploadButtonComponent>

  /**
   * Riferimento alle classi
   */
  private fileCaricati = 0

  /**
   * Numero di utenti da visualizzare per pagina (di default)
   */
  pageSize: number = 3

  /**
   * Numero di pagine
   */
  pages: number = 1

  /**
   * Toogle della tabella
   */
  hideTable: boolean = false

  /**
   * Toogle del componente di paginazione
   */
  hidePagination: boolean = true

  /**
   * Toggle dei bottodi di dettaglio e rimozione
   */
  hideOperationButton: boolean = true

  /**
   * Course form
   */
  courseFilter!: FormGroup

  /**
   * Toggle importazione calendarizzazione
   */
  importCalendario: boolean = false

  /**
   * Indica se il primo step è stato completato
   */
  stepOneCompleted: boolean = false

  /**
   * Data minima 
   */
  minDate: Date = new Date()

 
  /**
   * Layout param
   */
  private tableMarginTop: string = '2rem'
  private loadingBarMarginTop: string = '1rem'

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = true;

  corsi: Corsi[] = [];

  stepperOrientation!: Observable<StepperOrientation>;
  
  constructor(private sessionService: SessionService, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,){
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    // inizializzazione corsi
    this.sessionService.getCorsi().then(c => {
      this.corsi = c!.map(v => { return {value: v.nome, viewValue: v.nome}})
    })

    // Inizializzazione form
    this.courseFilter = new FormGroup({
      'corso': new FormControl(''),
      'tipo': new FormControl(''),
      'data': new FormControl('')
    })

  }
  
  ngAfterViewInit(): void {
    //Update table
    // this.table!.size = this.session.length + 1
    // this.getSession({page: this.pages, size: this.pageSize})

  }
  
  onFileUpload(fileName : string){
    ++this.fileCaricati
    this.isStepComplete()
  }

  onFileDelete(fileName : string){
    if(this.fileCaricati > 0) --this.fileCaricati
    this.isStepComplete()
  }

  isStepComplete(){
    let corso = <String>this.courseFilter.get('corso')?.value
    let tipo = <String>this.courseFilter.get('tipo')?.value
    let data = this.courseFilter.get("data")?.value
    let fileName = this.uploads?.first?.fileName ? <String> this.uploads?.first?.fileName : null
    if(fileName) ++this.fileCaricati
    let isStepCompleted = false 

    if(corso && tipo && data){
      if(tipo.toLowerCase() == 'orale') isStepCompleted = true
      else if(fileName) isStepCompleted = true
    }

    console.log(`file caricati: ${this.fileCaricati}, fileName: ${fileName},uploadButtons:${this.uploads?.length}, corsoSelezionato: ${corso}, tipoEsameSelezionato: ${tipo}, dataSelezionata: ${data} isStepComplete:${isStepCompleted}`)
    this.stepOneCompleted = isStepCompleted
    
  }

  /**
   * Mapper tra i dati restituiti dal service e i dati da visualizzare in tabella
   * @param index Indice della riga nella tabella
   * @returns L'oggetto che compone la riga
   */
  sessionTableMapper: (row: number) => any = (index) : {session?: Session, loading?:boolean}=> {
    if(this.session.length <= 0) return {loading: true}
    
    if(index === 0)
    return {session: {corso: 'Corso', modulo: 'Modulo', tipo: 'Tipo', data: 'Data', oraInizio: 'Ora inizio', oraFine: 'Ora fine', durata: 'Durata', pausa: 'Pausa', docente: 'Docente'}}
    else 
      return {session: this.session.at(index-1)}
  }

  /**
   * Risponde al cambio di parametri della paginazione
   * @param pagination 
   */
  handlePaginationChange(pagination: {page: number, size: number}){

    this.getSession(pagination, () => {
      this.tableDOM!.nativeElement.style.marginTop = this.tableMarginTop
      this.tableDOM?.nativeElement.scrollIntoView()
    })
  }

  /**
   * Recupera gli utenti
   * @param pagination paginazione
   */
  getSession(pagination: {page: number, size: number}, onEnd?: () => void){
    
    // Gestione delle form
    console.log(this.courseFilter.value)
    
    this.tableDOM!.nativeElement.style.marginTop = this.loadingBarMarginTop

    this.sessionService.getSessionPaginated(pagination).then(response => {
      this.session = response.session
      this.pages = response.pagination.totalPages
      this.pageSize = response.pagination.size

      if(response.execTime <= 500){
        setTimeout(() => {
          // Update table
          this.table!.size = this.session!.length + 1
  
          // Update pagination
          this.pagination!.pages = this.pages
          this.hidePagination = false
  
          // Update buttons
          this.hideOperationButton = false

          //onEnd
          if(onEnd) onEnd()
        }, 500 - response.execTime)
      }
      else {
        // Update table
        this.table!.size = this.session!.length + 1
  
        // Update pagination
        this.pagination!.pages = this.pages
        this.hidePagination = false

        // Update buttons
        this.hideOperationButton = false

        //onEnd
        if(onEnd) onEnd()
      }
    })

    // CODICE ASINCRONO: Gestione animazione
    this.session = []
    this.hideTable = false
    this.hidePagination = true
    this.hideOperationButton = true
    this.table!.size = pagination.size + 1
  }

  onSubmit(){
    let corso = <String>this.courseFilter.get('corso')?.value
    let tipo = <String>this.courseFilter.get('tipo')?.value
    let data = new Date(this.courseFilter.get("data")?.value)

    console.log(`file caricati: ${this.fileCaricati}, uploads:${this.uploads?.length}, corsoSelezionato: ${corso}, tipoEsameSelezionato: ${tipo}, dataSelezionata: ${data}`)
    
  }


}
