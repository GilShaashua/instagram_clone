import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';

@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent {
    @Input() posts!: Post[];
    @Output() onToggleLike = new EventEmitter<{
        post: Post;
        isLikeClicked: boolean;
    }>();
    @Output() onToggleFollow = new EventEmitter<{
        post: Post;
        user: User;
        isFollowClicked: boolean;
    }>();
}