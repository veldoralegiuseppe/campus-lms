import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import { SessionDetailsService, SessioneDetailsResponse, UpdateEsitoRequest } from './session-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-details-session-page-container',
    templateUrl: './details-session-page-container.component.html',
    styleUrl: './details-session-page-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsSessionComponent extends AuthenticationComponent implements OnInit{

  progress: number | null = 10
  private _idSessione: number
  sessionDetails: SessioneDetailsResponse | null = null
  file: File | null = null
  esameConsegnato: boolean = false
  esitiMancanti: Map<number, string|null> = new Map()
  
  
  constructor(private _route: ActivatedRoute, private _service: SessionDetailsService, private _snackBar: MatSnackBar, private _changeDetector: ChangeDetectorRef){
    super()
    this._idSessione = Number(this._route.snapshot.paramMap.get('id'))
  }

  ngOnInit(): void {
    // inizializzo i dati
    this._service.getDetails(this._idSessione).subscribe(
      response => {

        this.sessionDetails = response
        console.log(this.sessionDetails)

        this.dataSource.data = response.esami.map(e => {

            // Inizializzo la map
            if(!e.esito) this.esitiMancanti.set(e.idStudente, e.esito)
            if(this.authInfo?.payload?.role == 'STUDENTE' && e.idFileStudente) this.esameConsegnato = true

            // Ritorno i node
            return <StudenteNode>{
              name: `${e.nomeStudente} ${e.cognomeStudente} - ${e.codiceFiscale}`,
              id: e.idStudente,
              esito: e.esito,
              nomeFile: e.nomeFileStudente,
              idFile: e.idFileStudente,
              contentType: e.contentType,
              children: [{name: "", nomeFile:e.nomeFileStudente, contentType: e.contentType, idFile: e.idFileStudente, id: e.idStudente}],
            }
        })

        this.progress = null
        this._changeDetector.detectChanges()
      }
    )
  }

  private _transformer = (node: StudenteNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      nomeFile: node.nomeFile,
      idFile: node.idFile,
      esito: node.esito,
      contentType: node.contentType,
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
    this.esitiMancanti.set(node.id, event.target.value)
    console.log(this.esitiMancanti)
  }

  createRangeVoto(min: number, max: number): any {
    let range: number[] = []
    for(let i=min; i<max; i++) range.push(i)
    return range
  }

  salvaStato(){
    const req: UpdateEsitoRequest[] = []

    this.esitiMancanti.forEach((esito, idStudente) => {
      console.log({idSessione: this._idSessione, idStudente: idStudente, esito: esito})
      req.push({idSessione: this._idSessione, idStudente: idStudente, esito: esito})
    })

    this.progress = 10
    this._service.updateEsiti(req).subscribe(
      (response) => {},
      (error) => {
        this.progress = null
        this.openSnackBar(error, "Chiudi")
      },
      () => {
        this._changeDetector.detectChanges()
        location.reload()
      }
    )

  }

  download(idFile: string, nomeFile: string, contentType: string) {
    console.log(`idFile:${idFile} contentType:${contentType}`)
    
    this._service.download(idFile).subscribe(file => {
      let a = window.document.createElement('a');
      const blob = new Blob([file!], { type: contentType });
      a.href = window.URL.createObjectURL(blob);
      a.download = nomeFile;
      document.body.appendChild(a);
      a.click();
      a.remove();
      //window.open(url);
    })
  }

  onFileUpload(file: File){
    this.file = file
  }

  onFileDelete(file: File){
    this.file = file
  }

  uploadEsame() {
    this.progress = 10
    this._service.uploadEsame(this._idSessione, this.file!).subscribe(
      () => {
        this.progress = null
        this.esameConsegnato = true 
        this.openSnackBar("Esame completato", "Chiudi")
        this._changeDetector.detectChanges()
      },
      (error) => {
        this.progress = null
        this.file = null 
        this.esameConsegnato = false
        this.openSnackBar(error, "Chiudi")
        this._changeDetector.detectChanges()
      }
    )
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface StudenteNode {
  name: string;
  id: number;
  nomeFile: string | null;
  idFile: string | null;
  contentType: string | null;
  esito: string | null;
  children?: StudenteNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  id: number;
  nomeFile: string|null;
  idFile: string | null;
  contentType: string | null;
  name: string;
  level: number;
  esito: string|null;
}
