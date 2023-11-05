import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreOptionsModalComponent } from './more-options-modal.component';

describe('MoreOptionsModalComponent', () => {
  let component: MoreOptionsModalComponent;
  let fixture: ComponentFixture<MoreOptionsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoreOptionsModalComponent]
    });
    fixture = TestBed.createComponent(MoreOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
