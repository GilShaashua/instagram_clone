import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Post} from "../../models/post.model";

@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
    @Input() posts!: Post[]
    @Output() onToggleLike = new EventEmitter<{ post: Post, isLikeClicked: boolean }>();
}
