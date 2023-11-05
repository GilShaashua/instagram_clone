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

@Component({
    selector: 'liked-by-users-list',
    templateUrl: './liked-by-users-list.component.html',
    styleUrls: ['./liked-by-users-list.component.scss'],
})
export class LikedByUsersListComponent implements OnInit, OnDestroy {
    constructor(private renderer: Renderer2) {}

    @Input() post!: Post;
    @Input() isLikedByUsersModalShown!: boolean;
    @Output() onToggleLikedByUsersModal = new EventEmitter<boolean>();
    @Output() onToggleFollow = new EventEmitter<{
        post: Post;
        user: User;
        isFollowClicked: boolean;
    }>();

    ngOnInit() {
        this.renderer.addClass(document.body, 'body-unscrollable');
    }

    toggleLikedByUsersModal() {
        this.onToggleLikedByUsersModal.emit(!this.isLikedByUsersModalShown);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'body-unscrollable');
    }
}
