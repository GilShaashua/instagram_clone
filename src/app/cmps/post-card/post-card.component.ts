import {Component, Input, OnInit} from '@angular/core';
import {PostModel} from "../../models/post.model";
import {AuthService} from "../../services/auth.service";
import {take} from "rxjs";
import {Creator} from "../../models/creator.model";

@Component({
    selector: 'post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
    @Input() post!: PostModel
    creator!: Creator
    
    constructor(private authService: AuthService) {
    }
    
    ngOnInit() {
        this.authService.getUserById(this.post.creatorId).pipe(take(1)).subscribe({
            next: (creator: any) => {
                if (creator.exists) {
                    this.creator = creator.data()
                    console.log('this.creator', this.creator)
                }
            }
        })
    }
}
