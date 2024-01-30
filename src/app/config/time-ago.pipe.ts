import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true,  // Sử dụng pure pipe để tối ưu hóa hiệu suất
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const formattedValue = value.toLocaleString();
    const distance = formatDistanceToNow(formattedValue, { addSuffix: true, locale: vi });

    return distance.replace('khoảng ', '');
  }
}
