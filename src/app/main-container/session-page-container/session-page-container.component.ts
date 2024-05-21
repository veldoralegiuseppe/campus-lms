import { Component, OnInit } from '@angular/core';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
declare function onRootChange(icon : string) : any;

@Component({
  selector: 'app-session-page-container',
  templateUrl: './session-page-container.component.html',
  styleUrls: ['./session-page-container.component.scss']
})
export class SessionPageContainerComponent extends AuthenticationComponent implements OnInit {
  ngOnInit(): void {
    onRootChange('sessioni')
  }
}
