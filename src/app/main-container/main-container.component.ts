import { Component } from '@angular/core';

import { AuthenticationComponent } from '../commons/authentication/authentication.component';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent extends AuthenticationComponent{

}
