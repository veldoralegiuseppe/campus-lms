import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserContainerComponent } from './search-user-container.component';

describe('SearchUserContainerComponent', () => {
  let component: SearchUserContainerComponent;
  let fixture: ComponentFixture<SearchUserContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchUserContainerComponent]
    });
    fixture = TestBed.createComponent(SearchUserContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
