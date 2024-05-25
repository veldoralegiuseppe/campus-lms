import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import { SessionDetailsService, SessioneDetailsResponse } from './session-details.service';

@Component({
    selector: 'app-details-session-page-container',
    templateUrl: './details-session-page-container.component.html',
    styleUrl: './details-session-page-container.component.scss',
})
export class DetailsSessionComponent extends AuthenticationComponent implements OnInit{

  progress: number | null = null
  private _idSessione: number
  sessionDetails: SessioneDetailsResponse | null = null
  
  constructor(private _route: ActivatedRoute, private _service: SessionDetailsService){
    super()
    this._idSessione = Number(this._route.snapshot.paramMap.get('id'))
    //this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    // inizializzo l'albero
    this._service.getDetails(this._idSessione).subscribe(
      response => {
        this.sessionDetails = response
        this.dataSource.data = response.esami.map(e => {
            return <StudenteNode>{
              name: `${e.nomeStudente} ${e.cognomeStudente} - ${e.codiceFiscale}`,
              id: e.idStudente,
              children: [{name: "", file:`${e.nomeFileStudente}`, id: e.idStudente}],
            }
        })
    }, 

    (error) =>{}, 

    () =>{}
  )

  }

  private _transformer = (node: StudenteNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  onInserimentoVoto(event: any, node: any ) {
    console.log(`node: ${JSON.stringify(node)}, voto: ${event.target.value}`)
  }

  createRangeVoto(min: number, max: number): any {
    let range: number[] = []
    for(let i=min; i<max; i++) range.push(i)
    return range
  }
}

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface StudenteNode {
  name: string;
  id: number;
  file: string | null;
  children?: StudenteNode[];
}

// const TREE_DATA: StudenteNode[] = [
//   {
//     name: 'Mario Rossi',
//     children: [{name: 'Prova scritta'}],
//   },
// ];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  id: number;
  name: string;
  level: number;
}
