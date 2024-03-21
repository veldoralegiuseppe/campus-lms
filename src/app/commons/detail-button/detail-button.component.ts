import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-button',
  templateUrl: './detail-button.component.html',
  styleUrls: ['./detail-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailButtonComponent {
  @Input() label : String = ""
  active: boolean = false
  @Input() onClick!: () => void

  constructor(private changeDetector: ChangeDetectorRef){}

  enable(active: boolean){
    this.active = active
    this.changeDetector.markForCheck()
  }
}
