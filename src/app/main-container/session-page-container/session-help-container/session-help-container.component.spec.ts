import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHelpContainerComponent } from './session-help-container.component';

describe('SessionHelpContainerComponent', () => {
  let component: SessionHelpContainerComponent;
  let fixture: ComponentFixture<SessionHelpContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionHelpContainerComponent]
    });
    fixture = TestBed.createComponent(SessionHelpContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
