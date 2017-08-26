export class NumberValidator {
  static isValidNumber(control: any): any {
    if (control.value.match(/^[+-]?\d+(\.\d+)?$/) === null) {
      return {'invalidNumber': true};
    }
  }
}
