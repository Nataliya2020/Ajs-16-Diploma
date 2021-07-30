export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;

    if (new.target.name === 'Character') {
      throw new Error('Нельзя создать обект основного класса');
    }
    // TODO: throw error if user use "new Character()"
  }

  levelUp() {
    if (this.health === 0) {
      throw new Error('Нельзя повысить левел умершего');
    }

    this.level += 1;

    this.health += 80;

    if (this.health > 100) {
      this.health = 100;
    }
  }
}
