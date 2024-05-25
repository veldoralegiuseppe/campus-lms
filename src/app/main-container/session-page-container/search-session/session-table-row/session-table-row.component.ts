import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Row } from 'src/app/commons/table-v2/Row';
import { Session } from '../Session';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import { CheckboxV2Component } from 'src/app/commons/checkbox-v2/checkbox-v2.component';

@Component({
  selector: 'app-session-table-row',
  templateUrl: './session-table-row.component.html',
  styleUrls: ['./session-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionTableRowComponent extends AuthenticationComponent implements Row {
  index!: number;
  isSelected: boolean = false
  session?: Session
  loading: boolean = false
  @ViewChild(CheckboxV2Component) private checkbox!: CheckboxV2Component;

  constructor(private _changeDetector: ChangeDetectorRef){
    super()
  }

  generateRow: (data: any) => any = (data: {session: Session, loading: boolean}) => {
    this.session = data.session
    this.loading = data.loading
  }
  
  onEvent!: (observable: any) => any

  onChecked() {
    this.isSelected = !this.isSelected 
    console.log(`Riga ${this.index} - isSelected: ${this.isSelected}`)
    this._changeDetector.detectChanges()
    this.onEvent({index: this.index, selected: this.isSelected})
  }

  toggle(){
    this.checkbox.toggle()
  }
}
