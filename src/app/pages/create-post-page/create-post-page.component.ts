import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';

@Component({
    selector: 'create-post-page',
    templateUrl: './create-post-page.component.html',
    styleUrls: ['./create-post-page.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class CreatePostPageComponent {
    constructor(
        private postService: PostService,
        private router: Router,
    ) {}

    isSelectMediaShown: boolean = true;
    isFilterMediaShown: boolean = false;
    isFormMediaShown: boolean = false;

    filterPreviewNames = [
        { name: 'Normal', value: 'normal' },
        { name: 'Paris', value: 'paris' },
        { name: 'Los Angeles', value: 'los-angeles' },
        { name: 'Oslo', value: 'oslo' },
        { name: 'Abu Dhabi', value: 'abu-dhabi' },
        { name: 'Tokyo', value: 'tokyo' },
    ];

    post: Post = {
        _id: '',
        creatorFullName: '',
        creatorId: '',
        createdAt: 0,
        imgUrl: '',
        content: '',
        likedByUsers: [],
        comments: [],
        filterSelected: 'normal',
    };

    async onMediaSelected(ev: any) {
        try {
            const mediaUrl = await this.postService.uploadMedia(
                ev.target.files[0],
            );
            console.log('Media URL:', mediaUrl);
            this.post.imgUrl = mediaUrl;
            this.isSelectMediaShown = false;
            this.isFilterMediaShown = true;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    onSelectFilterPreview(filterName: string) {
        this.post.filterSelected = filterName;
    }

    onSelectNext() {
        this.isFilterMediaShown = false;
        this.isFormMediaShown = true;
    }

    async onCreatePost() {
        console.log('create-post');
        console.log('post', this.post);
        await this.postService.createPost(this.post);

        await this.router.navigateByUrl('/');
    }
}
