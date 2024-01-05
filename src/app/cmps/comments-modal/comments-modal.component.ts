import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import { firstValueFrom, Subscription, switchMap } from 'rxjs';
import { Comment } from '../../models/comment.model.';
import { Post } from '../../models/post.model';
import firebase from 'firebase/compat';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'comments-modal',
    templateUrl: './comments-modal.component.html',
    styleUrls: ['./comments-modal.component.scss'],
})
export class CommentsModalComponent implements OnInit, OnDestroy {
    constructor(
        private postService: PostService,
        private authService: AuthService,
        private renderer: Renderer2,
    ) {}

    @Input() post!: Post;
    @Input() loggedInUser!: firebase.User;
    @Output() onAddComment = new EventEmitter();
    @Output() onAddReply = new EventEmitter();
    @Output() onToggleCommentsModal = new EventEmitter();
    @Output() onGetCommentsLength = new EventEmitter();

    comment: Comment = {
        _id: '',
        parentId: '',
        isTopLevel: true,
        postId: '',
        createdByUserId: '',
        message: '',
        createdAt: 0,
        replies: [],
    };
    comments!: Comment[];
    commentsSubscription!: Subscription;
    loggedInUserFromDB!: User;

    async ngOnInit() {
        this.renderer.addClass(document.body, 'body-unscrollable');

        const loggedInUserFromDB$ = this.authService.getUserById(
            this.loggedInUser.uid,
        );
        const loggedInUserFromDB = await firstValueFrom(loggedInUserFromDB$);
        this.loggedInUserFromDB = loggedInUserFromDB;

        this.comment.postId = this.post._id;
        this.comment.createdByUserId = loggedInUserFromDB._id;

        this.commentsSubscription = this.postService
            .getCommentsByPostId(this.post._id)
            .pipe(
                switchMap(async (comments) => {
                    const userPromises = comments.map(async (comment) => {
                        const createdByUser$ = this.authService.getUserById(
                            comment.createdByUserId as string,
                        );
                        const createdByUser =
                            await firstValueFrom(createdByUser$);

                        return { ...comment, createdByUserId: createdByUser };
                    });

                    return await Promise.all(userPromises);
                }),
            )
            .subscribe({
                next: (comments) => {
                    this.comments = comments;
                    this.onGetCommentsLength.emit(this.comments.length);
                },
            });
    }

    addComment() {
        this.onAddComment.emit({ comment: this.comment, post: this.post });
        this.comment.message = '';
    }

    trackByCommentId(index: number, comment: Comment) {
        return comment._id;
    }

    ngOnDestroy() {
        this.commentsSubscription?.unsubscribe();
        this.renderer.removeClass(document.body, 'body-unscrollable');
    }
}
