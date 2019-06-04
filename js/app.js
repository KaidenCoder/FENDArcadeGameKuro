let lifeNum = 3; //total lives of the hero

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.x <= 606) {
    this.x += this.speed * dt;
  } else {
    this.x = -101;
  }

  // If the enemy and the player collide.
  let xAxis = player.x - this.x;
  let yAxis = player.y - this.y;

  let distance = Math.sqrt(xAxis * xAxis + yAxis * yAxis);
  if (Math.round(distance) <= 60) {
    player.x = 303;
    player.y = 373.5;
    lifeNum = lifeNum - 1;
    totalLives(lifeNum);
  }
}

// Draws Enemy on screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player Creation
var Player = function(x, y) {
  this.x = x;
  this.y = y;
  //load the image
  this.sprite = 'images/char-boy.png';
}

let score = 0;
const scoreDisplay = document.getElementById("score-counter");
//counts the score
function totalScore(score) {
  score = score + 1000;
  scoreDisplay.innerHTML = score;
}

let level = 1;
const levelDisplay = document.getElementById("level-counter");
//Speeds up the enemy bugs
function levelUp() {
  if (score % 2 === 0) {
    //update level
    level += 1;
    levelDisplay.innerHTML = level;
    gems.push(new Gem(gemArray[Math.floor(Math.random() * 3)]));

    //increase speed
    for (let i = 0; i < allEnemies.length; i++) {
      allEnemies[i].speed = allEnemies[i].speed + 100;
    }
  }
}
//Player location update
Player.prototype.update = function() {
  if (this.y == -41.5) {
    this.x = 303;
    this.y = 373.5;
    totalScore(score);
    levelUp();
  }
}

// Draws Player on screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles the movement inputs
Player.prototype.handleInput = function(key) {
  if (key === 'left' && player.x > 0) {
    this.x = this.x - 101;
  } else if (key === 'right' && player.x < 505) {
    this.x = this.x + 101;
  } else if (key === 'up' && player.y > -41.5) {
    this.y = this.y - 83;
  } else if (key === 'down' && player.y < 373.5) {
    this.y = this.y + 83;
  }
}

//Gem creation
var Gem = function(sprite) {
  this.x = Math.floor(Math.random() * 400);
  this.y = Math.floor(Math.random() * 300);
  this.sprite = sprite;
}

//Draw gem on screen
Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Collect gems to increase points
Gem.prototype.collectGems = function() {
  let xAxis = player.x - this.x;
  let yAxis = player.y - this.y;

  let distance = Math.sqrt(xAxis * xAxis + yAxis * yAxis);
  if (Math.round(distance) <= 60) {
    if (this.sprite == "images/gem-green.png" || this.sprite == "images/gem-blue.png" || this.sprite == "images/gem-orange.png") {
      score += 1000;
    }
    //Increase the score if gem is collected
    totalScore(score);
    //Remove Gem object from gems array
    gems.splice(0, 1);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const enemy = new Enemy(0, 48, 150);
const enemy1 = new Enemy(0, 131, 200);
const enemy2 = new Enemy(0, 214, 250);

let allEnemies = [enemy, enemy1, enemy2];

const player = new Player(303, 373.5);

//gem array to store Gem objects
var gems = [];
var gemArray = ['images/gem-green.png', 'images/gem-blue.png', 'images/gem-orange.png'];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
let allowedKeys;
document.addEventListener('keyup', keyupListener);

function keyupListener(e) {
  allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
}

//flashes up after the game is over
function toggleModal() {
  const modal = document.getElementById("modal");

  if (modal.style.visibility == "visible") {
    modal.style.visibility = "hidden";
  } else {
    modal.style.visibility = "visible";
  }
}

//resets the score
function resetScorePanel() {
  score = 0;
  lifeNum = 3;
  level = 1;
  gems = [];

  scoreDisplay.innerHTML = score;
  levelDisplay.innerHTML = 1;

  document.getElementById("life3").style.display = "inline-block";
  document.getElementById("life2").style.display = "inline-block";
  document.getElementById("life1").style.display = "inline-block";
}

//play again button
document.getElementById("button").addEventListener('click', function() {
  //close modal
  toggleModal();

  //set player at initial position
  player.x = 303;
  player.y = 373.5;

  //set speed for enemies
  for (let i = 0; i < allEnemies.length; i++) {
    allEnemies[0].speed = 150;
    allEnemies[1].speed = 160;
    allEnemies[2].speed = 170;
  }
  //set player move
  document.addEventListener('keyup', keyupListener);

  //reset score panel
  resetScorePanel();

});

function totalLives(num) {
  if (lifeNum == 2) {
    document.getElementById("life3").style.display = "none";
  }
  if (lifeNum == 1) {
    document.getElementById("life2").style.display = "none";
  }

  //after losing the last life
  if (lifeNum <= 0) {
    document.getElementById("life1").style.display = "none";
    //modal appears
    toggleModal();
    document.getElementById("modal").querySelector("p").innerHTML = "Your score was " + score + " points";
    //enemies stop moving
    for (let i = 0; i < allEnemies.length; i++) {
      allEnemies[i].speed = 0;
    }
    //player stops moving
    document.removeEventListener('keyup', keyupListener);
  }
}
