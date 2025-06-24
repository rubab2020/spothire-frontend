import { EqualValidatorDirective } from './equal-validator.directive';

describe('EqualValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new EqualValidatorDirective('Angular','Angular');
    expect(directive).toBeTruthy();
  });
});
