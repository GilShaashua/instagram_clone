import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import { User } from '../../models/user.model';

@Component({
    selector: 'search-modal',
    templateUrl: './search-modal.component.html',
    styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit, OnDestroy {
    constructor(private renderer: Renderer2) {}

    @Input() users!: User[] | null;
    @Output() closeModal = new EventEmitter();
    @Output() getUsers = new EventEmitter();
    @Output() toggleFollow = new EventEmitter();

    ngOnInit() {
        this.renderer.addClass(document.body, 'body-unscrollable');
        this.getUsers.emit();
    }

    onCloseModal() {
        this.closeModal.emit(false);
    }

    trackByUserId(index: number, user: User): string {
        return user._id; // Assuming _id is a unique identifier for users
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'body-unscrollable');
    }
}
