import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'msgTime'
})

export class MessageTimePipe implements PipeTransform {

transform(msgTime) {
    const time_part_array = msgTime.split(":");
    const formatted_time = time_part_array[0] + ':' + time_part_array[1];
    return formatted_time;
   }
}