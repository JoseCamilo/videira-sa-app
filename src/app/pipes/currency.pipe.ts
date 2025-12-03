import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyformat'
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor() {}

  transform(value: number): any {
    if (value == null)
      return '';

    const new_value =
      'R$ ' +
      new Intl.NumberFormat('BRL', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);

    return new_value;
  }
}
