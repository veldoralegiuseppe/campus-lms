import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageContainerComponent } from './dashboard-page-container.component';

describe('DashboardPageContainerComponent', () => {
  let component: DashboardPageContainerComponent;
  let fixture: ComponentFixture<DashboardPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPageContainerComponent]
    });
    fixture = TestBed.createComponent(DashboardPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
