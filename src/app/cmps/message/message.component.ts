import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
    selector: 'message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
    constructor(private postService: PostService) {}

    @Input() message!: Message;
    @Input() participantUser!: User;
    @Input() loggedInUserFromDB!: User;

    post!: Post;

    async ngOnInit() {
        if (this.message.postId) {
            this.post = await this.postService.getPostById(this.message.postId);
        }
    }

    ngOnDestroy() {}
}
