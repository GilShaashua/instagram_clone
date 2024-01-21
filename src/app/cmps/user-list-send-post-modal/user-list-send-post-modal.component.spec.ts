import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListSendPostModalComponent } from './user-list-send-post-modal.component';

describe('UserListSendPostModalComponent', () => {
  let component: UserListSendPostModalComponent;
  let fixture: ComponentFixture<UserListSendPostModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListSendPostModalComponent]
    });
    fixture = TestBed.createComponent(UserListSendPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
