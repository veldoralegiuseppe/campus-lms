import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-reset-filter-button',
  templateUrl: './reset-filter-button.component.html',
  styleUrls: ['./reset-filter-button.component.scss']
})
export class ResetFilterButtonComponent {
  @Input() label : String = ""
  active: boolean = false
  @Input() onClick!: () => void

  constructor(private changeDetector: ChangeDetectorRef){}

  enable(active: boolean){
    this.active = active
    this.changeDetector.markForCheck()
  }  
}
