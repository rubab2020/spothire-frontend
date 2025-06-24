import { ThousandNumberFormatPipe } from './thousand-number-format.pipe';

describe('ThousandNumberFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new ThousandNumberFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
