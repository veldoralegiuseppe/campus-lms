import { state, style, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { DetailButtonComponent } from 'src/app/commons/detail-button/detail-button.component';
import { PaginationComponent } from 'src/app/commons/pagination/pagination.component';
import { RemoveButtonComponent } from 'src/app/commons/remove-button/remove-button.component';
import { Row } from 'src/app/commons/table-v2/Row';
import { TableV2Component } from 'src/app/commons/table-v2/table-v2.component';
import { User } from './User';
import { UserTableRowComponent } from './user-table-row/user-table-row.component';
import { SearchUtenteRequest, UserService, UtenteDTO } from './user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ResetFilterButtonComponent } from 'src/app/commons/reset-filter-button/reset-filter-button.component';

@Component({
  selector: '.app-search-user-container',
  templateUrl: './search-user-container.component.html',
  styleUrls: ['./search-user-container.component.scss'],
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
export class SearchUserContainerComponent implements OnInit, AfterViewInit{

  /**
   * Tabella degli utenti
   */
  private users: User[] = []

  /**
   * Tipo della riga della tabella
   */
  rowType: Type<Row> = UserTableRowComponent

  /**
   * Riga attualmente selezionata
   */
  private rowSelected?: UserTableRowComponent

  /**
   * Riferimento al button di rimozione
   */
  @ViewChild(RemoveButtonComponent) private removeButton?: RemoveButtonComponent

  /**
   * Riferimento al button di dettaglio
   */
  @ViewChild(DetailButtonComponent) private detailButton?: DetailButtonComponent

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
   * Nomi di tutti i corsi
   */
  private nomeCorsi: {nome: string}[] = []

 

  constructor(private userService: UserService){}

  /**
   * Inizializza il model
   */
  ngOnInit(): void {
    // Request per popolare la select dei corsi disponibili
    this.userService.getCorsi().then(corsi => this.nomeCorsi = corsi!)

    // Inizializzazione form
    this.userFilter = new FormGroup({
      'ruolo': new FormControl('Tutti'),
      'nome': new FormControl(""),
      'cognome': new FormControl(""),
      'codiceFiscale': new FormControl("")
    })

    this.courseFilter = new FormGroup({
      'corso': new FormControl('Tutti'),
      'cup': new FormControl("")
    })

    this.userFilter.valueChanges.subscribe(value => {
      if( JSON.stringify({tipoUtente: "Tutti", nome: "", cognome: "", codiceFiscale: ""}) === JSON.stringify(value) &&
          JSON.stringify({corso: "Tutti", cup: ""}) === JSON.stringify(this.courseFilter.value))
        this.resetFilterButton?.enable(false)
      else
        this.resetFilterButton?.enable(true)
    })

    this.courseFilter.valueChanges.subscribe(value => {
      if( JSON.stringify({corso: "Tutti", cup: ""}) === JSON.stringify(value) && 
          JSON.stringify({tipoUtente: "Tutti", nome: "", cognome: "", codiceFiscale: ""}) === JSON.stringify(this.userFilter.value))
        this.resetFilterButton?.enable(false)
      else
        this.resetFilterButton?.enable(true)
    })
  }
  
  /**
   * Inizializza la tabella
   */
  ngAfterViewInit(): void {
     //Update table
     this.table!.size = this.users.length + 1
  }

  /**
   * Mapper tra i dati restituiti dal service e i dati da visualizzare in tabella
   * @param index Indice della riga nella tabella
   * @returns L'oggetto che compone la riga
   */
  userTableMapper: (row: number) => any = (index) => {
    if(this.users.length <= 0) return {loading: true}
    
    if(index === 0)
     return {nome:'Nome', cognome: 'Cognome', codiceFiscale:'Codice fiscale', ruolo: 'Ruolo', email: 'E-mail'}
    else 
      return this.users.at(index-1)
  }

  /**
   * Callback richiamato al click della checkbox
   * @param observable 
   * @param row 
   */
  onSelectedRow: (observable: {index: number, selected: boolean}, instance: Row) => any = (observable, row) => {
    
    if(observable.selected) {
      if(this.rowSelected) this.rowSelected.checkbox?.toggle()
      this.rowSelected = row as UserTableRowComponent
      this.removeButton?.enable(true)
      this.detailButton?.enable(true)
    }
    else if(observable.index === this.rowSelected?.index &&  !observable.selected) {
      this.rowSelected = undefined
      this.removeButton?.enable(false)
      this.detailButton?.enable(false)
    }
}

  /**
   * Callback per la rimozione di un utente
   */
  removeUser: () => void = () => {
    if(!this.rowSelected) return 
    console.log(`Rimozione utente ${this.users[this.rowSelected.index-1].nome}`)
  }

  /**
   * Callback per il dettaglio di un utente
   */
  detailUser: () => void = () => {
    if(!this.rowSelected) return 
    console.log(`Dettaglio utente ${this.users[this.rowSelected.index-1].nome}`)
  }

  /**
   * Risponde al cambio di parametri della paginazione
   * @param pagination 
   */
  handlePaginationChange(pagination: {page: number, size: number}){

    this.detailButton?.enable(false)
    this.removeButton?.enable(false)

    this.getUsers(pagination, () => {
      this.tableDOM!.nativeElement.style.marginTop = '8rem'
      this.tableDOM?.nativeElement.scrollIntoView()
    })
  }

  /**
   * Recupera gli utenti
   * @param pagination paginazione
   */
  getUsers(pagination: {page: number, size: number}, onEnd?: () => void){
    
    // Gestione delle form
    //console.log(this.userFilter.value)
    //console.log(this.courseFilter)

    // gestione filtro dati utente
    const filtri: UtenteDTO = this.userFilter.value
    if(filtri.ruolo && filtri.ruolo.toLowerCase() == 'tutti') filtri.ruolo = null
    Object.entries(filtri).forEach(([key, value], index, array) => {
      if(value == 'tutti' || value == "") filtri[key] = null 
    })
    if(filtri.ruolo) filtri.ruolo = filtri.ruolo?.toLocaleUpperCase()

    // gestione filtro corso
    let nomeCorso = <String | null> this.courseFilter.value.corso 
    nomeCorso = (nomeCorso == "" || nomeCorso?.toLocaleLowerCase() == 'tutti') ? null : nomeCorso
   
    // compongo la request
    const request: SearchUtenteRequest = {
      utente: filtri,
      nomeCorso: nomeCorso
    }
    console.log(request)

    this.userService.getUsersPaginated(pagination, request).then(response => {
      this.users = response!.users
      this.pages = response!.pagination.totalPages
      this.pageSize = response!.pagination.size
      this.tableDOM!.nativeElement.style.marginTop = '8rem'

      if(response!.execTime <= 500){
        setTimeout(() => {
          // Update table
          this.table!.size = this.users!.length + 1
  
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
        this.table!.size = this.users!.length + 1
  
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
    this.users = []
    this.hideTable = false
    this.hidePagination = true
    this.hideOperationButton = true
    this.table!.size = pagination.size + 1
  }

  /**
   * Cerca gli utenti con i criteri selezionati nella form
   */
  submitForms: () => void = () => {
   this.getUsers({page: 1, size: this.pageSize}, () =>{
     this.tableDOM!.nativeElement.style.marginTop = '8rem'
     this.tableDOM?.nativeElement.scrollIntoView({block: 'start', behavior: 'smooth'})
   })
  }

  /**
   * Reset filtri
   */
  resetFilter: () => void = () => {
    this.userFilter.reset({
      'tipoUtente': 'Tutti',
      'nome': "",
      'cognome': "",
      'codiceFiscale': ""
    })

    this.courseFilter.reset({
      'corso': 'Tutti',
      'cup': ""
    })
    this.resetFilterButton?.enable(false)
    console.log(this.userFilter.value)
    console.log(this.courseFilter.value)
  }

  /**
   * Ritorna la lista con i nomi di tutti i corsi
   * @returns 
   */
  getCorsi(): string[]{
    return this.nomeCorsi.map(c => c.nome)
  }


}


