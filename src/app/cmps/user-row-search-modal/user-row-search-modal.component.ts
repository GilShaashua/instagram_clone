import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, take } from 'rxjs';

@Component({
    selector: 'user-row-search-modal',
    templateUrl: './user-row-search-modal.component.html',
    styleUrls: ['./user-row-search-modal.component.scss'],
})
export class UserRowSearchModalComponent implements OnInit, OnChanges {
    constructor(private authService: AuthService) {}

    @Input() user!: User;
    @Output() toggleFollow = new EventEmitter<{
        isFollowClicked: boolean;
        user: User;
    }>();

    isFollowClicked!: boolean;
    loggedInUser!: User;
    isComponentInitialized = false;
    isToggleFollowProcessing: boolean = false;

    async ngOnInit() {
        const loggedInUser = this.authService.getLoggedInUser();

        const user$ = this.authService.getUserById(loggedInUser.uid);

        this.loggedInUser = await firstValueFrom(user$);

        this.isFollowClicked = !!this.loggedInUser.followingUsers.find(
            (user: User | string) => {
                return user === this.user._id;
            },
        );

        this.isComponentInitialized = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.isComponentInitialized) return;
        if (changes['user']) {
            this.isFollowClicked = this.user.followedByUsers.includes(
                this.loggedInUser._id as unknown as User,
            );
        }
    }

    onToggleFollow() {
        if (this.isToggleFollowProcessing) return;

        this.isToggleFollowProcessing = true;

        this.isFollowClicked = !this.isFollowClicked;

        this.toggleFollow.emit({
            isFollowClicked: this.isFollowClicked,
            user: this.user,
        });

        this.isToggleFollowProcessing = false;
    }
}
