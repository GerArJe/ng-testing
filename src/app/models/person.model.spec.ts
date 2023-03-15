import { Person } from './person.model';

describe('Tests for Person', () => {
  let person: Person;
  beforeEach(() => {
    person = new Person('Andres', 'Salinas', 43, 40, 1.78);
  });

  it('attrs', () => {
    expect(person.name).toEqual('Andres');
    expect(person.lastName).toEqual('Salinas');
    expect(person.age).toEqual(43);
    expect(person.weight).toEqual(40);
    expect(person.height).toEqual(1.78);
  });

  describe('tests for calcIMC', () => {
    it('should return string: not found', () => {
      person.weight = -20;
      person.height = 1.65;

      const res = person.calcIMC();
      
      expect(res).toEqual('not found');
    });

    it('should return string: down', () => {
      person.weight = 40;
      person.height = 1.65;

      const res = person.calcIMC();

      expect(res).toEqual('down');
    });

    it('should return string: normal', () => {
      person.weight = 58;
      person.height = 1.65;

      const res = person.calcIMC();

      expect(res).toEqual('normal');
    });

    it('should return string: overweight', () => {
      person.weight = 82;
      person.height = 1.65;

      const res = person.calcIMC();
      
      expect(res).toEqual('overweight');
    });

    it('should return string: overweight level 1', () => {
      person.weight = 88;
      person.height = 1.65;

      const res = person.calcIMC();
      
      expect(res).toEqual('overweight level 1');
    });

    it('should return string: overweight level 2', () => {
      person.weight = 99;
      person.height = 1.65;

      const res = person.calcIMC();
      
      expect(res).toEqual('overweight level 2');
    });

    it('should return string: overweight level 3', () => {
      person.weight = 160;
      person.height = 1.65;

      const res = person.calcIMC();
      
      expect(res).toEqual('overweight level 3');
    });
  });
});
