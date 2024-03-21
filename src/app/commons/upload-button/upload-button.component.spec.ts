import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadButtonComponent } from './upload-button.component';

describe('UploadButtonComponent', () => {
  let component: UploadButtonComponent;
  let fixture: ComponentFixture<UploadButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadButtonComponent]
    });
    fixture = TestBed.createComponent(UploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
