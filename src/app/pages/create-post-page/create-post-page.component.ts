import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
        private userService: UserService,
    ) {
        this.userService.setIsSearchModalShown(false);
    }

    isSelectMediaShown: boolean = true;
    isFilterMediaShown: boolean = false;
    isFormMediaShown: boolean = false;

    filterPreviews = [
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
        filterSelected: 'normal',
    };

    async onMediaSelected(ev: any) {
        try {
            const mediaUrl = await this.postService.uploadMedia();
            // console.log('Media URL:', mediaUrl);
            if (mediaUrl) {
                this.post.imgUrl = mediaUrl;
            } else {
                console.error(null);
            }
            this.isSelectMediaShown = false;
            this.isFilterMediaShown = true;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    onSelectFilterPreview(filterName: string) {
        this.post.filterSelected = filterName;
    }

    async onCreatePost() {
        await this.postService.createPost(this.post);

        await this.router.navigateByUrl('/');
    }
}
