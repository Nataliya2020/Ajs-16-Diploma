import Character from '../Character';

test('checking for an exception when creating the Character class', () => {
  function createCharacter() {
    return new Character(1, 'Bowman');
  }
  expect(createCharacter).toThrowError(new Error('Нельзя создать обект основного класса'));
});

test('checking the creation of objects of the inherited class', () => {
  function createBowman() {
    class Bowman extends Character {
      constructor(level, type = 'generic') {
        super(level, type);
      }
    }
    return new Bowman(1, 'Bowman');
  }

  const res = {
    attack: 0,
    defence: 0,
    health: 100,
    level: 1,
    type: 'Bowman',
  };
  expect(createBowman()).toEqual(res);
});
