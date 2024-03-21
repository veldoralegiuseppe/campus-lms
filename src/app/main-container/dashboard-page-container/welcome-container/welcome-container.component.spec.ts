import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeContainerComponent } from './welcome-container.component';

describe('WelcomeContainerComponent', () => {
  let component: WelcomeContainerComponent;
  let fixture: ComponentFixture<WelcomeContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeContainerComponent]
    });
    fixture = TestBed.createComponent(WelcomeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
