import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { firstValueFrom, Subscription, switchMap } from 'rxjs';
import { Comment } from '../../models/comment.model.';
import { Post } from '../../models/post.model';
import firebase from 'firebase/compat';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import UserCredential = firebase.auth.UserCredential;

@Component({
    selector: 'comments-modal',
    templateUrl: './comments-modal.component.html',
    styleUrls: ['./comments-modal.component.scss'],
})
export class CommentsModalComponent implements OnInit, OnDestroy {
    constructor(
        private postService: PostService,
        private authService: AuthService,
    ) {}

    @Input() post!: Post;
    @Input() loggedInUser!: UserCredential | null;
    @Output() onAddComment = new EventEmitter();
    @Output() onToggleCommentsModal = new EventEmitter();
    @Output() onGetCommentsLength = new EventEmitter();

    comment: Comment = {
        _id: '',
        parentId: '',
        postId: '',
        createdByUserId: '',
        message: '',
        createdAt: 0,
    };
    comments!: Comment[];
    commentsSubscription!: Subscription;

    ngOnInit() {
        this.comment.postId = this.post._id;
        this.comment.createdByUserId = this.loggedInUser!.user!.uid;
        this.commentsSubscription = this.postService
            .getCommentsByPostId(this.post._id)
            .pipe(
                switchMap(async (comments) => {
                    const getUserPromises = comments.map(async (comment) => {
                        const createdByUser$ = this.authService.getUserById(
                            comment.createdByUserId as string,
                        );
                        const createdByUser =
                            await firstValueFrom(createdByUser$);

                        comment.createdByUserId = createdByUser;

                        return comment;
                    });

                    return await Promise.all(getUserPromises);
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

    ngOnDestroy() {
        this.commentsSubscription?.unsubscribe();
    }
}
