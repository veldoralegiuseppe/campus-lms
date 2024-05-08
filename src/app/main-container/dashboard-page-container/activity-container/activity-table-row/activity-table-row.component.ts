import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Activity } from './Activity';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';

@Component({
  selector: 'app-activity-table-row',
  templateUrl: './activity-table-row.component.html',
  styleUrls: ['./activity-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTableRowComponent extends AuthenticationComponent {

  /**
   * Indice della riga
   */
  index!: number;

  /**
   * Toggle animazione caricamento dati
   */
  loading: boolean = false;

  /**
   * Model della riga
   */
  activity? : Activity

  /**
   * Flag ultima riga della tabella
   */
  isLastRow?: boolean
  
  /**
   * Logica di popolamento del model
   * @param data Attività
   */
  generateRow: (data: any) => any = (data: {activity: Activity, loading: boolean, isLastRow?: boolean}) => { 
    this.activity = data.activity
    this.loading = data.loading
    this.isLastRow = data.isLastRow
  }

}
