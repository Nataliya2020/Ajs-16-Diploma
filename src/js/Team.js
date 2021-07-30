export default class Team {
  constructor() {
    this.members = new Set();
  }

  add(obj) {
    if (this.members.has(obj)) {
      throw new Error('Такой участник уже есть');
    } else {
      this.members.add(obj);
    }
  }

  addAll(...obj) {
    obj.forEach((item) => this.members.add(item));
  }

  toArray() {
    return [...this.members];
  }

  delete(obj) {
    this.members.delete(obj);
  }

  * [Symbol.iterator]() {
    for (const person of this.members) {
      yield person;
    }
  }
}
