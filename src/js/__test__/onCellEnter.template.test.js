test('checking the correctness of the template generation', () => {
  const person = {
    level: 3,
    attack: 25,
    defence: 25,
    health: 100,
  };

  const template = `\u{1F396}${person.level}\u{2694}${person.attack}\u{1F6E1}${person.defence}\u{2764}${person.health}`;
  const expected = '\u{1F396}3\u{2694}25\u{1F6E1}25\u{2764}100';

  expect(template).toBe(expected);
});
