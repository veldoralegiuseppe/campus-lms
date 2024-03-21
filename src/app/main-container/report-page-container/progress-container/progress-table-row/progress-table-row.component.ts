import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CheckboxV2Component } from 'src/app/commons/checkbox-v2/checkbox-v2.component';
import { Row } from 'src/app/commons/table-v2/Row';
import { Progress } from '../Progress';

@Component({
  selector: 'app-progress-table-row',
  templateUrl: './progress-table-row.component.html',
  styleUrls: ['./progress-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressTableRowComponent implements Row{

  index!: number;
  isSelected: boolean = false
  progress?: Progress
  loading: boolean = false
  @ViewChild(CheckboxV2Component) checkbox? : CheckboxV2Component
  
  generateRow: (data: any) => any = (data: {progress: Progress, loading: boolean}) => {
    this.progress = data.progress
    this.loading = data.loading
  }
  
  onEvent!: (observable: any) => any

  onChecked() {
    this.isSelected = !this.isSelected 
    this.onEvent({index: this.index, selected: this.isSelected})
  }
  
}
