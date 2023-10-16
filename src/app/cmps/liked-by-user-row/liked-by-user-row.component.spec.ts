import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedByUserRowComponent } from './liked-by-user-row.component';

describe('LikedByUserRowComponent', () => {
  let component: LikedByUserRowComponent;
  let fixture: ComponentFixture<LikedByUserRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LikedByUserRowComponent]
    });
    fixture = TestBed.createComponent(LikedByUserRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
