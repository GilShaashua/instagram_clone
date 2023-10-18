import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'kababCase',
})
export class KababCasePipe implements PipeTransform {
    transform(str: string) {
        return str.toLowerCase().replace(/\s+/g, '-');
    }
}
