import { Component, Input } from '@angular/core';
import { Comment } from '../../models/comment.model.';

@Component({
    selector: 'reply-list',
    templateUrl: './reply-list.component.html',
    styleUrls: ['./reply-list.component.scss'],
})
export class ReplyListComponent {
    @Input() replies!: Comment[] | null;

    trackByReplyId(index: number, reply: Comment) {
        return reply._id;
    }
}
