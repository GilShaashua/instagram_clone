import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRowSearchModalComponent } from './user-row-search-modal.component';

describe('UserRowSeachModalComponent', () => {
    let component: UserRowSearchModalComponent;
    let fixture: ComponentFixture<UserRowSearchModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserRowSearchModalComponent],
        });
        fixture = TestBed.createComponent(UserRowSearchModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
