import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import { Post } from '../../models/post.model';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import { Message } from '../../models/message.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'send-post-modal',
    templateUrl: './send-post-modal.component.html',
    styleUrls: ['./send-post-modal.component.scss'],
})
export class SendPostModalComponent implements OnInit, OnDestroy {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private postService: PostService,
        private router: Router,
        private renderer: Renderer2,
    ) {}

    @Input() post!: Post;
    @Output() onCloseSendPostModal = new EventEmitter();

    filterBy = { account: '' };
    users!: User[];
    isMessageShown = false;
    userToSendPost: User = {
        _id: '',
        fullName: '',
        imgUrl: '',
        followedByUsers: [],
        followingUsers: [],
        notifications: [],
    };

    newMessage: Message = {
        _id: '',
        chatId: '',
        txt: '',
        sentAt: 0,
        sentBy: this.authService.getLoggedInUser().uid,
    };

    async ngOnInit() {
        this.renderer.addClass(document.body, 'body-unscrollable');

        await this.getUsers();
    }

    async getUsers() {
        const users$ = this.userService.getUsers(this.filterBy);
        try {
            const users = await firstValueFrom(users$);
            this.users = users;
        } catch (err: any) {
            console.error(err);
        }
    }

    async onChooseUserToSendPost(user: User) {
        this.userToSendPost = user;
        this.isMessageShown = true;
    }

    async onSendPost() {
        const chatId = await this.postService.sendPost(
            this.userToSendPost,
            this.post,
            this.newMessage,
        );

        await this.router.navigateByUrl(`chat/${chatId}`);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'body-unscrollable');
    }
}
