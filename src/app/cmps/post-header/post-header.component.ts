import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'post-header',
    templateUrl: './post-header.component.html',
    styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent {
    constructor(private authService: AuthService) {}
    @Input() creator!: User;
    @Input() post!: Post;
    @Input() isComponentInitialized!: boolean;
    @Output() onToggleFollow = new EventEmitter();
    @Output() onClickUserImg = new EventEmitter();

    isMoreOptionsModalShown = false;
}
