import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRowTableComponent } from './course-row-table.component';

describe('CourseRowTableComponent', () => {
  let component: CourseRowTableComponent;
  let fixture: ComponentFixture<CourseRowTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseRowTableComponent]
    });
    fixture = TestBed.createComponent(CourseRowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
