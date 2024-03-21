import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, QueryList, Type, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnchorDirective } from '../directives/anchor.directive';
import { Row } from './Row';

@Component({
  selector: '.app-table-v2',
  templateUrl: './table-v2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableV2Component implements AfterViewInit, OnInit, OnDestroy{
  
  /**
   * Tipo della riga della tabella
   */
  @Input() rowType?: Type<Row>

  /**
   * Specifica il template della tabella
   */
  @Input() columnsTemplate?: string[]

  /**
   * Numero di righe della tabella
   */
  private _size: Number = 1;
 
  /**
   * Riferimenti agli ng-template
   */
  @ViewChildren(AnchorDirective) private anchors?: QueryList<AnchorDirective>

  /**
   * Numero di componenti creati
   */
  private componentiAncorati: number = 0

  /**
   * Riferimento alla subscription degli anchors
   */
  private componentSubscription?: Subscription

  /**
   * Callback per definire la riga
   */
  @Input() modelTableMapper?: (row: number) => any

  /**
   * Istanze dei componenti attualmente renderizzate
   */
  instances: Row[] = []

  /**
   * Riferimento al metodo di gestione dell' evento lanciato dalle istanze dei componenti
   */
  @Input() onEvent?: (observable: any, instance: Row) => any

  constructor(private changeDetector: ChangeDetectorRef){}
  
  /**
   * Inizializza gli observer agli anchor
   */
  ngOnInit(): void {
    this.componentSubscription = this.anchors?.changes.subscribe({
                                          next: (AnchorDirective) => this.changeDetector.markForCheck(),
                                          error: (error: any) => console.log(error),
                                          complete: () => console.log('component stream completed')
                                        })
  }

  /**
   * Inizializza la view
   */
  ngAfterViewInit(): void {
   this.loadComponents()
  }

  /**
   * Alla distruzione della view disinscrive gli observer degli Anchor
   */
  ngOnDestroy(): void {
    if(this.componentSubscription)
      this.componentSubscription.unsubscribe()
  }

  /**
   * Gestisce il layout della tabella
   */
  layout(): { [klass: string]: any; }|null|undefined {
   return {
      'display' : 'grid',
      'grid-template-rows': '[table-start] 1fr [table-end]',
      'grid-auto-flow' : 'row',
      'grid-template-columns': this.generateTemplateColumns()
   }
  }

  /**
   * Calcola il layout delle colonne
   * @returns {string} grid-template-columns
   */
  private generateTemplateColumns() : string {
    if(!this.columnsTemplate) throw Error('Il template della tabella non è stato definito')

    let columnTemplate = "";
    let headerLenght = this.columnsTemplate.length
  
    for(let i=0; i<headerLenght; i++){
      columnTemplate += i%2 === 0 
        ? "[" + (i>0 && i<=headerLenght-2 ? this.columnsTemplate.at(i)?.toLocaleLowerCase()+"-start " + this.columnsTemplate.at(i-2)?.toLocaleLowerCase() + "-end" : (i == 0 ? this.columnsTemplate.at(i)?.toLocaleLowerCase()+"-start" : this.columnsTemplate.at(i)?.toLocaleLowerCase()+"-end")) + (i === headerLenght-2 ? "]" : "] ")
        : i===headerLenght-1 ? " "+this.columnsTemplate.at(i)?.toLocaleLowerCase() + " ["+this.columnsTemplate.at(i-1)?.toLocaleLowerCase()+"-end"+"]" : this.columnsTemplate.at(i)?.toLocaleLowerCase() + " ";
    }
    
    //console.log(columnTemplate)
    return columnTemplate;
  }

  /**
   * Caricamento dei componenti
   */
  loadComponents(){
    this.componentiAncorati = 0
   
    this.anchors?.forEach(anchor => {
      anchor.viewContainerRef.clear()
      const instance = anchor.viewContainerRef.createComponent(this.rowType!).instance
      instance.index = this.componentiAncorati
      if(instance.generateRow) instance.generateRow(this.modelTableMapper!(this.componentiAncorati++))
      instance.onEvent = (observable) => { this.onEvent!(observable, instance) }
    })

    this.updateTable()
  }

  /**
   * Refresh della view
   */
  private updateTable(){
    this.changeDetector.detectChanges()
  }

  /**
   * Getter 
   */
  public get size(): Number {
    return this._size;
  }

  /**
   * Setta la property e aggiorna la view
   */
  public set size(value: Number) {
    this._size = value;
    this.updateTable()
    this.loadComponents()
  }
}

