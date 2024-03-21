import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTableRowComponent } from './activity-table-row.component';

describe('ActivityTableRowComponent', () => {
  let component: ActivityTableRowComponent;
  let fixture: ComponentFixture<ActivityTableRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityTableRowComponent]
    });
    fixture = TestBed.createComponent(ActivityTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
