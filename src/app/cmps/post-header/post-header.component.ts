import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';

@Component({
    selector: 'post-header',
    templateUrl: './post-header.component.html',
    styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent {
    @Input() creator!: User;
    @Input() post!: Post;
}
