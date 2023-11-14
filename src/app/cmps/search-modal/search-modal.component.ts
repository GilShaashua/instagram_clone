import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
    selector: 'search-modal',
    templateUrl: './search-modal.component.html',
    styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent {
    @Input() users!: User[] | null;
}
