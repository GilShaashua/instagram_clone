import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePageComponent } from './message-page.component';

describe('MessagePageComponent', () => {
  let component: MessagePageComponent;
  let fixture: ComponentFixture<MessagePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessagePageComponent]
    });
    fixture = TestBed.createComponent(MessagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
