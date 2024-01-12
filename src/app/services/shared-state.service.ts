import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharedStateService {
    constructor() {}

    private _isChatDetailsShown$ = new BehaviorSubject(false);
    public isChatDetailsShown$ = this._isChatDetailsShown$.asObservable();

    setChatDetailsShown(isOpen: boolean) {
        this._isChatDetailsShown$.next(isOpen);
    }
}
