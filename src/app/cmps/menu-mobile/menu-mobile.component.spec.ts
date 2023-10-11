import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MenuMobileComponent} from './menu-mobile.component';

describe('AsideMenuMobileComponent', () => {
    let component: MenuMobileComponent;
    let fixture: ComponentFixture<MenuMobileComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MenuMobileComponent]
        });
        fixture = TestBed.createComponent(MenuMobileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
