import { Component, OnDestroy, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'
import { AuthService } from 'src/app/services/auth.service'
import { Subscription, filter, map, take } from 'rxjs'
import { User } from '../../models/user.model'
import { PostService } from 'src/app/services/post.service'
import { Post } from 'src/app/models/post.model'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Location } from '@angular/common'
import { NotificationService } from 'src/app/services/notification.service'
import { Comment } from 'src/app/models/comment.model.'

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private postService: PostService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private notificationService: NotificationService
    ) {
        this.userService.setIsSearchModalShown(false)
    }

    userFromDB!: User
    userPosts!: Post[]
    userPostsSubscription!: Subscription
    dataSubscription!: Subscription
    isPostsModalShown = false
    isProfilePageInitialized = false
    isToggleLikeProcessing = false
    routerChangesSubscription!: Subscription
    isEditProfileModalShown = false
    loggedInUser = this.authService.getLoggedInUser()

    ngOnInit(): void {
        this.dataSubscription = this.route.data
            .pipe(map((data) => data['user']))
            .subscribe({
                next: (user) => {
                    this.isProfilePageInitialized = false
                    !user ? this.location.back() : (this.userFromDB = user)
                    this.getPostsForUser()
                },
            })

        this.routerChangesSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                console.log('Navigation ended:', event.url)
                this.isPostsModalShown = false
            })
    }

    getPostsForUser() {
        const userPosts$ = this.postService.getPostsForUser(this.userFromDB._id)

        this.userPostsSubscription = userPosts$.subscribe({
            next: (posts) => {
                this.userPosts = posts
                this.isProfilePageInitialized = true
            },
            error: (err: any) => {
                console.error(err)
            },
        })
    }

    trackByPostId(index: number, post: Post) {
        return post._id
    }

    async onToggleLike(payload: { post: Post; isLikeClicked: boolean }) {
        if (this.isToggleLikeProcessing) return

        this.isToggleLikeProcessing = true

        await this.postService.toggleLike(payload.isLikeClicked, payload.post)

        this.isToggleLikeProcessing = false
    }

    onToggleFollow({
        isFollowClicked,
        user,
    }: {
        isFollowClicked: boolean
        user: User
    }) {
        this.authService
            .getUserById(user._id)
            .pipe(take(1))
            .subscribe(async (_user: any) => {
                user = _user
                await this.userService.toggleFollow(isFollowClicked, user)
            })
    }

    async onAddNotification(post: Post) {
        const notification = {
            sender: this.authService.getLoggedInUser().uid,
            recipient: post.creatorId,
            message: '',
            createdAt: 0,
            madeAt: post,
            read: false,
        }
        await this.notificationService.addNotification(
            notification,
            'likeAction'
        )
    }

    async onAddComment({ comment, post }: any) {
        await this.postService.addComment(comment, post)
    }

    async onAddReply(reply: Comment) {
        await this.postService.addReply(reply)
    }

    onUpdateUserProfile(updatedUser: User) {
        // console.log('updatedUser', updatedUser)
        this.userService.updateUserProfile(updatedUser)
        this.userFromDB = updatedUser
        this.isEditProfileModalShown = false
    }

    navigateToUserProfile(creatorId: string) {
        this.router.navigateByUrl(`profile/${creatorId}`)
    }

    navigateUserProfileFromComment() {
        this.isPostsModalShown = false
    }

    navigateUserProfileFromLikedByUsers() {
        console.log('hi')

        this.isPostsModalShown = false
    }

    ngOnDestroy(): void {
        this.userPostsSubscription?.unsubscribe()
        this.dataSubscription?.unsubscribe()
        this.routerChangesSubscription?.unsubscribe()
    }
}
