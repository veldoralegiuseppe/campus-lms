import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Row } from 'src/app/commons/table-v2/Row';
import { Session } from '../Session';

@Component({
  selector: 'app-session-table-row',
  templateUrl: './session-table-row.component.html',
  styleUrls: ['./session-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionTableRowComponent implements Row {
  index!: number;
  isSelected: boolean = false
  session?: Session
  loading: boolean = false

  generateRow: (data: any) => any = (data: {session: Session, loading: boolean}) => {
    this.session = data.session
    this.loading = data.loading
  }
  
  onEvent?: (observable: any) => any
}
