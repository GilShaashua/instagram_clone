import {Component, Input} from '@angular/core';
import {PostModel} from "../../models/post.model";

@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
    @Input() posts!: PostModel[]
}
