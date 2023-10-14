import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';

@Component({
    selector: 'home-page-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    posts$!: Observable<Post[]>;

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.posts$ = this.postService.posts$;
    }

    async onToggleLike(payload: { post: Post; isLikeClicked: boolean }) {
        await this.postService.toggleLike(payload.isLikeClicked, payload.post);
    }

    ngOnDestroy() {}
}
