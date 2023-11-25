import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../models/comment.model.';
import { PostService } from '../../services/post.service';
import { firstValueFrom, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'reply-form',
    templateUrl: './reply-form.component.html',
    styleUrls: ['./reply-form.component.scss'],
})
export class ReplyFormComponent implements OnInit {
    constructor(
        private postService: PostService,
        private authService: AuthService,
    ) {}

    @Input() comment!: Comment;
    @Output() onAddReply = new EventEmitter();

    reply: Comment = {
        _id: '',
        parentId: '',
        isTopLevel: false,
        postId: '',
        createdByUserId: this.authService.getLoggedInUser().uid,
        message: '',
        createdAt: 0,
    };
    isComponentInitialized = false;

    async ngOnInit() {
        // To get updated comment from DB
        const comment$ = this.postService
            .getCommentById(this.comment._id!)
            .pipe(take(1));
        this.comment = await firstValueFrom(comment$);

        // Update this.comment.createdByUserId from a string to a User for rendering name of a user to reply about a comment
        const userForComment$ = this.authService.getUserById(
            this.comment.createdByUserId,
        );
        this.comment.createdByUserId = await firstValueFrom(userForComment$);

        this.reply.postId = this.comment.postId;
        this.reply.parentId = this.comment.parentId;

        // Update this.reply.createdByUserId from a string to a User for rendering imgUrl
        const user$ = this.authService.getUserById(this.reply.createdByUserId);
        this.reply.createdByUserId = await firstValueFrom(user$);

        this.isComponentInitialized = true;
    }

    addReply(): void {
        if (!this.reply.message) return;

        this.onAddReply.emit({ ...this.reply });
        this.reply.message = '';
    }
}
