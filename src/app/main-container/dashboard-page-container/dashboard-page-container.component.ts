import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';
import { CourseContainerComponent } from './course-container/course-container.component';
declare function onRootChange(icon : string) : any;

@Component({
  selector: 'app-dashboard-page-container',
  templateUrl: './dashboard-page-container.component.html',
  styleUrls: ['./dashboard-page-container.component.scss']
})
export class DashboardPageContainerComponent extends AuthenticationComponent implements OnInit {
  
  @ViewChild(CourseContainerComponent) private courseTableComponent?: CourseContainerComponent
  
  ngOnInit(): void {
    onRootChange('dashboard')
  }

  refresh(){
    this.courseTableComponent?.refresh()
  }

}
