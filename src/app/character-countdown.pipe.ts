import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'characterCountdown',
    pure: false
})

export class CharacterCountdownPipe implements PipeTransform {
  transform(text: string, args: number) {
    let maxLength = args || 140
    let length = text.length;
    return (maxLength - length);
  }
}