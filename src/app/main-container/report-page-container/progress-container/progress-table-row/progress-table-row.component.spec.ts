import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTableRowComponent } from './progress-table-row.component';

describe('ProgressTableRowComponent', () => {
  let component: ProgressTableRowComponent;
  let fixture: ComponentFixture<ProgressTableRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressTableRowComponent]
    });
    fixture = TestBed.createComponent(ProgressTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
