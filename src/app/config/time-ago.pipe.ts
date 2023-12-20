import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
    name: 'timeAgo',
    standalone: true,
    pure: true,  // Sử dụng pure pipe để tối ưu hóa hiệu suất
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const formattedValue = value.toString().replace("Z", "");
    const input = moment.utc(formattedValue);
    const now = moment.utc();
    const duration = moment.duration(now.diff(input));

    if (duration.asHours() < 1) {
      const minutes = Math.round(duration.asMinutes());
      return `${minutes} phút trước`;
    } else if (duration.asDays() < 1) {
      const hours = Math.round(duration.asHours());
      return `${hours} giờ trước`;
    } else if (duration.asMonths() < 1) {
      const days = Math.round(duration.asDays());
      return `${days} ngày trước`;
    } else if (duration.asYears() < 1) {
      const months = Math.round(duration.asMonths());
      return `${months} tháng trước`;
    } else {
      const years = Math.round(duration.asYears());
      return `${years} năm trước`;
    }
  }
}
