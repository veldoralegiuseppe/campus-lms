import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDropdownBarComponent } from './search-dropdown-bar.component';

describe('SearchDropdownBarComponent', () => {
  let component: SearchDropdownBarComponent;
  let fixture: ComponentFixture<SearchDropdownBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchDropdownBarComponent]
    });
    fixture = TestBed.createComponent(SearchDropdownBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
