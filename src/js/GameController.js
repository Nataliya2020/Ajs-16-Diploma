import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import Bowman from './Characters/Bowman';
import Undead from './Characters/Undead';
import { generateTeam } from './generators';
import Swordsman from './Characters/Swordsman';
import Daemon from './Characters/Daemon';
import Magician from './Characters/Magician';
import Vampire from './Characters/Vampire';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';

const userCommandInit = [Swordsman, Bowman, Magician];
const pcCommandInit = [Daemon, Undead, Vampire];
const positionForUser = [];
const positionForPC = [];
const typePersonUser = ['bowman', 'swordsman', 'magician'];

function gettingAPositionForUser(boardSize) {
  const sizeBoard = boardSize * boardSize;

  for (let i = 0; i < sizeBoard; i += 1) {
    if (i % boardSize === 0) {
      positionForUser.push(i);
      positionForUser.push(i + 1);
    }
  }
}

function gettingAPositionForPC(boardSize) {
  const sizeBoard = boardSize * boardSize;

  for (let i = 0; i < sizeBoard; i += 1) {
    if ((i + 1) % boardSize === 0) {
      positionForPC.push(i);
      positionForPC.push(i - 1);
    }
  }
}

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = GameState.from({});
    this.command = [];
    this.userCommand = new Team();
    this.pcCommand = new Team();
    this.personIndex = null;
    this.moveIndex = null;
    this.activePlayer = 'user';
    this.totalUserPoints = 0;
    this.levelGame = 1;
  }

  init() {
    this.gettingAPositionForUser = gettingAPositionForUser(this.gamePlay.boardSize);
    this.gettingAPositionForUser = gettingAPositionForPC(this.gamePlay.boardSize);
    this.gamePlay.drawUi(themes.prairie);
    this.userCommand.addAll(...generateTeam(userCommandInit, 1, 2));
    this.pcCommand.addAll(...generateTeam(pcCommandInit, 1, 2));
    this.gettingACommand(this.userCommand, positionForUser);
    this.gettingACommand(this.pcCommand, positionForPC);
    this.gamePlay.redrawPositions(this.command);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.startNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveCurrentGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
  }

  startNewGame() {
    GamePlay.showMessage('Новая игра');
    GamePlay.showMessage(`Количество набранных баллов равно ${this.state.totalUserPoints}`);
    this.gamePlay.blockedTheField();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.drawUi(themes.prairie);
    this.command = [];
    this.levelGame = 1;
    this.userCommand = new Team();
    this.pcCommand = new Team();
    this.userCommand.addAll(...generateTeam(userCommandInit, 1, 2));
    this.pcCommand.addAll(...generateTeam(pcCommandInit, 1, 2));
    this.gettingACommand(this.userCommand, positionForUser);
    this.gettingACommand(this.pcCommand, positionForPC);
    this.activePlayer = 'user';
    this.personIndex = null;
    this.gamePlay.redrawPositions(this.command);
  }

  saveCurrentGame() {
    const saveTheGame = {
      levelGame: this.levelGame,
      activePlayer: this.activePlayer,
      command: this.command,
      userCommand: this.userCommand,
      totalUserPoints: this.totalUserPoints,
    };

    this.stateService.save(saveTheGame);
    GamePlay.showMessage('игра сохранена');
  }

  loadGame() {
    GamePlay.showMessage('Игра загружена');
    GamePlay.showMessage(`Количество общих баллов за игру = ${this.state.totalUserPoints}`);
    this.gamePlay.blockedTheField();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.personIndex = null;
    const gameLoad = (this.stateService.load());
    this.levelGame = gameLoad.levelGame;
    this.activePlayer = gameLoad.activePlayer;
    this.totalUserPoints = gameLoad.totalUserPoints;
    this.userCommand = new Team();
    this.pcCommand = new Team();

    this.command = gameLoad.command.reduce((team, person) => {
      let personClass;

      if (person.character.type === 'bowman') {
        personClass = new Bowman(person.character.level);
      }

      if (person.character.type === 'swordsman') {
        personClass = new Swordsman(person.character.level);
      }

      if (person.character.type === 'magician') {
        personClass = new Magician(person.character.level);
      }

      if (person.character.type === 'daemon') {
        personClass = new Daemon(person.character.level);
      }

      if (person.character.type === 'vampire') {
        personClass = new Vampire(person.character.level);
      }

      if (person.character.type === 'undead') {
        personClass = new Undead(person.character.level);
      }

      personClass.health = person.character.health;
      personClass.attack = person.character.attack;
      personClass.defence = person.character.defence;
      personClass.position = person.position;

      if (person.character.type === 'bowman' || person.character.type === 'swordsman' || person.character.type === 'magician') {
        this.userCommand.add(personClass);
      } else {
        this.pcCommand.add(personClass);
      }

      const personTeam = new PositionedCharacter(personClass, person.position);
      team.push(personTeam);
      return team;
    }, []);

    if (this.levelGame === 1) {
      this.gamePlay.drawUi(themes.prairie);
    }
    if (this.levelGame === 2) {
      this.gamePlay.drawUi(themes.desert);
    }
    if (this.levelGame === 3) {
      this.gamePlay.drawUi(themes.arctic);
    }
    if (this.levelGame === 4) {
      this.gamePlay.drawUi(themes.mountain);
    }
    this.gamePlay.redrawPositions(this.command);
    this.gamePlay.deselectCell(this.personIndex);
  }

  searchForAPersonInTheTeam(index) {
    return this.command.some((person) => person.position === index);
  }

  getPersonType(index) {
    const personType = this.command.find((person) => person.position === index);
    return personType.character.type;
  }

  gettingARandomPosition(position) {
    let pos = position[Math.floor(Math.random() * position.length)];

    while (this.searchForAPersonInTheTeam(pos)) {
      pos = position[Math.floor(Math.random() * position.length)];
    }
    return pos;
  }

  gettingACommand(team, position) {
    for (const person of team) {
      this.command.push(new PositionedCharacter(person, this.gettingARandomPosition(position)));
    }
  }

  gameLevelUp() {
    this.activePlayer = 'user';
    this.command = [];

    for (const person of this.userCommand) {
      person.levelUp();
    }

    if (this.levelGame === 2) {
      this.gamePlay.drawUi(themes.desert);

      this.userCommand.addAll(...generateTeam(userCommandInit, 1, 1));
      this.pcCommand.addAll(...generateTeam(pcCommandInit, 2, this.userCommand.members.size));
    }

    if (this.levelGame === 3) {
      this.gamePlay.drawUi(themes.arctic);

      this.userCommand.addAll(...generateTeam(userCommandInit, 2, 2));
      this.pcCommand.addAll(...generateTeam(pcCommandInit, 3, this.userCommand.members.size));
    }

    if (this.levelGame === 4) {
      this.gamePlay.drawUi(themes.mountain);

      this.userCommand.addAll(...generateTeam(userCommandInit, 3, 2));
      this.pcCommand.addAll(...generateTeam(pcCommandInit, 4, this.userCommand.members.size));
    }
    this.gettingACommand(this.userCommand, positionForUser);
    this.gettingACommand(this.pcCommand, positionForPC);
    this.gamePlay.redrawPositions(this.command);
  }

  winCheck() {
    if (this.pcCommand.members.size === 0 && this.levelGame <= 3) {
      this.activePlayer = 'user';
      const levelPoints = [...this.userCommand].reduce((acc, item) => {
        let sumHealth = acc;
        sumHealth += item.health;
        return sumHealth;
      }, 0);
      this.totalUserPoints += levelPoints;

      this.state.totalUserPoints = this.totalUserPoints;
      this.state.levelGame = this.levelGame + 1;
      this.state.levelUserPoint = levelPoints;

      this.levelGame += 1;
      GamePlay.showMessage(`Вы победили. Переход на уровень ${this.levelGame}. Количество общих баллов ${this.totalUserPoints}. Баллы за уровень  = ${levelPoints}`);
      this.gameLevelUp();
    }

    if (this.pcCommand.members.size === 0 && this.levelGame === 4) {
      GamePlay.showMessage(`Поздравляем! Вы прошли все уровни. Количество бонусов зв игру - ${this.totalUserPoints}`);
      this.activePlayer = 'user';
      this.gamePlay.blockedTheField();
    }

    if (this.userCommand.members.size === 0) {
      this.activePlayer = 'user';
      GamePlay.showMessage(`Победил компьютер. Ваше количество набранных за игру баллов = ${this.totalUserPoints}`);
      this.gamePlay.blockedTheField();
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.levelGame === 5 || this.userCommand.members.size === 0) {
      return;
    }

    if (this.activePlayer === 'PC') {
      GamePlay.showError('Ход противника');
      return;
    }

    if (this.personIndex === null) {
      if (!this.searchForAPersonInTheTeam(index)) {
        GamePlay.showError('Выберите персонажа');
      }
      if (this.searchForAPersonInTheTeam(index)
      && !typePersonUser.includes(this.getPersonType(index))) {
        GamePlay.showError('Персонаж другой команды');
      }
    }

    if (this.personIndex === null
      && this.searchForAPersonInTheTeam(index)
      && typePersonUser.includes(this.getPersonType(index))) {
      this.gamePlay.selectCell(index);
      this.personIndex = index;
    } else if (index !== this.personIndex
        && this.searchForAPersonInTheTeam(index)
        && typePersonUser.includes(this.getPersonType(index))) {
      this.gamePlay.deselectCell(this.personIndex);
      this.gamePlay.selectCell(index);
      this.personIndex = index;
    } else if (index === this.personIndex
      && this.searchForAPersonInTheTeam(index)
      && typePersonUser.includes(this.getPersonType(index))) {
      this.gamePlay.selectCell(this.personIndex);
    }

    if ((this.personIndex !== null
      && !this.distanceCalculation(this.personIndex).includes(index)
      && !this.attackCalculation(this.personIndex).includes(index)
      && this.searchForAPersonInTheTeam(index)
      && !typePersonUser.includes(this.getPersonType(index)))
      || (this.personIndex !== null
        && !this.distanceCalculation(this.personIndex).includes(index)
        && !this.searchForAPersonInTheTeam(index))) {
      this.gamePlay.deselectCell(index);
      this.gamePlay.selectCell(this.personIndex);
      GamePlay.showError('Недопустимый ход');
    }

    if (this.personIndex !== null) {
      if (this.distanceCalculation(this.personIndex).includes(index)
        && !this.searchForAPersonInTheTeam(index)) {
        this.findPerson(this.personIndex).position = index;
        this.gamePlay.deselectCell(this.personIndex);
        this.gamePlay.deselectCell(index);
        this.personIndex = index;
        this.gamePlay.selectCell(this.personIndex);
        this.gamePlay.redrawPositions(this.command);
        this.activePlayer = 'PC';

        this.movePC();
      } else if (this.attackCalculation(this.personIndex).includes(index)
        && this.searchForAPersonInTheTeam(index)
        && !typePersonUser.includes(this.getPersonType(index))) {
        this.enemyAttack(index, this.personIndex);
        this.gamePlay.selectCell(this.personIndex);
        this.gamePlay.deselectCell(index);
        this.activePlayer = 'PC';
      }
    }
  }

  enemyAttack(indexTarget, indexAttacker) {
    const target = this.findPerson(indexTarget);
    const attacker = this.findPerson(indexAttacker);
    const damageDone = Math.max(attacker.character.attack - target.character.defence,
      attacker.character.attack * 0.1);

    this.gamePlay.showDamage(indexTarget, damageDone).then(() => {
      target.character.health -= damageDone;
    }).then(() => {
      if (target.character.health <= 0) {
        this.command.splice(this.command.indexOf(this.findPerson(target.position)), 1);
        this.pcCommand.delete(target.character);
        this.gamePlay.deselectCell(target.position);
      }
    }).then(() => {
      this.gamePlay.redrawPositions(this.command);
      this.winCheck();
    })
      .then(() => {
        this.movePC();
      })
      .catch((e) => {
        GamePlay.showError(e);
      });
  }

  endGame() {
    GamePlay.showMessage(`Игра закончена. Количество заработанных бонусов ${this.totalUserPoints}`);
  }

  movePC() {
    if (this.activePlayer !== 'PC') {
      return;
    }
    let userInAttackPC = null;

    const teamPC = this.command.filter((item) => item.character instanceof Daemon
      || item.character instanceof Undead
      || item.character instanceof Vampire);

    const teamUser = this.command.filter((item) => item.character instanceof Swordsman
      || item.character instanceof Bowman
      || item.character instanceof Magician);

    const memberPC = teamPC[Math.floor(Math.random() * teamPC.length)];
    const cellsMovePC = this.distanceCalculation(memberPC.position);
    const cellsAttackPC = this.attackCalculation(memberPC.position);

    teamUser.forEach((item) => {
      if (cellsAttackPC.includes(item.position)) {
        userInAttackPC = item;
      }
    });

    if (userInAttackPC) {
      const damageDone = Math.max(memberPC.character.attack - userInAttackPC.character.defence,
        memberPC.character.attack * 0.1);

      this.gamePlay.showDamage(userInAttackPC.position, damageDone).then(() => {
        userInAttackPC.character.health -= damageDone;
      }).then(() => {
        if (userInAttackPC.character.health <= 0) {
          this.command.splice(this.command.indexOf(this.findPerson(userInAttackPC.position)), 1);
          this.userCommand.delete(userInAttackPC.character);
          this.gamePlay.deselectCell(userInAttackPC.position);
          this.gamePlay.deselectCell(memberPC.position);
        }
      }).then(() => {
        this.gamePlay.redrawPositions(this.command);
        this.winCheck();
        this.activePlayer = 'user';
      })
        .catch((error) => GamePlay.showMessage(error));
    } else {
      this.gamePlay.deselectCell(this.findPerson(memberPC.position).position);
      this.findPerson(memberPC.position).position = this.gettingARandomPosition(cellsMovePC);
      this.gamePlay.redrawPositions(this.command);
      this.activePlayer = 'user';
    }
  }

  findPerson(index) {
    return this.command.find((person) => person.position === index);
  }

  distanceCalculation(index) {
    const { boardSize } = this.gamePlay;
    let moves = [];
    const person = this.findPerson(index);

    const dist = person.character.distance;

    for (let i = 1; i <= dist; i += 1) {
      if (index % boardSize === 0) {
        moves.push(index + i);
        moves.push(index + i * boardSize);
        moves.push(index - i * boardSize);
        moves.push(index + i * (boardSize + 1));
        moves.push(index - i * (boardSize - 1));
      } else if ((index + 1) % boardSize === 0) {
        moves.push(index - i);
        moves.push(index + i * boardSize);
        moves.push(index - i * boardSize);
        moves.push(index - i * (boardSize + 1));
        moves.push(index + i * (boardSize - 1));
      } else {
        // по горизонтали
        for (let j = 1; j <= dist; j += 1) {
          if ((index - j) % boardSize === 0) {
            if (!moves.includes(index - j)) {
              moves.push(index - j);
            }
            break;
          }
          if (!moves.includes(index - j)) {
            moves.push(index - j);
          }
        }

        for (let j = 1; j <= dist; j += 1) {
          if (((index + j) + 1) % boardSize === 0) {
            if (!moves.includes(index + j)) {
              moves.push(index + j);
            }
            break;
          }
          if (!moves.includes(index + j)) {
            moves.push(index + j);
          }
        }

        // по вертикали
        for (let j = 1; j <= dist; j += 1) {
          if (!moves.includes(index + (boardSize * j))) {
            moves.push(index + (boardSize * j));
          }
          if (!moves.includes(index - (boardSize * j))) {
            moves.push(index - (boardSize * j));
          }
        }

        // по диагонали
        for (let j = 1; j <= dist; j += 1) {
          if ((index - j - boardSize * j) % boardSize === 0) {
            if (!moves.includes(index - j - boardSize * j)) {
              moves.push(index - j - boardSize * j);
            }
            break;
          }

          if (!moves.includes(index - j - boardSize * j)) {
            moves.push(index - j - boardSize * j);
          }
        }

        for (let j = 1; j <= dist; j += 1) {
          if ((((index - j + boardSize * j) % boardSize === 0))) {
            if (!moves.includes(index - j + boardSize * j)) {
              moves.push(index - j + boardSize * j);
            }
            break;
          }

          if (!moves.includes(index - j + boardSize * j)) {
            moves.push(index - j + boardSize * j);
          }
        }

        for (let j = 1; j <= dist; j += 1) {
          if (((index + j + boardSize * j) + 1) % boardSize === 0) {
            if (!moves.includes(index + j + boardSize * j)) {
              moves.push((index + j + boardSize * j));
            }
            break;
          }

          if (!moves.includes(index + j + boardSize * j)) {
            moves.push((index + j + boardSize * j));
          }
        }

        for (let j = 1; j <= dist; j += 1) {
          if (((index + j - boardSize * j) + 1) % boardSize === 0) {
            if (!moves.includes(index + j - boardSize * j)) {
              moves.push((index + j - boardSize * j));
            }
            break;
          }

          if (!moves.includes(index + j - boardSize * j)) {
            moves.push((index + j - boardSize * j));
          }
        }
      }
    }

    moves = moves.filter((move) => move >= 0 && move <= 63);
    moves.sort((a, b) => a - b);
    return moves;
  }

  attackCalculation(index) {
    const { boardSize } = this.gamePlay;
    let attackCells = [];
    const person = this.findPerson(index);
    const attack = person.character.attackRange;

    for (let i = 1; i <= attack; i += 1) {
      if (index % boardSize === 0) {
        attackCells.push(index + i);
        attackCells.push(index + i * boardSize);
        attackCells.push(index - i * boardSize);
        attackCells.push(index + i * (boardSize + 1));
        attackCells.push(index - i * (boardSize - 1));
      } else if ((index + 1) % boardSize === 0) {
        attackCells.push(index - i);
        attackCells.push(index + i * boardSize);
        attackCells.push(index - i * boardSize);
        attackCells.push(index - i * (boardSize + 1));
        attackCells.push(index + i * (boardSize - 1));
      } else {
        // по горизонтали
        for (let j = 1; j <= attack; j += 1) {
          if ((index - j) % boardSize === 0) {
            if (!attackCells.includes(index - j)) {
              attackCells.push(index - j);
            }
            break;
          }
          if (!attackCells.includes(index - j)) {
            attackCells.push(index - j);
          }
        }

        for (let j = 1; j <= attack; j += 1) {
          if (((index + j) + 1) % boardSize === 0) {
            if (!attackCells.includes(index + j)) {
              attackCells.push(index + j);
            }
            break;
          }
          if (!attackCells.includes(index + j)) {
            attackCells.push(index + j);
          }
        }

        // по вертикали
        for (let j = 1; j <= attack; j += 1) {
          if (!attackCells.includes(index + (boardSize * j))) {
            attackCells.push(index + (boardSize * j));
          }
          if (!attackCells.includes(index - (boardSize * j))) {
            attackCells.push(index - (boardSize * j));
          }
        }

        // по диагонали
        for (let j = 1; j <= attack; j += 1) {
          if ((index - j - boardSize * j) % boardSize === 0) {
            if (!attackCells.includes(index - j - boardSize * j)) {
              attackCells.push(index - j - boardSize * j);
            }
            break;
          }
          if (!attackCells.includes(index - j - boardSize * j)) {
            attackCells.push(index - j - boardSize * j);
          }
        }

        for (let j = 1; j <= attack; j += 1) {
          if ((((index - j + boardSize * j) % boardSize === 0))) {
            if (!attackCells.includes(index - j + boardSize * j)) {
              attackCells.push(index - j + boardSize * j);
            }
            break;
          }

          if (!attackCells.includes(index - j + boardSize * j)) {
            attackCells.push(index - j + boardSize * j);
          }
        }

        for (let j = 1; j <= attack; j += 1) {
          if (((index + j + boardSize * j) + 1) % boardSize === 0) {
            if (!attackCells.includes(index + j + boardSize * j)) {
              attackCells.push((index + j + boardSize * j));
            }
            break;
          }

          if (!attackCells.includes(index + j + boardSize * j)) {
            attackCells.push((index + j + boardSize * j));
          }
        }

        for (let j = 1; j <= attack; j += 1) {
          if (((index + j - boardSize * j) + 1) % boardSize === 0) {
            if (!attackCells.includes(index + j - boardSize * j)) {
              attackCells.push((index + j - boardSize * j));
            }
            break;
          }

          if (!attackCells.includes(index + j - boardSize * j)) {
            attackCells.push((index + j - boardSize * j));
          }
        }
      }
    }

    attackCells = attackCells.filter((cell) => cell >= 0 && cell <= 63);
    attackCells.sort((a, b) => a - b);
    return attackCells;
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.searchForAPersonInTheTeam(index)) {
      const personCurrent = this.findPerson(index);
      const message = `\u{1F396}${personCurrent.character.level}\u{2694}${personCurrent.character.attack}\u{1F6E1}${personCurrent.character.defence}\u{2764}${personCurrent.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }

    if (this.personIndex === null) {
      if (this.searchForAPersonInTheTeam(index)
        && typePersonUser.includes(this.getPersonType(index))) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (this.searchForAPersonInTheTeam(index)
        && !typePersonUser.includes(this.getPersonType(index))) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }

    if (this.personIndex !== null) {
      if (index === this.personIndex) {
        this.gamePlay.selectCell(this.personIndex);
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (this.searchForAPersonInTheTeam(index)
        && typePersonUser.includes(this.getPersonType(index))) {
        this.gamePlay.deselectCell(this.moveIndex);
        this.moveIndex = null;
        this.gamePlay.selectCell(this.personIndex);
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (this.searchForAPersonInTheTeam(index)
        && typePersonUser.includes(this.getPersonType(index))
      && index !== this.personIndex) {
        this.gamePlay.deselectCell(index);
      } else if (this.searchForAPersonInTheTeam(index)
        && !typePersonUser.includes(this.getPersonType(index))
      && !this.attackCalculation(this.personIndex).includes(index)) {
        this.gamePlay.setCursor(cursors.notallowed);
      } else if (this.searchForAPersonInTheTeam(index)
        && !typePersonUser.includes(this.getPersonType(index))
        && this.attackCalculation(this.personIndex).includes(index)) {
        if (this.moveIndex === null) {
          this.moveIndex = index;
        } else {
          this.gamePlay.deselectCell(this.moveIndex);
          this.gamePlay.selectCell(this.personIndex);
          this.moveIndex = index;
        }
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
      } else if (!this.searchForAPersonInTheTeam(index)
        && this.distanceCalculation(this.personIndex).includes(index)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
        if (this.moveIndex === null) {
          this.moveIndex = index;
        } else {
          this.gamePlay.deselectCell(this.moveIndex);
          this.gamePlay.selectCell(this.personIndex);
          this.moveIndex = index;
        }
      } else if (!this.searchForAPersonInTheTeam(index)
        && !this.distanceCalculation(this.personIndex).includes(index)
      && !this.attackCalculation(this.personIndex).includes(index)) {
        this.gamePlay.deselectCell(this.moveIndex);
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}
