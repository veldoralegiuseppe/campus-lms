import { Component, OnInit } from '@angular/core';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
declare function onRootChange(icon : string) : any;

@Component({
  selector: 'app-dashboard-page-container',
  templateUrl: './dashboard-page-container.component.html',
  styleUrls: ['./dashboard-page-container.component.scss']
})
export class DashboardPageContainerComponent extends AuthenticationComponent implements OnInit {
  ngOnInit(): void {
    onRootChange('dashboard')
  }

}
