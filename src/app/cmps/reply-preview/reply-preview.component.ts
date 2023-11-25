import { Component, Input } from '@angular/core';
import { Comment } from '../../models/comment.model.';

@Component({
    selector: 'reply-preview',
    templateUrl: './reply-preview.component.html',
    styleUrls: ['./reply-preview.component.scss'],
})
export class ReplyPreviewComponent {
    @Input() reply!: Comment;
}
