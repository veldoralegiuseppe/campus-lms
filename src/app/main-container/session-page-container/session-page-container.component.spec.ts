import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPageContainerComponent } from './session-page-container.component';

describe('SessionPageContainerComponent', () => {
  let component: SessionPageContainerComponent;
  let fixture: ComponentFixture<SessionPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionPageContainerComponent]
    });
    fixture = TestBed.createComponent(SessionPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
