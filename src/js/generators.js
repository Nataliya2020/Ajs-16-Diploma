/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here

  while (true) {
    const randomClassSelection = Math.floor(Math.random() * allowedTypes.length);
    const randomLevel = 1 + Math.floor(Math.random() * maxLevel);
    yield new allowedTypes[randomClassSelection](randomLevel);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const character = characterGenerator(allowedTypes, maxLevel);

  const team = [];

  for (let i = 0; i < characterCount; i += 1) {
    team.push(character.next(i).value);
  }
  return team;
}
