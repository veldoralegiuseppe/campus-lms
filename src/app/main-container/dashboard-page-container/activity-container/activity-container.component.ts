import { state, style, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { PaginationComponent } from 'src/app/commons/pagination/pagination.component';
import { DropdownOption } from 'src/app/commons/search-dropdown-bar/dropdown-option';
import { Row } from 'src/app/commons/table-v2/Row';
import { TableV2Component } from 'src/app/commons/table-v2/table-v2.component';
import { Activity, StudenteActivity } from './activity-table-row/Activity';
import { ActivityTableRowComponent } from './activity-table-row/activity-table-row.component';
import { ActivityService } from './activity.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import { AuthService } from 'src/app/commons/authentication/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CheckboxV2Component } from 'src/app/commons/checkbox-v2/checkbox-v2.component';
import { FormBuilder } from '@angular/forms'

@Component({
  selector: '.app-activity-container',
  templateUrl: './activity-container.component.html',
  styleUrls: ['./activity-container.component.scss'],
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
export class ActivityContainerComponent extends AuthenticationComponent implements OnInit, AfterViewInit{


  /**
   * Tabella delle attività
   */
  private activities: Activity[] = [];

  /**
   * Tipo di riga della tabella
   */
  rowType: Type<Row> = ActivityTableRowComponent

  /**
   * Riferimento alla paginazione
   */
  @ViewChild(PaginationComponent) private pagination?: PaginationComponent

  /**
   * Riferimento al component della tabella
   */
  @ViewChild(TableV2Component) private table?: TableV2Component

  /**
   * Riferimento alla tabella nel DOM
   */
  @ViewChild(TableV2Component, { read: ElementRef }) tableDOM?: ElementRef<HTMLElement>;

  /**
   * Numero di utenti da visualizzare per pagina (di default)
   */
  pageSize: number = 3

  /**
   * Numero di pagine
   */
  pages: number = 1

  /**
   * Toggle del componente di paginazione
   */
  hidePagination: boolean = true

  /**
   * Toggle del componente della tabella
   */
  hideTable: boolean = false

  /**
   * Dropdown
   */
  dropdownList: DropdownOption[] = [];

   /**
   * Activity form
   */
   activityFilter!: FormGroup
   private activeFilter: BehaviorSubject<string> = new BehaviorSubject<string>("")
 
   /**
    * Current user role
    */
   private role: String = ""

   /**
    * Table header
    */
   private header : Activity = {}


   
  constructor(private activityService : ActivityService, private formBuilder: FormBuilder){
    super();
  }
  
  ngOnInit(): void {
    // Recupero il ruolo dell'utente corrente
    this.role = this.authInfo!.payload!.role.toString()

    // Inizializzazione elementi condizionali
    if(this.role == "STUDENTE"){
      this.dropdownList = [
        new DropdownOption('Corso'),
      ]
      this.header = {studenteActivity: {tipo: 'Tipo', corso: 'Corso', data: 'Data', dettaglio: 'Dettaglio'}}
      this.activityFilter = this.formBuilder.group({
        tipoOptions: ['studio'],
      })
      this.activeFilter.next("studio")
    }
    else if(this.role == "DOCENTE"){
      this.dropdownList = [
        new DropdownOption('Corso'),
        new DropdownOption('Sessione'),
      ]
      this.header = {docenteActivity: {sessione: 'Sessione', corso: 'Corso', data: 'Data', correzione: 'Correzione'}}
      this.activityFilter = this.formBuilder.group({
        tipoOptions: ['daCorreggere'],
      })
      this.activeFilter.next("daCorreggere")
    }
    else if(this.role == "ADMIN"){
      
    }
   
    this.activityFilter?.valueChanges.subscribe(value => {
      //console.log(value)
      if(value.tipoOptions == 'studio') this.activeFilter.next('studio')
      else if(value.tipoOptions =='sessioni') this.activeFilter.next('sessioni')
    })

    this.activeFilter.subscribe(f => {
      this.pages = 1;
      this.pageSize = 3;
      
      if(f == 'studio') this.getActivitiesPaginated({page: this.pages, size: this.pageSize})
      else if(f == 'sessioni') this.getSessioniPaginated({page: this.pages, size: this.pageSize})
      else if(f == 'daCorreggere') this.getSessioniPaginated({page: this.pages, size: this.pageSize})
      else if(f == 'corrette') this.getSessioniPaginated({page: this.pages, size: this.pageSize})
    })
  }

  ngAfterViewInit(): void {
    if(this.role == "STUDENTE") this.getActivitiesPaginated({page: this.pages, size: this.pageSize})
    else if(this.role == "DOCENTE") this.getSessioniPaginated({page: this.pages, size: this.pageSize})
  }

  /**
   * Mapper tra i dati restituiti dal service e i dati da visualizzare in tabella
   * @param index Indice della riga nella tabella
   * @returns L'oggetto che compone la riga
   */
  activityTableMapper: ((row: number) => any) = (index) => {
    if(this.activities.length <= 0) return {loading: true}
    
    if(index === 0)
     return {activity: this.header, loading: false}
    else 
      return {activity: this.activities.at(index-1), loading: false, isLastRow: index == this.activities.length}
  }

  /**
   * Recupera le attività in maniera paginata
   * @param pagination Paginazione
   * @param onEnd Callbak
   */
  private getActivitiesPaginated(pagination: {page: number, size: number}, onEnd?: () => void){
    
    if(this.tableDOM?.nativeElement) this.tableDOM.nativeElement.style.marginTop = '6rem'

    this.activityService.getActivitiesPaginated(pagination).then(response => {
      
      this.activities = response!.activities
      this.pages = response!.pagination.totalPages
      this.pageSize = response!.pagination.size
      
      if(response!.execTime <= 500){
        setTimeout(() => {
          // Update table
          if(this.table?.size) this.table.size = this.activities!.length + 1
          if(this.tableDOM?.nativeElement) this.tableDOM!.nativeElement.style.marginTop = '4rem'
          this.hideTable = false
  
          // Update pagination
          this.pagination!.pages = this.pages
          this.hidePagination = false
  
          //onEnd
          if(onEnd) onEnd()
        }, 500 - response!.execTime)
      }
      else {
        // Update table
        if(this.table?.size) this.table!.size = this.activities!.length + 1
        if(this.tableDOM?.nativeElement) this.tableDOM!.nativeElement.style.marginTop = '4rem'
        this.hideTable = false
  
        // Update pagination
        this.pagination!.pages = this.pages
        this.hidePagination = false

        //onEnd
        if(onEnd) onEnd()
      }
    })

     // CODICE ASINCRONO: Gestione animazione
     this.activities = []
     this.hideTable = false
     this.hidePagination = true
     if(this.table?.size) this.table!.size = pagination.size + 1
  }

  /**
   * Recupera le sessoni in maniera paginata
   * @param pagination Paginazione
   * @param onEnd Callbak
   */
  private getSessioniPaginated(pagination: {page: number, size: number}, onEnd?: () => void){
    
    if(this.tableDOM?.nativeElement) this.tableDOM!.nativeElement.style.marginTop = '6rem'
    this.activityService.getSessioniPaginated(pagination).then(response => {
      
      this.activities = response!.activities
      this.pages = response!.pagination.totalPages
      this.pageSize = response!.pagination.size
      
      if(response!.execTime <= 500){
        setTimeout(() => {
          // Update table
          if(this.table?.size) this.table!.size = this.activities!.length + 1
          if(this.tableDOM?.nativeElement) this.tableDOM!.nativeElement.style.marginTop = '4rem'
          this.hideTable = false
  
          // Update pagination
          this.pagination!.pages = this.pages
          this.hidePagination = false
  
          //onEnd
          if(onEnd) onEnd()
        }, 500 - response!.execTime)
      }
      else {
        // Update table
        if(this.table?.size) this.table!.size = this.activities!.length + 1
        if(this.tableDOM?.nativeElement) this.tableDOM!.nativeElement.style.marginTop = '4rem'
        this.hideTable = false
  
        // Update pagination
        this.pagination!.pages = this.pages
        this.hidePagination = false

        //onEnd
        if(onEnd) onEnd()
      }
    })

     // CODICE ASINCRONO: Gestione animazione
     this.activities = []
     this.hideTable = false
     this.hidePagination = true
     if(this.table?.size) this.table!.size = pagination.size + 1
  }

  /**
   * Risponde al cambio di parametri della paginazione
   * @param pagination Paginazione
   */
  handlePaginationChange(pagination: { page: number; size: number; }) {
    console.log("handlePaginationChange")
    if(this.activeFilter.value == 'studio') this.getActivitiesPaginated(pagination)
    else if(this.activeFilter.value == 'sessioni') this.getSessioniPaginated(pagination)
    else if(this.activeFilter.value == 'daCorreggere') this.getSessioniPaginated(pagination)
    else if(this.activeFilter.value == 'corrette') this.getSessioniPaginated(pagination)
  }

  /**
   * Converta la stringa in camelcase in testo con spazi 
   * @param s 
   * @returns 
   */
  camelCaseToWords(s: string) {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  
}
