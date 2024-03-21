import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, Renderer2, SimpleChanges, Type, ViewChildren } from '@angular/core';
import { AnchorComponent } from '../anchor/anchor.component';
import { AnchorDirective } from '../directives/anchor.directive';
import { Column } from './table-column';

@Component({
  selector: '.app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, AfterViewChecked {

  /**
   * Tabella
   */
  @Input() table : Column[][] = [];

  /**
   * Numero delle colonne della tabella
   */
  private numberOfColumns : number = 0

  /**
   * Template dell'header della tabella [nome-colonna, fr,...]
   */
  @Input() headerTemplate : string[] = [];

  /**
   * Layout generale della tabella
   */
  tableLayout: { [klass: string]: any; }|null|undefined;

  /**
   * Riferimenti agli elementi HTMl della tabella
   */
  @ViewChildren("item") items?: QueryList<ElementRef>

  /**
   * Metodo di callback che viene richiamato al trigger dell'evento specificato
   */
  @Input() callback?: (event: any) => void;

  /**
   * Metodo di callback richiamato per filtrare gli elementi della tabella
   */
  @Input() filter?: (value: ElementRef<any>,index: number,array: readonly ElementRef<any>[]) => any|undefined;

  /**
   * Nome dell'evento da ascoltare
   */
  @Input() eventToObserve?: string

  /**
   * Unlistener per dissociare gli eventi
   */
  private unlisteners: (() => void)[] = [];

  /**
   * Riferimento agli elementi HTML iniettati
   */
  private parents : Array<HTMLElement> = [];

  /**
   * Riferimento all'ng-template in cui iniettare il componente
   */
  @ViewChildren(AnchorDirective) anchors!: QueryList<AnchorDirective>
  

  /**
   * Riferimeto ai componenti da iniettare nel template
   */
  private components: {type: Type<AnchorComponent>, anchorIndex: number, data: any}[] = [];

  firstTime = true

  constructor(private renderer: Renderer2, private changeDetector: ChangeDetectorRef){}

  ngAfterViewChecked(): void {
    this.loadComponent()
    this.firstTime = false
  }


  ngOnDestroy(): void {
    console.log('onDestroy')
    this.unlisteners.forEach(unlinstener => unlinstener()) 
    
  }


  ngAfterViewInit(): void {
    console.log('table after view init')
    if(this.eventToObserve) this.addEvent()
    
  }

  /**
   * Aggiunge un EventListner agli opportuni elementi della tabella O(n)
   */
  private addEvent(){
    console.log('add avent')
    this.items?.forEach((elem,index,array) => {
      let currentElem = this.filter ? this.filter(elem, index, array) : elem
      if(currentElem){
        console.log(currentElem)
        this.unlisteners.push( this.renderer.listen(currentElem.nativeElement, this.eventToObserve!, (event) => {if(this.callback) this.callback(event)} ))
      }
    })
  }

  ngOnInit(): void {
    if(this.headerTemplate){
      this.changeDetector.markForCheck()
      this.tableLayout = {
        'display' : 'grid',
        'grid-template-table': '[table-start] 1fr [table-end]',
        'grid-template-columns' : this.generateTemplateColumns(),
        'grid-auto-flow' : 'row'
      }
    }

    this.numberOfColumns = this.table.length > 0 ? this.table[0].length : 0
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('OnChanges')
    this.numberOfColumns = this.table.length > 0 ? this.table[0].length : 0

    for (const propName in changes){
      if(this.table.length > 0 && this.table.map(r => r.length).every((element, index, array) => element === this.headerTemplate.length && element === array[0]))
        throw new Error('Il numero di colonne del body è diverso dal numero di colonne specificato nell\'intestazione')

      if(propName === Object.keys({o: this.headerTemplate})[0]){
        this.tableLayout = {
          'display' : 'grid',
          'grid-template-table': '[table-start] 1fr [table-end]',
          'grid-template-columns' : this.generateTemplateColumns(),
          'grid-auto-flow' : 'row'
        }
      }
    }
  }

  /**
   * Genera il template per le colonne per il grid container
   * @returns string - Css column template
   */
  generateTemplateColumns() : string{
    let columnTemplate = "";
    let headerLenght = this.headerTemplate.length;

    for(let i=0; i<headerLenght; i++){
      columnTemplate += i%2 === 0 
        ? "[" + (i>0 && i<=headerLenght-2 ? this.headerTemplate.at(i)?.toLocaleLowerCase()+"-start " + this.headerTemplate.at(i-2)?.toLocaleLowerCase() + "-end" : (i == 0 ? this.headerTemplate.at(i)?.toLocaleLowerCase()+"-start" : this.headerTemplate.at(i)?.toLocaleLowerCase()+"-end")) + (i === headerLenght-2 ? "]" : "] ")
        : i===headerLenght-1 ? " "+this.headerTemplate.at(i)?.toLocaleLowerCase() + " ["+this.headerTemplate.at(i-1)?.toLocaleLowerCase()+"-end"+"]" : this.headerTemplate.at(i)?.toLocaleLowerCase() + " ";
    }
    console.log(columnTemplate)
    return columnTemplate;
  }

  /**
   * Stile della colonna
   * @param column - Colonna
   * @returns 
   */
  getColumnStyle(column: Column): { [klass: string]: any; }|null|undefined {
    if(column.style){
      column.style['grid-column'] = column.headerColumn.toLocaleLowerCase() +'-start/' + column.headerColumn.toLocaleLowerCase()+'-end'
      return column.style
    }

    return {
      'grid-column': column.headerColumn.toLocaleLowerCase() +'-start/' + column.headerColumn.toLocaleLowerCase()+'-end',
    }
  }
  
  /**
   * Aggiunge un child al parent specificato
   */
  injectHTML(parent: HTMLElement, row: number, col: number, callback: (parent: HTMLElement, row: number, col:number) => any|undefined) : void{
    let element = callback(parent, row, col)
    if(!element) return
    this.renderer.appendChild(parent, element)
    this.parents.push(parent)
  }

  /**
   * Carica i componenti specificati nel template
   */
  loadComponent(){
    console.log('loadComponent')
    this.anchors.changes.subscribe((value) => console.log('anchor change'))
    this.components.forEach(c => {
      const viewContainerRef = this.anchors.get(c.anchorIndex)!.viewContainerRef
      viewContainerRef.clear()

      const componentRef = viewContainerRef.createComponent<AnchorComponent>(c.type)
      componentRef.instance.data = c.data
      componentRef.changeDetectorRef.markForCheck()
    })
  }

  /**
   * Aggiunge un componente tra quelli da renderizzare
   * @param componentRef 
   */
  addComponent(componentRef: {type: Type<AnchorComponent>, data: any}, row: number, col: number){  
    console.log('addComponent')
    if(!this.firstTime) return
    this.components?.push({type: componentRef.type, data: componentRef.data, anchorIndex: row*this.numberOfColumns + col})
  }
}
