import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateParse'
})
export class DateParsePipe implements PipeTransform  {
  customDate:Date;
   transform(value: any): Date {
     var customDate = new Date(value.match(/\d+/)[0] * 1);  
    return  customDate;}

}
