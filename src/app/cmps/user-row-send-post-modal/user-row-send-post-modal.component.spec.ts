import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRowSendPostModalComponent } from './user-row-send-post-modal.component';

describe('UserRowSendPostModalComponent', () => {
  let component: UserRowSendPostModalComponent;
  let fixture: ComponentFixture<UserRowSendPostModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRowSendPostModalComponent]
    });
    fixture = TestBed.createComponent(UserRowSendPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
