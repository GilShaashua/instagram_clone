import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyFormComponent } from './reply-form.component';

describe('ReplyFormComponent', () => {
  let component: ReplyFormComponent;
  let fixture: ComponentFixture<ReplyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReplyFormComponent]
    });
    fixture = TestBed.createComponent(ReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
