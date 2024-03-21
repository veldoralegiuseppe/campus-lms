import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetFilterButtonComponent } from './reset-filter-button.component';

describe('ResetFilterButtonComponent', () => {
  let component: ResetFilterButtonComponent;
  let fixture: ComponentFixture<ResetFilterButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetFilterButtonComponent]
    });
    fixture = TestBed.createComponent(ResetFilterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
