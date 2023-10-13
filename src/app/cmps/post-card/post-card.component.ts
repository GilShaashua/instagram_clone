import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {AuthService} from "../../services/auth.service";
import {take} from "rxjs";
import {User} from "../../models/user.model";
import {PostService} from "../../services/post.service";

@Component({
    selector: 'post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
    @Input() post!: Post
    creator!: User
    isMoreClicked = false
    likedByUsers: User[] = []
    isLikedByUsersModalShown = false
    loggedInUser: any
    isLikeClicked = false
    
    constructor(private authService: AuthService, private postService: PostService) {
    }
    
    ngOnInit() {
        this.authService.getUserById(this.post.creatorId).pipe(take(1)).subscribe({
            next: (creator: any) => {
                if (creator.exists) {
                    this.creator = creator.data()
                }
            }
        })
        this.post.likedByUsers.forEach((likedByUser, idx) => {
            this.authService.getUserById(likedByUser).pipe(take(1)).subscribe({
                next: (user) => {
                    if (user.exists) {
                        this.likedByUsers.push(user.data() as User)
                    }
                }
            })
            // if (idx === this.post.likedByUsers.length - 1) {
            //
            // }
        })
        this.authService.loggedInUser$.pipe(take(1)).subscribe({
            next: (loggedInUser) => {
                this.loggedInUser = loggedInUser
            }
        })
        setTimeout(() => {
            this.isLikeClicked = !!this.likedByUsers.find(likedByUser => likedByUser._id === this.loggedInUser.user.uid)
        }, 200)
    }
    
    async onToggleLike() {
        this.isLikeClicked = !this.isLikeClicked
        await this.postService.toggleLike(this.isLikeClicked, this.post)
        //   TODO: update the state 'this.likedByUsers'
        this.authService.getUserById(this.creator._id).pipe(take(1)).subscribe({
            next: (user: any) => {
                if (user.exists) {
                    if (this.isLikeClicked) {
                        this.likedByUsers.push(user.data())
                    } else {
                        const userIdx = this.likedByUsers.findIndex(likedByUser => likedByUser._id === this.creator._id)
                        this.likedByUsers.splice(userIdx, 1)
                    }
                }
            }
        })
    }
}
