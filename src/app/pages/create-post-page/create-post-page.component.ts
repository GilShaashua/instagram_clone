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
    mediaUrl!: string;
    filterPreviewNames = [
        'Normal',
        'Paris',
        'Los Angeles',
        'Oslo',
        'Abu Dhabi',
        'Tokyo',
    ];
    classes: { [key: string]: boolean } = {
        normal: true,
        paris: false,
        'los-angeles': false,
        oslo: false,
        'abu-dhabi': false,
        tokyo: false,
    };

    async onMediaSelected(ev: any) {
        try {
            const mediaUrl = await this.postService.uploadMedia(
                ev.target.files[0],
            );
            // this.postService.createPost(mediaUrl);
            console.log('Media URL:', mediaUrl);
            this.mediaUrl = mediaUrl;
            this.isSelectMediaShown = false;
            this.isFilterMediaShown = true;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    onSelectFilterPreview(
        elFilterPreview: HTMLElement,
        filterPreviewIdx: number,
    ) {
        elFilterPreview.classList.add('active');

        const elFilterPreviews = document.querySelectorAll('.filter-preview');
        elFilterPreviews.forEach((elFilterPreview, elFilterPreviewIdx) => {
            if (elFilterPreviewIdx !== filterPreviewIdx) {
                elFilterPreview.classList.remove('active');
            }
        });

        const className = elFilterPreview
            .querySelector('span')
            ?.innerText.toLowerCase()
            .replace(/\s+/g, '-');
        for (const classKey in this.classes) {
            this.classes[classKey] = classKey === className;
        }
    }
}
