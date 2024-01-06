import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { Comment } from '../../models/comment.model.';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'comment-cmp',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy, OnChanges {
    constructor(
        private postService: PostService,
        private authService: AuthService,
        private router: Router,
    ) {}

    @Input() comment!: Comment;
    @Output() onAddReply = new EventEmitter();

    isReplyFormShown = false;
    replies: Comment[] = [];
    isReplyListShown = false;
    isReplyFormInitialized = false;

    ngOnInit() {
        document.body.addEventListener(
            'click',
            this.handleOutsideClick.bind(this),
        );

        if (this.comment.replies?.length) {
            this.postService
                .getRepliesForComment(this.comment)
                .pipe(
                    take(1),
                    switchMap(async (replies) => {
                        const modifiedReplies = replies.map(
                            async (reply: any) => {
                                const user$ = this.authService.getUserById(
                                    reply.createdByUserId,
                                );
                                const user = await firstValueFrom(user$);
                                return { ...reply, createdByUserId: user };
                            },
                        );

                        return await Promise.all(modifiedReplies);
                    }),
                )
                .subscribe({
                    next: (replies) => {
                        this.replies = replies;
                    },
                });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['comment'].firstChange) return;
        if (changes['comment'].currentValue.replies.length) {
            this.postService
                .getRepliesForComment(this.comment)
                .pipe(
                    take(1),
                    switchMap(async (replies) => {
                        const modifiedReplies = replies.map(
                            async (reply: any) => {
                                const user$ = this.authService.getUserById(
                                    reply.createdByUserId,
                                );
                                const user = await firstValueFrom(user$);
                                return { ...reply, createdByUserId: user };
                            },
                        );

                        return await Promise.all(modifiedReplies);
                    }),
                )
                .subscribe({
                    next: (replies) => {
                        this.replies = replies;
                    },
                });
        }
    }

    addReply(reply: Comment) {
        this.onAddReply.emit(reply);

        this.isReplyFormShown = false;
    }

    onClickReply() {
        this.isReplyFormShown = true;
    }

    handleOutsideClick(event: Event) {
        const target = event.target as HTMLElement;

        if (
            !target.closest('.reply-form') &&
            !target.classList.contains('btn-reply')
        ) {
            this.isReplyFormShown = false;
        }
    }

    navigateToUserProfile() {
        this.router.navigateByUrl(
            `/profile/${this.comment.createdByUserId._id}`,
        );
    }

    ngOnDestroy() {
        document.body.removeEventListener('click', this.handleOutsideClick);
    }
}
