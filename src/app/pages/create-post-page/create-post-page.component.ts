import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
    selector: 'create-post-page',
    templateUrl: './create-post-page.component.html',
    styleUrls: ['./create-post-page.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class CreatePostPageComponent {
    constructor(private postService: PostService) {}

    isSelectMediaShown: boolean = true;
    isFilterMediaShown: boolean = false;
    isFormMediaShown: boolean = false;

    onMediaSelected(ev: any) {
        console.log(ev.target.files[0]);
        this.postService.uploadMedia();
    }
}
