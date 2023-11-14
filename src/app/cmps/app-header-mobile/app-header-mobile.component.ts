import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-header-mobile',
    templateUrl: './app-header-mobile.component.html',
    styleUrls: ['./app-header-mobile.component.scss'],
})
export class AppHeaderMobileComponent implements OnInit {
    constructor(
        private router: Router,
        private userService: UserService,
    ) {}

    filterBy = { account: '' };
    isSearchModalShown = false;
    users$!: Observable<User[]>;

    ngOnInit() {
        this.onSearch();
    }

    onClickLogo() {
        this.router.navigateByUrl('/');
    }

    async onSearch() {
        // this.users$ = this.userService.getUsers(this.filterBy).pipe(take(1));
        // console.log('this.users$', this.users$);
        this.users$ = (await this.userService.getUsers(
            this.filterBy,
        )) as Observable<User[]>;
    }
}
