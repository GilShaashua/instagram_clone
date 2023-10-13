import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, retry, take, tap, throwError} from "rxjs";
import {Post} from "../models/post.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private _posts$ = new BehaviorSubject<Post[]>([])
    public posts$ = this._posts$.asObservable()
    
    constructor(private db: AngularFirestore, private authService: AuthService) {
    }
    
    getPosts() {
        return this.db.collection('posts').valueChanges()
                .pipe(tap((posts) => {
                            // console.log('posts', posts)
                            this._posts$.next(posts as Post[])
                        }),
                        retry(1),
                        catchError((err: HttpErrorResponse) => {
                            console.log('err:', err);
                            return throwError(() => err);
                        }))
    }
    
    async toggleLike(isLikeClicked: boolean, post: Post) {
        if (isLikeClicked) await this.addLike(post)
        else await this.removeLike(post)
    }
    
    async addLike(post: Post) {
        let loggedInUserId: string | undefined
        this.authService.loggedInUser$.pipe(take(1)).subscribe({
            next: (loggedInUser) => {
                loggedInUserId = loggedInUser?.user?.uid
            }
        })
        post.likedByUsers.push(loggedInUserId as string)
        await this.db.collection('posts').doc(post._id).update({
            likedByUsers: post.likedByUsers
        })
        const posts = this._posts$.value
        const postToEditIdx = posts.findIndex((_post) => _post._id === post._id)
        posts.splice(postToEditIdx, 1, post)
        this._posts$.next(posts)
    }
    
    async removeLike(post: Post) {
        let loggedInUserId: string | undefined
        this.authService.loggedInUser$.pipe(take(1)).subscribe({
            next: (loggedInUser) => {
                loggedInUserId = loggedInUser?.user?.uid
            }
        })
        const likedByUserIdx = post.likedByUsers.findIndex((likedByUser) => likedByUser === loggedInUserId)
        post.likedByUsers.splice(likedByUserIdx, 1)
        await this.db.collection('posts').doc(post._id).update({
            likedByUsers: post.likedByUsers
        })
    }
}
