import { Component, OnInit } from '@angular/core';
declare function onRootChange(icon : string) : any;

@Component({
  selector: 'app-session-page-container',
  templateUrl: './session-page-container.component.html',
  styleUrls: ['./session-page-container.component.scss']
})
export class SessionPageContainerComponent implements OnInit {
  ngOnInit(): void {
    onRootChange('sessioni')
  }
}
