import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-header-mobile',
    templateUrl: './app-header-mobile.component.html',
    styleUrls: ['./app-header-mobile.component.scss']
})
export class AppHeaderMobileComponent {
    constructor(private router: Router) {
    }
    
    onClickLogo() {
        this.router.navigateByUrl('/')
    }
}
