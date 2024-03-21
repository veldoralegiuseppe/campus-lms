import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalHeaderComponent } from './horizontal-header.component';

describe('HorizontalHeaderComponent', () => {
  let component: HorizontalHeaderComponent;
  let fixture: ComponentFixture<HorizontalHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalHeaderComponent]
    });
    fixture = TestBed.createComponent(HorizontalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
