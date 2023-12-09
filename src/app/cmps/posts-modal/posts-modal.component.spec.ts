import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsModalComponent } from './posts-modal.component';

describe('PostsModalComponent', () => {
  let component: PostsModalComponent;
  let fixture: ComponentFixture<PostsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostsModalComponent]
    });
    fixture = TestBed.createComponent(PostsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
