import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { NotificationPageComponent } from './pages/notification-page/notification-page.component';
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { loginAuthGuard } from './guards/login-auth.guard';
import { userResolver } from './resolvers/user.resolver';
import { ChatDetailsComponent } from './pages/chat-details/chat-details.component';
import { chatResolver } from './resolvers/chat.resolver';
import { AddChatComponent } from './pages/add-chat/add-chat.component';

const routes: Routes = [
    {
        path: 'chat/add',
        component: AddChatComponent,
        canActivate: [authGuard],
        // resolve: { chat: chatResolver },
    },
    {
        path: 'chat/:chatId',
        component: ChatDetailsComponent,
        canActivate: [authGuard],
        resolve: { chat: chatResolver },
    },
    {
        path: 'chat',
        component: ChatPageComponent,
        canActivate: [authGuard],
    },

    {
        path: 'notification',
        component: NotificationPageComponent,
        canActivate: [authGuard],
    },

    {
        path: 'create-post',
        component: CreatePostPageComponent,
        canActivate: [authGuard],
    },

    {
        path: 'profile/:userId',
        component: ProfileComponent,
        canActivate: [authGuard],
        resolve: { user: userResolver },
    },

    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [loginAuthGuard],
    },

    { path: '', component: HomePageComponent, canActivate: [authGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
