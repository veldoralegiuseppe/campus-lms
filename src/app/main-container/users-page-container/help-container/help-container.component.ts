import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '.app-help-container',
  templateUrl: './help-container.component.html',
  styleUrls: ['./help-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpContainerComponent {

}
