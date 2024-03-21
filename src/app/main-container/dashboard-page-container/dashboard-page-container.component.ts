import { Component, OnInit } from '@angular/core';
declare function onRootChange(icon : string) : any;

@Component({
  selector: 'app-dashboard-page-container',
  templateUrl: './dashboard-page-container.component.html',
  styleUrls: ['./dashboard-page-container.component.scss']
})
export class DashboardPageContainerComponent implements OnInit {
  ngOnInit(): void {
    onRootChange('dashboard')
  }

}
