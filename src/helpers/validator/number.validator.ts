export class NumberValidator {
  static isValidNumber(control: any): any {
    let value = "" + control.value;
    if (value.match(/^[+-]?\d+(\.\d+)?$/) === null) {
      return {'invalidNumber': true};
    }
  }
}
