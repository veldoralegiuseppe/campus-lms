import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';

@Component({
  selector: '.app-help-container',
  templateUrl: './help-container.component.html',
  styleUrls: ['./help-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpContainerComponent extends AuthenticationComponent {

}
