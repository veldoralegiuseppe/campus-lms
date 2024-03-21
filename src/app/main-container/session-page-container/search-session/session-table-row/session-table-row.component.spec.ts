import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTableRowComponent } from './session-table-row.component';

describe('SessionTableRowComponent', () => {
  let component: SessionTableRowComponent;
  let fixture: ComponentFixture<SessionTableRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionTableRowComponent]
    });
    fixture = TestBed.createComponent(SessionTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
