import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxV2Component } from './checkbox-v2.component';

describe('CheckboxV2Component', () => {
  let component: CheckboxV2Component;
  let fixture: ComponentFixture<CheckboxV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxV2Component]
    });
    fixture = TestBed.createComponent(CheckboxV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
