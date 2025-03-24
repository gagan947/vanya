import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
      name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {
      transform(value: number): string {
            if (value === 0) return 'Zero';
            return this.convertToWords(value);
      }

      private convertToWords(num: number): string {
            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

            if (num === 0) return 'Zero';

            function convert(num: number): string {
                  if (num < 20) return ones[num];
                  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
                  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convert(num % 100) : '');
                  if (num < 1000000) return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + convert(num % 1000) : '');
                  if (num < 1000000000) return convert(Math.floor(num / 1000000)) + ' Million' + (num % 1000000 !== 0 ? ' ' + convert(num % 1000000) : '');
                  return convert(Math.floor(num / 1000000000)) + ' Billion' + (num % 1000000000 !== 0 ? ' ' + convert(num % 1000000000) : '');
            }

            // Split into rupees and paise
            const numParts = num.toFixed(2).split('.');
            const rupees = parseInt(numParts[0], 10);
            const paise = parseInt(numParts[1], 10);

            let result = convert(rupees) + ' Rupees';

            if (paise > 0) {
                  result += ' and ' + convert(paise) + ' Paise';
            }

            return result;

      }
}
