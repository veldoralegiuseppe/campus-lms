import { state, style, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { PaginationComponent } from 'src/app/commons/pagination/pagination.component';
import { DropdownOption } from 'src/app/commons/search-dropdown-bar/dropdown-option';
import { Row } from 'src/app/commons/table-v2/Row';
import { TableV2Component } from 'src/app/commons/table-v2/table-v2.component';
import { Activity } from './activity-table-row/Activity';
import { ActivityTableRowComponent } from './activity-table-row/activity-table-row.component';
import { ActivityService } from './activity.service';
import { FormControl, FormGroup } from '@angular/forms';

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
export class ActivityContainerComponent implements OnInit, AfterViewInit{


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
  dropdownList: DropdownOption[] = [
    new DropdownOption('Tutte le categorie'),
    new DropdownOption('Corsi'),
    new DropdownOption('Classi'),
    new DropdownOption('Sessioni'),
  ];

   /**
   * Activity form
   */
   activityFilter!: FormGroup

   
  constructor(private activityService : ActivityService){}
  
  ngOnInit(): void {
     // Inizializzazione form
     this.activityFilter = new FormGroup({
      'like': new FormControl({option: 'Tutte le categorie', like: ""}),
      'fad': new FormControl(false),
      'dad': new FormControl(false)
    })

    this.activityFilter.valueChanges.subscribe(value => console.log(value))
  }

  ngAfterViewInit(): void {
    this.getActivitiesPaginated({page: this.pages, size: this.pageSize})
  }

  /**
   * Mapper tra i dati restituiti dal service e i dati da visualizzare in tabella
   * @param index Indice della riga nella tabella
   * @returns L'oggetto che compone la riga
   */
  activityTableMapper: ((row: number) => any) = (index) => {
    if(this.activities.length <= 0) return {loading: true}
    
    if(index === 0)
     return {activity: {tipo: 'Tipo', corso: 'Corso', ora: 'Ora', classe: 'Classe', sessione: 'Sessione', link: 'Link'} as Activity, loading: false}
    else 
      return {activity: this.activities.at(index-1), loading: false, isLastRow: index == this.activities.length}
  }

  /**
   * Recupera le attività in maniera paginata
   * @param pagination Paginazione
   * @param onEnd Callbak
   */
  private getActivitiesPaginated(pagination: {page: number, size: number}, onEnd?: () => void){
    
    this.tableDOM!.nativeElement.style.marginTop = '6rem'

    this.activityService.getActivitiesPaginated(pagination).then(response => {
      
      this.activities = response.activities
      this.pages = response.pagination.totalPages
      this.pageSize = response.pagination.size
      
      if(response.execTime <= 500){
        setTimeout(() => {
          // Update table
          this.table!.size = this.activities!.length + 1
          this.tableDOM!.nativeElement.style.marginTop = '4rem'
          this.hideTable = false
  
          // Update pagination
          this.pagination!.pages = this.pages
          this.hidePagination = false
  
          //onEnd
          if(onEnd) onEnd()
        }, 500 - response.execTime)
      }
      else {
        // Update table
        this.table!.size = this.activities!.length + 1
        this.tableDOM!.nativeElement.style.marginTop = '4rem'
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
     this.table!.size = pagination.size + 1
  }

  /**
   * Risponde al cambio di parametri della paginazione
   * @param pagination Paginazione
   */
  handlePaginationChange(pagination: { page: number; size: number; }) {
    this.getActivitiesPaginated(pagination)
  }
}
