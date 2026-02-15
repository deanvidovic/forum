import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: false,
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return 'unknown';

    const d = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (seconds < 5) return 'right now';

    const intervals: { [key: string]: number } = {
      'year': 31536000,
      'month': 2592000,
      'week': 604800,
      'day': 86400,
      'hour': 3600,
      'minute': 60,
      'second': 1
    };

    let counter;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        if (counter === 1) {
          return `${counter} ${i} ago`;
        } else {
          let suffix = i;
          if (i === 'minute') suffix = 'min';
          if (i === 'hour') suffix = 'hour';
          if (i === 'day') suffix = 'day';
          if (i === 'month') suffix = 'month';
          if (i === 'year') suffix = 'year';
          
          return `${counter} ${suffix} ago`;
        }
      }
    }
    return 'right now';
  }
}