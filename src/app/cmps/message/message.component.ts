import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';

@Component({
    selector: 'message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
    constructor() {}

    @Input() message!: Message;

    ngOnInit() {}

    ngOnDestroy() {}
}
