import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchButtonComponent {
  isOff = true
}
