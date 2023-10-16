import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedByUsersListComponent } from './liked-by-users-list.component';

describe('LikedByUsersListComponent', () => {
  let component: LikedByUsersListComponent;
  let fixture: ComponentFixture<LikedByUsersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LikedByUsersListComponent]
    });
    fixture = TestBed.createComponent(LikedByUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
