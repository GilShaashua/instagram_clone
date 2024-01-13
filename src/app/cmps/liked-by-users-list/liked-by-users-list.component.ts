import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'liked-by-users-list',
    templateUrl: './liked-by-users-list.component.html',
    styleUrls: ['./liked-by-users-list.component.scss'],
})
export class LikedByUsersListComponent implements OnInit, OnDestroy {
    constructor(
        private renderer: Renderer2,
        private userService: UserService,
    ) {}

    @Input() post!: Post;
    @Input() isLikedByUsersModalShown!: boolean;
    @Output() onToggleLikedByUsersModal = new EventEmitter<boolean>();
    @Output() onToggleFollow = new EventEmitter<{
        user: User;
        isFollowClicked: boolean;
    }>();
    @Output() onCloseLikedByUsers = new EventEmitter();
    @Output() onClickUserImg = new EventEmitter();
    usersSubscription!: Subscription;

    ngOnInit() {
        this.renderer.addClass(document.body, 'body-unscrollable');

        this.usersSubscription = this.userService
            .getLikedByUsers(this.post.likedByUsers)
            .subscribe({
                next: (likedByUsers) => {
                    this.post.likedByUsers = likedByUsers;
                },
            });
    }

    toggleLikedByUsersModal() {
        this.onToggleLikedByUsersModal.emit(!this.isLikedByUsersModalShown);
    }

    trackByUserId(idx: number, user: User) {
        return user._id;
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'body-unscrollable');
        this.usersSubscription?.unsubscribe();
    }
}
