import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss']
})
export class SearchButtonComponent {
  @Input() label : String = ""
  active: boolean = true
  @Input() onClick!: () => void

  constructor(private changeDetector: ChangeDetectorRef){}

  enable(active: boolean){
    this.active = active
    this.changeDetector.markForCheck()
  }  
}
