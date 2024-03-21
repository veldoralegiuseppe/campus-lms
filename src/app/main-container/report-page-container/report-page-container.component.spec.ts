import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPageContainerComponent } from './report-page-container.component';

describe('ReportPageContainerComponent', () => {
  let component: ReportPageContainerComponent;
  let fixture: ComponentFixture<ReportPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportPageContainerComponent]
    });
    fixture = TestBed.createComponent(ReportPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
