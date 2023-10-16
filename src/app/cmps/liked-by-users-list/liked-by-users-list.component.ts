import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';

@Component({
    selector: 'liked-by-users-list',
    templateUrl: './liked-by-users-list.component.html',
    styleUrls: ['./liked-by-users-list.component.scss'],
})
export class LikedByUsersListComponent {
    @Input() post!: Post;
    @Input() isLikedByUsersModalShown!: boolean;
    @Output() onToggleLikedByUsersModal = new EventEmitter<boolean>();
    @Output() onToggleFollow = new EventEmitter<{
        post: Post;
        user: User;
        isFollowClicked: boolean;
    }>();

    toggleLikedByUsersModal() {
        this.onToggleLikedByUsersModal.emit(!this.isLikedByUsersModalShown);
    }
}
