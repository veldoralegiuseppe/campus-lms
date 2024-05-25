import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';

@Component({
    selector: 'app-details-session-page-container',
    templateUrl: './details-session-page-container.component.html',
    styleUrl: './details-session-page-container.component.scss',
})
export class DetailsSessionComponent extends AuthenticationComponent implements OnInit{

  progress: number | null = null
  private _idSessione: number
  
  constructor(private _route: ActivatedRoute){
    super()
    this._idSessione = Number(this._route.snapshot.paramMap.get('id'))
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    // inizializzo l'albero
    
  }

  private _transformer = (node: StudenteNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
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

}

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface StudenteNode {
  name: string;
  children?: StudenteNode[];
}

const TREE_DATA: StudenteNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}