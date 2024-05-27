import { state, style, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Row } from 'src/app/commons/table-v2/Row';
import { Progress } from './Progress';
import { ProgressTableRowComponent } from './progress-table-row/progress-table-row.component';
import { PaginationComponent } from 'src/app/commons/pagination/pagination.component';
import { ResetFilterButtonComponent } from 'src/app/commons/reset-filter-button/reset-filter-button.component';
import { TableV2Component } from 'src/app/commons/table-v2/table-v2.component';
import { ProgressService, SearchProgressiRequest } from './progress.service';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import { formatDate } from '@angular/common';

@Component({
  selector: '.app-progress-container',
  templateUrl: './progress-container.component.html',
  styleUrls: ['./progress-container.component.scss'],
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
export class ProgressContainerComponent extends AuthenticationComponent implements OnInit, AfterViewInit {

  /** 
   * Model
   */
  private progress: Progress[] = []

  /**
   * Tipo della riga della tabella
   */
  rowType: Type<Row> = ProgressTableRowComponent

  /**
   * Riga attualmente selezionata
   */
  rowSelected:ProgressTableRowComponent[] = []
  
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
   * Riferimento al button di reset filtri
   */
  @ViewChild(ResetFilterButtonComponent) private resetFilterButton?: ResetFilterButtonComponent
  
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
  hideTable: boolean = true

  /**
   * Toogle del componente di paginazione
   */
  hidePagination: boolean = true

  /**
   * Toggle dei bottodi di dettaglio e rimozione
   */
  hideOperationButton: boolean = true

  /**
   * Users form
   */
  userFilter!: FormGroup

  /**
   * Course form
   */
  courseFilter!: FormGroup

  /**
   * Activity form
   */
  activityFilter!: FormGroup


  corsi: Corsi[] = [];

  myFilter = (d: Date | null): boolean => {
    if(!this.activityFilter.get('dataDa')?.value) return true
    else if(!d) return true
    else return this.activityFilter.get('dataDa')?.value <= d
  };

  private tableMarginTop: string = '8rem'
  private loadingBarMarginTop: string = '6rem'

  constructor(private _service: ProgressService){
    super()
  }
  
  ngOnInit(): void {
     // inizializzazione corsi
     this._service.getCorsi(this.authInfo?.payload?.role!).then(c => {
      let result: Corsi[] = c!.map(v => { return <Corsi>{value: v.nome, viewValue: v.nome}})
      this.corsi.push({value: 'tutti', viewValue: 'Tutti'}, ...result)
    })

    // Inizializzazione form
    this.userFilter = new FormGroup({
      'nome': (this.authInfo?.payload?.nome && this.authInfo.payload.role == 'STUDENTE') ? new FormControl(this.authInfo?.payload?.nome) : new FormControl(""),
      'cognome': (this.authInfo?.payload?.cognome && this.authInfo.payload.role == 'STUDENTE') ? new FormControl(this.authInfo?.payload?.cognome) : new FormControl(""),
      'codiceFiscale': (this.authInfo?.payload?.cf && this.authInfo.payload.role == 'STUDENTE') ? new FormControl(this.authInfo?.payload?.cf) : new FormControl(""),
    })

    this.courseFilter = new FormGroup({
      'nomeCorso': new FormControl('tutti'),
    })

    this.activityFilter = new FormGroup({
      'dataDa': new FormControl(null),
      'dataA': new FormControl(null),
      'orale': new FormControl(false),
      'scritto': new FormControl(false),
    })

    this.userFilter.valueChanges.subscribe(value => {
      if( JSON.stringify({nome: "", cognome: "", codiceFiscale: ""}) === JSON.stringify(value) &&
          JSON.stringify({nomeCorso: "tutti",}) === JSON.stringify(this.courseFilter.value) &&
          JSON.stringify({ dataDa: null, dataA: null, orale: false, scritto: false}) === JSON.stringify(this.activityFilter.value))
        this.resetFilterButton?.enable(false)
      else
        this.resetFilterButton?.enable(true)
    })

    this.courseFilter.valueChanges.subscribe(value => {
      if( JSON.stringify({nomeCorso: "tutti",}) === JSON.stringify(value) && 
          JSON.stringify({nome: "", cognome: "", codiceFiscale: ""}) === JSON.stringify(this.userFilter.value) &&
          JSON.stringify({dataDa: null, dataA: null, orale: false, scritto: false}) === JSON.stringify(this.activityFilter.value))
        this.resetFilterButton?.enable(false)
      else
        this.resetFilterButton?.enable(true)
    })

    this.activityFilter.valueChanges.subscribe(value => {
      if( JSON.stringify({dataDa: null, dataA: null, orale: false, scritto: false}) === JSON.stringify(value) &&
          JSON.stringify({nomeCorso: "tutti",}) === JSON.stringify(this.courseFilter.value) && 
          JSON.stringify({nome: "", cognome: "", codiceFiscale: ""}) === JSON.stringify(this.userFilter.value))
        this.resetFilterButton?.enable(false)
      else
        this.resetFilterButton?.enable(true)
    })

    this.activityFilter.get('dataDa')?.valueChanges.subscribe(v => {
      if(v > this.activityFilter.get('dataA')?.value) this.activityFilter.get('dataA')?.setValue(null)
    })
  }
  
  ngAfterViewInit(): void {
    //Update table
    this.table!.size = this.progress.length + 1
  }

 /**
   * Mapper tra i dati restituiti dal service e i dati da visualizzare in tabella
   * @param index Indice della riga nella tabella
   * @returns L'oggetto che compone la riga
   */
  progressTableMapper: (row: number) => any = (index) : {progress?: Progress, loading?:boolean}=> {
    if(this.progress.length <= 0) return {loading: true}
    
    if(index === 0)
    return {progress: {nome: 'Nome', cognome: 'Cognome', codiceFiscale: 'CF', tipo: 'Tipo', data: 'Data', esito: "Esito", corso: "Corso"}}
    else 
      return {progress: this.progress.at(index-1)}
  }

  /**
   * Callback richiamato al click della checkbox
   * @param observable 
   * @param row 
   */
  onSelectedRow: (observable: {index: number, selected: boolean}, instance: Row) => any = (observable, row) => {
    
    if(observable.selected) {
      this.rowSelected?.push(row as ProgressTableRowComponent) 
    }
    else if(!observable.selected) {
      this.rowSelected = this.rowSelected?.filter(row => row.index != observable.index)
    }
  }

  /**
   * Risponde al cambio di parametri della paginazione
   * @param pagination 
   */
  handlePaginationChange(pagination: {page: number, size: number}){

    // Rest righe selezionate
    this.rowSelected = []

    this.getProgress(pagination, () => {
      this.tableDOM!.nativeElement.style.marginTop = this.tableMarginTop
      this.tableDOM?.nativeElement.scrollIntoView()
    })
  }

  /**
   * Cerca gli utenti con i criteri selezionati nella form
   */
  submitForms: () => void = () => {
    this.getProgress({page: 1, size: this.pageSize}, () =>{
      this.tableDOM!.nativeElement.style.marginTop =  this.tableMarginTop
      this.tableDOM?.nativeElement.scrollIntoView({block: 'start', behavior: 'smooth'})
    })
  }

  /**
   * Reset filtri
   */
  resetFilter: () => void = () => {
    this.userFilter.reset({
      'nome': "",
      'cognome': "",
      'codiceFiscale': ""
    })

    this.courseFilter.reset({
      'nomeCorso': 'tutti',
    })

    this.activityFilter.reset({
      'dataDa': null,
      'dataA': null,
      'orale': false,
      'scritto': false,
    })

    this.resetFilterButton?.enable(false)
  }
  
   /**
   * Recupera gli utenti
   * @param pagination paginazione
   */
   getProgress(pagination: {page: number, size: number}, onEnd?: () => void){
    
    // Gestione delle form
    // console.log(this.userFilter.value)
    // console.log(this.courseFilter.value)
    // console.log(this.activityFilter.value)

    let tipoSessione: string | null = null

    if(this.activityFilter.get('orale')?.value && this.activityFilter.get('scritto')?.value) tipoSessione = null
    else if(!this.activityFilter.get('orale')?.value && !this.activityFilter.get('scritto')?.value) tipoSessione = null
    else if(this.activityFilter.get('orale')?.value && !this.activityFilter.get('scritto')?.value) tipoSessione = 'orale'
    else if(this.activityFilter.get('scritto')?.value && !this.activityFilter.get('orale')?.value) tipoSessione = 'scritto'

    const dataDa = this.activityFilter.get('dataDa')?.value ? formatDate(this.activityFilter.get('dataDa')?.value, 'yyyy-MM-dd', 'it-IT') : null
    const dataA = this.activityFilter.get('dataA')?.value ? formatDate(this.activityFilter.get('dataA')?.value, 'yyyy-MM-dd', 'it-IT') : null
  

    const req: SearchProgressiRequest = {
      nome: this.userFilter.get('nome')?.value ? this.userFilter.get('nome')?.value : null,
      cognome: this.userFilter.get('cognome')?.value ? this.userFilter.get('cognome')?.value : null,
      codiceFiscale: this.userFilter.get('codiceFiscale')?.value ? this.userFilter.get('codiceFiscale')?.value : null,
      tipoSessione: tipoSessione,
      nomeCorso: this.courseFilter.get('nomeCorso')?.value != 'tutti'  ? this.courseFilter.get('nomeCorso')?.value : null,
      dataA: dataA,
      dataDa: dataDa
    }

    //console.log(req)
    this.tableDOM!.nativeElement.style.marginTop = this.loadingBarMarginTop

    this._service.getProgressPaginated(pagination, req).then(response => {
      this.progress = response!.progressi
      this.pages = response!.pagination.totalPages
      this.pageSize = response!.pagination.size

      if(response!.execTime <= 500){
        setTimeout(() => {
          // Update table
          this.table!.size = this.progress!.length + 1
  
          // Update pagination
          this.pagination!.pages = this.pages
          this.hidePagination = false
  
          // Update buttons
          this.hideOperationButton = false

          //onEnd
          if(onEnd) onEnd()
        }, 500 - response!.execTime)
      }
      else {
        // Update table
        this.table!.size = this.progress!.length + 1
  
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
    this.progress = []
    this.hideTable = false
    this.hidePagination = true
    this.hideOperationButton = true
    this.table!.size = pagination.size + 1
  }

 
}

interface Corsi {
  value: string | null;
  viewValue: string;
}