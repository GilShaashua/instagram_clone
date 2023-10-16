import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
    transform(timestamp: number): string {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp / 1000;
        if (diff < 60) {
            return 'just now';
        } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `${minutes}m`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours}h`;
        } else {
            const days = Math.floor(diff / 86400);
            return `${days}d`;
        }
    }
}
