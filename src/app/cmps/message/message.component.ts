import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
    constructor(
        private postService: PostService,
        private authService: AuthService,
    ) {}

    @Input() message!: Message;
    @Input() participantUser!: User;
    @Input() loggedInUserFromDB!: User;

    post?: Post;
    postCreator$?: Observable<User>;

    async ngOnInit() {
        if (this.message.postId) {
            this.post = await this.postService.getPostById(this.message.postId);
        }

        if (this.post) {
            this.postCreator$ = this.authService.getUserById(
                this.post.creatorId,
            );
        }
    }

    ngOnDestroy() {}
}
