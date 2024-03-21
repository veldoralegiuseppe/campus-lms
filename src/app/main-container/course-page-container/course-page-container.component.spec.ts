import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePageContainerComponent } from './course-page-container.component';

describe('CoursePageContainerComponent', () => {
  let component: CoursePageContainerComponent;
  let fixture: ComponentFixture<CoursePageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursePageContainerComponent]
    });
    fixture = TestBed.createComponent(CoursePageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
