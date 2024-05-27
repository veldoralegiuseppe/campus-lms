import { Component } from '@angular/core';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: '.app-horizontal-header',
  templateUrl: './horizontal-header.component.html',
  styleUrls: ['./horizontal-header.component.scss']
})
export class HorizontalHeaderComponent extends AuthenticationComponent {

  constructor(private _service: AuthService){
    super()
  }

  logout() {
    this._service.logout()
  }

}
