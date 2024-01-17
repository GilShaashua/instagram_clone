import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-root/app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { NotificationPageComponent } from './pages/notification-page/notification-page.component';
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AsideMenuComponent } from './cmps/aside-menu/aside-menu.component';
import { AppFooterComponent } from './cmps/app-footer/app-footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './pages/profile/profile.component';
import { PostListComponent } from './cmps/post-list/post-list.component';
import { PostCardComponent } from './cmps/post-card/post-card.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { MenuMobileComponent } from './cmps/menu-mobile/menu-mobile.component';
import { AppHeaderMobileComponent } from './cmps/app-header-mobile/app-header-mobile.component';
import { PostHeaderComponent } from './cmps/post-header/post-header.component';
import { LikedByUsersListComponent } from './cmps/liked-by-users-list/liked-by-users-list.component';
import { LikedByUserRowComponent } from './cmps/liked-by-user-row/liked-by-user-row.component';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { KababCasePipe } from './pipes/kabab-case.pipe';
import { NotificationListComponent } from './cmps/notification-list/notification-list.component';
import { NotificationPreviewComponent } from './cmps/notification-preview/notification-preview.component';
import { CommentsModalComponent } from './cmps/comments-modal/comments-modal.component';
import { MoreOptionsModalComponent } from './cmps/more-options-modal/more-options-modal.component';
import { SearchModalComponent } from './cmps/search-modal/search-modal.component';
import { UserRowSearchModalComponent } from './cmps/user-row-search-modal/user-row-search-modal.component';
import { CommentComponent } from './cmps/comment/comment.component';
import { ReplyFormComponent } from './cmps/reply-form/reply-form.component';
import { ReplyListComponent } from './cmps/reply-list/reply-list.component';
import { ReplyPreviewComponent } from './cmps/reply-preview/reply-preview.component';
import { PostsModalComponent } from './cmps/posts-modal/posts-modal.component';
import { EditProfileModalComponent } from './cmps/edit-profile-modal/edit-profile-modal.component';
import { ChatListComponent } from './cmps/chat-list/chat-list.component';
import { ChatPreviewComponent } from './cmps/chat-preview/chat-preview.component';
import { ChatDetailsComponent } from './pages/chat-details/chat-details.component';
import { MessageListComponent } from './cmps/message-list/message-list.component';
import { MessageComponent } from './cmps/message/message.component';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { AddChatComponent } from './pages/add-chat/add-chat.component';
import { UserListComponent } from './cmps/user-list/user-list.component';
import { UserRowComponent } from './cmps/user-row/user-row.component';

firebase.initializeApp(environment.firebase);

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        ChatPageComponent,
        NotificationPageComponent,
        CreatePostPageComponent,
        LoginPageComponent,
        AsideMenuComponent,
        AppFooterComponent,
        ProfileComponent,
        PostListComponent,
        PostCardComponent,
        TimeAgoPipe,
        MenuMobileComponent,
        AppHeaderMobileComponent,
        PostHeaderComponent,
        LikedByUsersListComponent,
        LikedByUserRowComponent,
        KababCasePipe,
        NotificationListComponent,
        NotificationPreviewComponent,
        CommentsModalComponent,
        MoreOptionsModalComponent,
        SearchModalComponent,
        UserRowSearchModalComponent,
        CommentComponent,
        ReplyFormComponent,
        ReplyListComponent,
        ReplyPreviewComponent,
        PostsModalComponent,
        EditProfileModalComponent,
        ChatListComponent,
        ChatPreviewComponent,
        ChatDetailsComponent,
        MessageListComponent,
        MessageComponent,
        FormatTimePipe,
        AddChatComponent,
        UserListComponent,
        UserRowComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        //////////////////////////////////////////////////////////////////////////////
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
        provideDatabase(() => getDatabase()),
        provideMessaging(() => getMessaging()),
    ],
    providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
    bootstrap: [AppComponent],
})
export class AppModule {}
