import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../services/post.service";
import {Observable} from "rxjs";
import {PostModel} from "../../models/post.model";

@Component({
    selector: 'home-page-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
    posts$!: Observable<PostModel[]>
    
    constructor(private postService: PostService) {
    }
    
    ngOnInit() {
        this.posts$ = this.postService.posts$
    }
    
    ngOnDestroy() {
    }
}
