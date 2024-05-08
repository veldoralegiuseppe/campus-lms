import { Component, OnInit } from '@angular/core';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
declare function onRootChange(icon : string) : any;

@Component({
  selector: 'app-users-page-container',
  templateUrl: './users-page-container.component.html',
  styleUrls: ['./users-page-container.component.scss']
})
export class UsersPageContainerComponent extends AuthenticationComponent implements OnInit {
  ngOnInit(): void {
    onRootChange('utenti')
  }
}
