import {Component} from '@angular/core';

@Component({
    selector: 'message-page',
    templateUrl: './message-page.component.html',
    styleUrls: ['./message-page.component.scss'],
    host: {
        class: 'page-cmp-layout'
    }
})
export class MessagePageComponent {
}
