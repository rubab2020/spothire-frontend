import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'time'
})

export class TimePipe implements PipeTransform {

transform(time) {
    const time_part_array = time.split(":");
    let ampm = 'AM';
    if (time_part_array[0] >= 12) {
        ampm = 'PM';
    }
    if (time_part_array[0] > 12) {
        time_part_array[0] = time_part_array[0] - 12;
    }
    const formatted_time = time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;
    return formatted_time;
   }
}