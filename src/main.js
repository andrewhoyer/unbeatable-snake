import Snake from './snake.js';

var map_menu	= getMap('map-menu').copy();
var map_game	= getMap('map-1').copy();
var map_apples	= getMap('map-1').copy();

var bleeper = require('pixelbox/bleeper');

var snake = new Snake(map_game);

var gameState		= "start";
var level			= 1;
var highestlevel	= 0;

var enemies	= [];
var apples	= {};

// Menu

var menuSelected	= 1;
var difficulty		= 2;
var difficultyDelta	= 40;
var musicactive		= 1;

// Cut Scenes

var cutscenetimer = 3;

// Deltas

var deltaMove		= Date.now();
var deltacutScene	= Date.now();

// Start the audio
music('1984-by-frank-schroeter-from-filmmusic-io');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {

	if (gameState == "start") {

		// The main menu
		
		if (btnp.A) {
			// Start at level 1 from the menu
			resetLevel(1);
		} else if (btnp.up || btnp.upt ) {
			menuSelected = 1;
		} else if (btnp.down || btnp.downt) {
			menuSelected = 2;
		} else if (btnp.right || btnp.rightt) {
			
			if (menuSelected == 1) {
				difficulty++;
				if (difficulty > 3) {
					difficulty = 1;
				}
				
			} else if (menuSelected == 2) {
				musicactive++;
				if (musicactive > 1) {
					musicactive = 0;
				}
			}
			
		} else if (btnp.left || btnp.leftt) {

			if (menuSelected == 1) {
				difficulty--;
				if (difficulty < 1) {
					difficulty = 3;
				}
			} else if (menuSelected == 2) {
				musicactive--;
				if (musicactive < 0) {
					musicactive = 1;
				}
			}
			
		}
		
		// Draw the main menu screen
			
		cls();

		map_menu.draw(0,0);
		
		pen(7);
		print("UNBEATABLE SNAKE", 32, 18);
		
		// Position the option selector marker
		if (menuSelected == 1) {
			draw(assets.selectorbtn, 35, 49);
		} else {
			draw(assets.selectorbtn, 35, 59);
		}
	
		pen(1);
				
		if (difficulty == 1) {
			print("GAME: EASY", 42, 49);
		} else if (difficulty == 2) {
			print("GAME: NORMAL", 42, 49);		
		} else if (difficulty == 3) {
			print("GAME: HARD", 42, 49);
		}
		
		// Turn music on or off
		if (musicactive == 1) {
			print("MUSIC: ON", 42, 59);
			music('1984-by-frank-schroeter-from-filmmusic-io');
		} else if (musicactive == 0) {
			print("MUSIC: OFF", 42, 59);
			music();
		}

		print("SPACE to Start", 36, 107);
		

	} else if (gameState == "complete") {
		
		// Game over screen
		
		if (btnp.A) {
			// Starts the game over again
			resetLevel(1);
		} else if (btnp.M) {
			// Back to main menu
			gameState = "start";
		}
		
		cls();

		pen(7);
		print("UNBEATABLE SNAKE", 32, 18);

		pen(1);						
		print("M for Menu", 44, 92);
		print("SPACE to Start", 36, 107);

		print("LEVEL " + (level - 1), 47, 54);
		print("BEST  " + highestlevel, 47, 64);		

	} else if (gameState == "win") {
		
		// Displayed if user completest level 10
		
		if (btnp.M) {
			gameState = "start";
		}
		
		cls();

		pen(7);
		print("UNBEATABLE SNAKE", 32, 18);
		
		pen(1);
		print("OKAY MAYBE NOT", 37, 28);
		print("YOU WIN", 50, 38);

	
		pen(1);	
		print("M for Menu", 44, 92);

		print("LEVEL " + (level - 1), 47, 54);
		print("BEST  " + highestlevel, 47, 64);		

	} else if (gameState == "cutscene") {
		
		// Displays the cut scene between each level with a countdown
		
		let now = Date.now();
		
		let currentdelta = now - deltacutScene;
		
		if (currentdelta >= 1000) {
		
			cutscenetimer--;
			
			deltacutScene = now;
			
		}
		
		cls();

		pen(1);
		print("COMPLETED LEVEL " + (level - 1), 30, 44);

		pen(7);
		print("LOADING " + cutscenetimer, 45, 64);		
		
		// When the timer finishes, load the next level
		if (cutscenetimer <= 0) {
			resetLevel(level);
		}


	} else {
		
		// Main game loop
		
		let now = Date.now();
		
		let currentdelta = now - deltaMove;
	
		if (btn.right || btn.rightt) {
			snake.moveRight();
		} else if (btn.left || btn.leftt) {
			snake.moveLeft();
		} else if (btn.up || btn.upt) {
			snake.moveUp();
		} else if (btn.down || btn.downt) {
			snake.moveDown();
		}
	
		if (currentdelta >= difficultyDelta) {
	
			snake.update();
			
			let shouldContinue = true;
			
			// Check to see if snake has collided with walls or itself
			if (map_game.get(snake.x, snake.y)) { 
						
				shouldContinue = false;
				gameState = "complete";
			
				if (level - 1 > highestlevel) {
					highestlevel = level - 1;
				}
			
			} 
			
			// Check to see if snake has collided with an apple
			if (map_apples.get(snake.x, snake.y)) {
				if (map_apples.get(snake.x, snake.y).sprite == 4) { 
					// Apple
					
					snake.snake_length = snake.snake_length + 5;
					let thiskey = snake.x + '-' + snake.y;
					delete apples[thiskey]; 
					
					// If all apples have been eaten, go to the next level
					if (Object.keys(apples).length <= 0) {
						level++;
						gameState = "cutscene";
						
						if (level > 10) {
							gameState = "win";
							highestlevel = level - 1;
						}
						
					}
					
				} else if (map_apples.get(snake.x, snake.y).sprite == 5) { 
					// Collided with a leaf. Do nothing.
				}
				
			}							
			
			// Reset delta
			deltaMove = now;
					
		}
		
		// Display the main game
			
		cls();
		
		// Because the state of the game can be altered based on collisions, check
		// if game is not in another state before drawing this frame.
		if (gameState != "cutscene" && gameState != "win") {

			map_game	= getMap('map-' + level).copy();
			map_apples	= getMap('map-1').copy();
		
			snake.draw_self(map_game);

			for (const [key, applecoords] of Object.entries(apples)) {
				map_apples.set(applecoords['x'], applecoords['y'], 4);
				map_apples.set(applecoords['x'], applecoords['y'] - 1, 5);			
			}

			map_game.draw(0,0);
			map_apples.draw(0,0);
		
		}
		
	}
};


