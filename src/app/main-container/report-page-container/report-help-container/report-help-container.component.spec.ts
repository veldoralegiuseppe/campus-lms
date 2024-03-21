import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHelpContainerComponent } from './report-help-container.component';

describe('ReportHelpContainerComponent', () => {
  let component: ReportHelpContainerComponent;
  let fixture: ComponentFixture<ReportHelpContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportHelpContainerComponent]
    });
    fixture = TestBed.createComponent(ReportHelpContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
