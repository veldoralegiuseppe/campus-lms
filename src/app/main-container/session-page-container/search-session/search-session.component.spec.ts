import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSessionComponent } from './search-session.component';

describe('SearchSessionComponent', () => {
  let component: SearchSessionComponent;
  let fixture: ComponentFixture<SearchSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchSessionComponent]
    });
    fixture = TestBed.createComponent(SearchSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
