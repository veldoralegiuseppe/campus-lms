import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSessionPageContainerComponent } from './details-session-page-container.component';

describe('DetailsSessionPageContainerComponent', () => {
  let component: DetailsSessionPageContainerComponent;
  let fixture: ComponentFixture<DetailsSessionPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsSessionPageContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsSessionPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
