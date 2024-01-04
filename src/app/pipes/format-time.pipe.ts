import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
    transform(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes} ${date.getDay() + 1}/${
            date.getMonth() + 1
        }/${date.getFullYear().toString().substring(2)}`;
    }
}