function resetLevel(tolevel) {

	snake.resetSnake();
	
	level = tolevel;
	// Do not reset highestlevel variable here

	map_game = getMap('map-' + level).copy();

	enemies	= [];
	apples	= {};
	
	let numberofapples = 5 * level;
	
	while (Object.keys(apples).length < numberofapples) {
	
		let possible_x = Math.floor(Math.random() * 64);
		let possible_y = Math.floor(Math.random() * 64);

		let thiskey = possible_x + '-' + possible_y;
		let thiskeyleaf = possible_x + '-' + (possible_y - 1);
		
		// Don't place an apple on another apple, or a leaf.
		if ( ! map_game.get(possible_x, possible_y) && ! apples[thiskey] && ! apples[thiskeyleaf]) {
			
			// Also, not on Snake's starting point.
			if (possible_x == snake.x && possible_y == snake.y) {
				// Ignore	
			} else {
			
				// Space is clear, add it.
				apples[thiskey] = {x: possible_x, y: possible_y};
				
			}
			
		}
	
	}

	// Set the speed of the snake based on difficulty level

	if (difficulty == 1) {
		difficultyDelta = 50;
	} else if (difficulty == 2) {
		difficultyDelta = 40;
	} else if (difficulty == 3	) {
		difficultyDelta = 30;
	}
	
	cutscenetimer = 4;
	
	gameState = "play";
	
	deltaMove = Date.now();	

}
