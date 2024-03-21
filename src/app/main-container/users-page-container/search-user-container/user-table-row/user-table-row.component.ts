import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CheckboxV2Component } from 'src/app/commons/checkbox-v2/checkbox-v2.component';
import { Row } from 'src/app/commons/table-v2/Row';

@Component({
  selector: '.app-user-table-row',
  templateUrl: './user-table-row.component.html',
  styleUrls: ['./user-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableRowComponent implements Row{

  /**
   * Indica se la riga è stata selezionata dall'utente nell'UI
   */
  isSelected = false

  /**
   * Indice della riga
   */
  index!: number;

  /**
   * Model della riga
   */
  user? : {nome: string, cognome: string, corso: string, sessione: string, classe: string, email: string, selector: any, loading: boolean}
  
  /**
   * Riferimento alla checkbox
   */
  @ViewChild(CheckboxV2Component) checkbox? : CheckboxV2Component
  
  /**
   * Callback per gestire la selezione della riga
   */
  onEvent!: (observable: any) => any;

  /**
   * Logica di popolamento del model
   * @param user 
   */
  generateRow: (data: any) => any = (user: any) => { this.user = user}
  
  /**
   * Callback triggerato al click della checkbox
   */
  onChecked() {
     this.isSelected = !this.isSelected 
     this.onEvent({index: this.index, selected: this.isSelected})
  }
 
  
}
