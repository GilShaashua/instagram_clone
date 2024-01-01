import { ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { take } from 'rxjs';

export function chatResolver(route: ActivatedRouteSnapshot) {
    const chatId = route.params['chatId'];

    return inject(ChatService).getChatById(chatId).pipe(take(1));
}
