import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, retry, tap, throwError} from "rxjs";
import {PostModel} from "../models/post.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private _posts$ = new BehaviorSubject<PostModel[]>([])
    public posts$ = this._posts$.asObservable()
    
    constructor(private db: AngularFirestore) {
    }
    
    getPosts() {
        return this.db.collection('posts').valueChanges()
                .pipe(tap((posts: any[]) => {
                            this._posts$.next(posts)
                        }),
                        retry(1),
                        catchError((err: HttpErrorResponse) => {
                            console.log('err:', err);
                            return throwError(() => err);
                        }))
    }
}