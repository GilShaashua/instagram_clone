import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPostModalComponent } from './send-post-modal.component';

describe('SendPostModalComponent', () => {
  let component: SendPostModalComponent;
  let fixture: ComponentFixture<SendPostModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendPostModalComponent]
    });
    fixture = TestBed.createComponent(SendPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
