import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPreviewComponent } from './notification-preview.component';

describe('NotificationPreviewComponent', () => {
  let component: NotificationPreviewComponent;
  let fixture: ComponentFixture<NotificationPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationPreviewComponent]
    });
    fixture = TestBed.createComponent(NotificationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
