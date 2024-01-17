import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChatComponent } from './add-chat.component';

describe('AddChatComponent', () => {
  let component: AddChatComponent;
  let fixture: ComponentFixture<AddChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddChatComponent]
    });
    fixture = TestBed.createComponent(AddChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
