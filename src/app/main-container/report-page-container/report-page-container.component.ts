import { Component, OnInit } from '@angular/core';
declare function onRootChange(icon : string) : any;

@Component({
  selector: 'app-report-page-container',
  templateUrl: './report-page-container.component.html',
  styleUrls: ['./report-page-container.component.scss']
})
export class ReportPageContainerComponent implements OnInit{
  ngOnInit(): void {
    onRootChange('report')
  }
}
