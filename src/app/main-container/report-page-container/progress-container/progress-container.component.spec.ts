import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressContainerComponent } from './progress-container.component';

describe('ProgressContainerComponent', () => {
  let component: ProgressContainerComponent;
  let fixture: ComponentFixture<ProgressContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressContainerComponent]
    });
    fixture = TestBed.createComponent(ProgressContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
