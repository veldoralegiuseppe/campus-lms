import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveButtonComponent } from './remove-button.component';

describe('RemoveButtonComponent', () => {
  let component: RemoveButtonComponent;
  let fixture: ComponentFixture<RemoveButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveButtonComponent]
    });
    fixture = TestBed.createComponent(RemoveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
