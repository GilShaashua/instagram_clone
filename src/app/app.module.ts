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
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from './enviroments/enviroment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

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
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,

        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFirestoreModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
