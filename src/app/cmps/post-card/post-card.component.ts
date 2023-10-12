import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {AuthService} from "../../services/auth.service";
import {take} from "rxjs";
import {User} from "../../models/user.model";

@Component({
    selector: 'post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
    @Input() post!: Post
    creator!: User
    isMoreClicked: boolean = false
    likedByUsers: User[] = []
    
    constructor(private authService: AuthService) {
    }
    
    ngOnInit() {
        this.authService.getUserById(this.post.creatorId).pipe(take(1)).subscribe({
            next: (creator: any) => {
                if (creator.exists) {
                    this.creator = creator.data()
                    console.log('this.creator', this.creator)
                }
            }
        })
        this.post.likedByUsers.forEach((likedByUser) => {
            this.authService.getUserById(likedByUser).pipe(take(1)).subscribe({
                next: (user) => {
                    if (user.exists) {
                        console.log('user', user.data())
                        this.likedByUsers.push(user.data() as User)
                    }
                }
            })
        })
    }
    
    onGetUserById(userId: string) {
    }
}
