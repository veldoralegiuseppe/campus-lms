import { Component } from '@angular/core';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';

@Component({
  selector: '.app-welcome-container',
  templateUrl: './welcome-container.component.html',
  styleUrls: ['./welcome-container.component.scss']
})
export class WelcomeContainerComponent extends AuthenticationComponent {

}
