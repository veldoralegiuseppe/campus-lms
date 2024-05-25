import { trigger, state, style } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, LOCALE_ID, OnInit, Type, ViewChild } from '@angular/core';
import { Session } from './Session';
import { SessionTableRowComponent } from './session-table-row/session-table-row.component';
import { FormGroup, FormControl } from '@angular/forms';
import { PaginationComponent } from 'src/app/commons/pagination/pagination.component';
import { ResetFilterButtonComponent } from 'src/app/commons/reset-filter-button/reset-filter-button.component';
import { Row } from 'src/app/commons/table-v2/Row';
import { TableV2Component } from 'src/app/commons/table-v2/table-v2.component';
import { SearchSessioniRequest, SessionService } from './session.service';
import { SwitchButtonComponent } from 'src/app/commons/switch-button/switch-button.component';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: '.app-search-session',
  templateUrl: './search-session.component.html',
  styleUrls: ['./search-session.component.scss'],
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
export class SearchSessionComponent extends AuthenticationComponent implements OnInit, AfterViewInit {

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
   * Course form
   */
  courseFilter!: FormGroup

  /**
   * Activity form
   */
  activityFilter!: FormGroup

  /**
   * Switch modal activity
   */
  @ViewChild(SwitchButtonComponent) switch? : SwitchButtonComponent

  /** 
   * Corsi
   */
  corsi: Corsi[] = [];

  /**
   * Data minima 
   */
  minDate: Date = new Date()

  /**
   * Riga attualmente selezionata
   */
  rowSelected:SessionTableRowComponent | null = null

  private tableMarginTop: string = '8rem'
  private loadingBarMarginTop: string = '6rem'



  constructor(private sessionService: SessionService, private _changeDetector: ChangeDetectorRef, private _snackBar: MatSnackBar){
    super()
    this.minDate.setDate(new Date().getDate() + 1)
  }
  
  ngOnInit(): void {
     // inizializzazione corsi
     this.sessionService.getCorsi(this.authInfo?.payload?.role!).then(c => {
      let result: Corsi[] = c!.map(v => { return <Corsi>{value: v.nome, viewValue: v.nome}})
      this.corsi.push({value: 'tutti', viewValue: 'Tutti'}, ...result)
    })

    // Inizializzazione form
    this.courseFilter = new FormGroup({
      'nomeCorso': new FormControl('tutti'),
      'tipo': new FormControl('tutti'),
      'dataDa': new FormControl(this.minDate),
      'dataA': new FormControl(null)
    })

   
    this.courseFilter.valueChanges.subscribe(value => {
      if(!this.courseFilter.dirty)
        this.resetFilterButton?.enable(false)
      else
        this.resetFilterButton?.enable(true)
    })

    // this.activityFilter.valueChanges.subscribe(value => {
    //   if( JSON.stringify({attivita: "", dataDa: null, dataA: null, fad: false, dad: false}) === JSON.stringify(value) &&
    //       JSON.stringify({corso: "Corso", sessione: "CUP"}) === JSON.stringify(this.courseFilter.value) )
    //     this.resetFilterButton?.enable(false)
    //   else
    //     this.resetFilterButton?.enable(true)
    // })
  }
  
  ngAfterViewInit(): void {
    //Update table
    this.table!.size = this.session.length + 1
  }

 /**
   * Mapper tra i dati restituiti dal service e i dati da visualizzare in tabella
   * @param index Indice della riga nella tabella
   * @returns L'oggetto che compone la riga
   */
  sessionTableMapper: (row: number) => any = (index) : {session?: Session, loading?:boolean}=> {
    if(this.session.length <= 0) return {loading: true}
    
    if(index === 0)
    return {session: {id: -1, corso: 'Corso', tipo: 'Tipo', data: 'Data', docente: 'Docente', studenti: 'Iscrizioni'}}
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
   * Cerca le sessioni con i criteri selezionati nella form
   */
  submitForms: () => void = () => {
    this.getSession({page: 1, size: this.pageSize}, () =>{
      this.tableDOM!.nativeElement.style.marginTop =  this.tableMarginTop
      this.tableDOM?.nativeElement.scrollIntoView({block: 'start', behavior: 'smooth'})
    })
  }

  /**
   * Reset filtri
   */
  resetFilter: () => void = () => {
    
    //this.courseFilter.reset()

    this.courseFilter.reset({
      'nomeCorso': new FormControl('tutti'),
      'tipo': new FormControl('tutti'),
      'dataDa': new FormControl(this.minDate),
      'dataA': new FormControl(null)
    })

    this.resetFilterButton?.enable(false)
  }
  
   /**
   * Recupera le sessioni
   * @param pagination paginazione
   */
   getSession(pagination: {page: number, size: number}, onEnd?: () => void){
    
    // Gestione delle form
    console.log(this.courseFilter.value)
    //console.log(this.activityFilter.value)

    const nomeCorso = this.courseFilter.get('nomeCorso')?.value == 'tutti' ? null : this.courseFilter.get('nomeCorso')?.value
    const tipo = this.courseFilter.get('tipo')?.value?.value == 'tutti' ? null : this.courseFilter.get('tipo')?.value?.value
    const dataDa = this.courseFilter.get('dataDa')?.value ? formatDate(this.courseFilter.get('dataDa')?.value, 'yyyy-MM-dd', 'it-IT') : null
    const dataA = this.courseFilter.get('dataA')?.value ? formatDate(this.courseFilter.get('dataA')?.value, 'yyyy-MM-dd', 'it-IT') : null
  

    const filter: SearchSessioniRequest = {
      nomeCorso: nomeCorso,
      tipo : tipo,
      dataDa: dataDa,
      dataA: dataA
    }

    this.tableDOM!.nativeElement.style.marginTop = this.loadingBarMarginTop

    this.sessionService.getSessionPaginated(filter, pagination).then(response => {
      this.session = response!.sessioni
      this.pages = response!.pagination.totalPages
      this.pageSize = response!.pagination.size

      if(response!.execTime <= 500){
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
        }, 500 - response!.execTime)
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

  /**
   * Callback richiamato al click della checkbox
   * @param observable 
   * @param row 
   */
  onSelectedRow: (observable: {index: number, selected: boolean}, instance: Row) => any = (observable, row) => {
    
    if(observable.selected) {
      if(this.rowSelected != null && this.rowSelected != row){  this.rowSelected!.toggle() }
      this.rowSelected = <SessionTableRowComponent>row
    }
    else if(!observable.selected) {
      if(this.rowSelected != row) return
      this.rowSelected = null
    }

    this._changeDetector.detectChanges()
  }

  iscrizioneSessione(){
    const sessione = <Session>this.rowSelected?.session
    const row = this.rowSelected
    this.rowSelected = null

    this.sessionService.iscrizioneSessione(sessione).subscribe(
      (event) => {},

      (error) => {
        this.rowSelected = row
        this.openSnackBar(error, "Chiudi")
      },

      () => {
        this.openSnackBar("Iscrizione effettuata", "Chiudi")
        this.submitForms()
      }
    )
    
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}

interface Corsi {
  value: string | null;
  viewValue: string;
}