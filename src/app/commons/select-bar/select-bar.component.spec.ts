import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBarComponent } from './select-bar.component';

describe('SelectBarComponent', () => {
  let component: SelectBarComponent;
  let fixture: ComponentFixture<SelectBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectBarComponent]
    });
    fixture = TestBed.createComponent(SelectBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
