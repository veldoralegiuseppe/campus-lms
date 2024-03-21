import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPageContainerComponent } from './users-page-container.component';

describe('UsersPageContainerComponent', () => {
  let component: UsersPageContainerComponent;
  let fixture: ComponentFixture<UsersPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersPageContainerComponent]
    });
    fixture = TestBed.createComponent(UsersPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
