import { state, style, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { Row } from 'src/app/commons/table-v2/Row';
import { Course } from './Course';
import { CourseRowTableComponent } from './course-row-table/course-row-table.component';
import { CourseService } from './course.service';
import { TableV2Component } from 'src/app/commons/table-v2/table-v2.component';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';

@Component({
  selector: '.app-course-container',
  templateUrl: './course-container.component.html',
  styleUrls: ['./course-container.component.scss'],
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
export class CourseContainerComponent extends AuthenticationComponent implements OnInit, AfterViewInit{

  /**
   * Model 
   */
  private courses : Course[] = []

  /**
   * Tipo della riga della tabella
   */
  rowType: Type<Row> = CourseRowTableComponent

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
    * Toggle del componente della tabella
    */
   hideTable: boolean = false

   /**
    * Form
    */
   courseFilter!: FormGroup

   /**
    * Current user role
    */
   private role: String = ""

   /**
    * Table header
    */
   private header : Course = {}

  constructor(private courseService : CourseService){
    super();
  }

  ngAfterViewInit(): void {
    this.getCoursesPaginated({page: this.pages, size: this.pageSize})
  }
  
  ngOnInit(): void {
    // Recupero il ruolo dell'utente corrente
    this.role = this.authInfo!.payload!.role.toString()

    // Inizializzazione elementi condizionali
    if(this.role == "STUDENTE"){
      this.header = {studenteCourse: {moduli: 'Moduli', corso: 'Corso', sessioni: 'Sessioni'}}
    }
    else if(this.role == "DOCENTE"){
      this.header = {docenteCourse: {studenti: 'Studenti', corso: 'Corso', sessioni: 'Sessioni'}}
    }
    else if(this.role == "ADMIN"){
      this.header = {adminCourse: {studenti: 'Studenti', corso: 'Corso', sessioni: 'Sessioni'}}
    }

    // Inizializzazione form
    this.courseFilter = new FormGroup({
      'like': new FormControl(""),
    })

    this.courseFilter.valueChanges.subscribe(value => console.log(value))
  }

  /**
   * Recupera i corsi in maniera paginata
   * @param pagination Paginazione
   * @param onEnd Callbak
   */
  private getCoursesPaginated(pagination: {page: number, size: number}, onEnd?: () => void){
    
    this.tableDOM!.nativeElement.style.marginTop = '2rem'

    this.courseService.getCoursesPaginated(pagination).then(response => {
      
      this.courses = response.courses
      this.pages = response.pagination.totalPages
      this.pageSize = response.pagination.size
      
      if(response.execTime <= 500){
        setTimeout(() => {
          // Update table
          this.table!.size = this.courses!.length + 1
          this.tableDOM!.nativeElement.style.marginTop = '1rem'
          this.hideTable = false
  
          //onEnd
          if(onEnd) onEnd()
        }, 500 - response.execTime)
      }
      else {
        // Update table
        this.table!.size = this.courses!.length + 1
        this.tableDOM!.nativeElement.style.marginTop = '4rem'
        this.hideTable = false

        //onEnd
        if(onEnd) onEnd()
      }
    })

     // CODICE ASINCRONO: Gestione animazione
     this.courses = []
     this.hideTable = false
     this.table!.size = pagination.size + 1
  }

  /**
   * Mapper tra i dati restituiti dal service e i dati da visualizzare in tabella
   * @param index Indice della riga nella tabella
   * @returns L'oggetto che compone la riga
   */
  courseTableMapper: ((row: number) => any) = (index) : {course?: Course, loading?: boolean} => {
    if(this.courses.length <= 0) return {loading: true}
    
    if(index === 0)
     return { course: this.header, loading: false}
    else 
      return {course: this.courses.at(index-1), loading: false}
  }
  
}
