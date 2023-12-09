import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
    selector: 'posts-modal',
    templateUrl: './posts-modal.component.html',
    styleUrls: ['./posts-modal.component.scss'],
})
export class PostsModalComponent implements OnInit {
    @Input() userPosts!: Post[];
    @Output() onClosePostsModal = new EventEmitter();

    isLikedByUsersClicked = false;

    ngOnInit(): void {
        // console.log('userPosts', this.userPosts);
    }

    trackByPostId(index: number, post: Post) {
        return post._id;
    }
}
