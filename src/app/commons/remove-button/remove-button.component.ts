import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-remove-button',
  templateUrl: './remove-button.component.html',
  styleUrls: ['./remove-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoveButtonComponent {
  @Input() label : String = ""
  active: boolean = false
  @Input() onClick!: () => void

  constructor(private changeDetector: ChangeDetectorRef){}

  enable(active: boolean){
    this.active = active
    this.changeDetector.markForCheck()
  }  
}
