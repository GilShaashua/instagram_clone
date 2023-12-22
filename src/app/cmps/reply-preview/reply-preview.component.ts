import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Comment } from '../../models/comment.model.'
import { Router } from '@angular/router'

@Component({
    selector: 'reply-preview',
    templateUrl: './reply-preview.component.html',
    styleUrls: ['./reply-preview.component.scss'],
})
export class ReplyPreviewComponent {
    constructor(private router: Router) {}

    @Input() reply!: Comment
    @Output() onNavigateUserProfileFromReply = new EventEmitter()

    navigateToUserProfile() {
        this.router.navigateByUrl(`profile/${this.reply.createdByUserId._id}`)
        this.onNavigateUserProfileFromReply.emit()
    }
}
