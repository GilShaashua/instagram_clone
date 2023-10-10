import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MessagePageComponent } from './pages/message-page/message-page.component';
import { NotificationPageComponent } from './pages/notification-page/notification-page.component';
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { loginAuthGuard } from './guards/login-auth.guard';

const routes: Routes = [
    { path: '', component: HomePageComponent, canActivate: [authGuard] },
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [loginAuthGuard],
    },
    {
        path: 'message',
        component: MessagePageComponent,
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
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
