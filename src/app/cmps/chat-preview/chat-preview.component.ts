import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Chat } from '../../models/chat.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'chat-preview',
    templateUrl: './chat-preview.component.html',
    styleUrls: ['./chat-preview.component.scss'],
})
export class ChatPreviewComponent implements OnInit, OnDestroy {
    constructor(private authService: AuthService) {}

    @Input() chat!: Chat;

    loggedInUserFromDB!: User;
    participantUser!: User;
    isComponentInitialized = false;

    async ngOnInit() {
        await this.getLoggedInUserFromDB();
        await this.getParticipantUser();
        this.isComponentInitialized = true;
    }

    async getLoggedInUserFromDB() {
        const loggedInUserFromDB$ = this.authService.getUserById(
            this.authService.getLoggedInUser().uid,
        );
        this.loggedInUserFromDB = await firstValueFrom(loggedInUserFromDB$);
    }

    async getParticipantUser() {
        let participantUserId = this.chat.users.filter(
            (userId) => userId !== this.loggedInUserFromDB._id,
        )[0];

        const participantUser$ =
            this.authService.getUserById(participantUserId);
        this.participantUser = await firstValueFrom(participantUser$);
    }

    ngOnDestroy() {}
}
