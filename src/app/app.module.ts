import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-root/app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MessagePageComponent } from './pages/message-page/message-page.component';
import { NotificationPageComponent } from './pages/notification-page/notification-page.component';
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AsideMenuComponent } from './cmps/aside-menu/aside-menu.component';
import { AppFooterComponent } from './cmps/app-footer/app-footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './pages/profile/profile.component';
import { environment } from './enviroments/enviroment';
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
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { provideStorage,getStorage } from '@angular/fire/storage';

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        MessagePageComponent,
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
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,

        //////////////////////////////////////////////////////////////////////////////

        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideFunctions(() => getFunctions()),
        provideMessaging(() => getMessaging()),
        provideStorage(() => getStorage()),
    ],
    providers: [
        { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
