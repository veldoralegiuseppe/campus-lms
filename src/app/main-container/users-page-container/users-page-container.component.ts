import { Component, OnInit } from '@angular/core';
declare function onRootChange(icon : string) : any;

@Component({
  selector: 'app-users-page-container',
  templateUrl: './users-page-container.component.html',
  styleUrls: ['./users-page-container.component.scss']
})
export class UsersPageContainerComponent implements OnInit {
  ngOnInit(): void {
    onRootChange('utenti')
  }
}
