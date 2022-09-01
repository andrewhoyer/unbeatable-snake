export default class Snake {

    constructor() {
		
		this._x = 32;
		this._y = 30;

		this._dir_x = 0;
		this._dir_y = -1;
		
		this._snake_length	= 20;
		this._snake_path	= [];
		
		this._snake_path.unshift({x: this._x, y: this._y});
		
    }
    
    moveRight() {
    	if (this._dir_x != -1) {
			this._dir_x = 1;
			this._dir_y = 0;
    	}
    }
    
    moveLeft() {
    	if (this._dir_x != 1) {
			this._dir_x = -1;
			this._dir_y = 0;
    	}
    }

    moveUp() {
	    if (this._dir_y != 1) {
			this._dir_x = 0;
			this._dir_y = -1;
    	}
    }
    
    moveDown() {
	    if (this._dir_y != -1) {
			this._dir_x = 0;
			this._dir_y = 1;
		}
    }
        
    update() {
    
    	this._x += this._dir_x;
    	this._y += this._dir_y;
    	
    	// Grows the snake until it reaches its maximum length.
    	// After that, it removes the last one on each update.
    	
    	if (this._snake_path.length < this._snake_length ) {
    	
    		// Add to the start of the array.
    		this._snake_path.unshift({x: this._x, y: this._y});
    	
    	} else {
    	
    		// Add to the start of the array.    	
    		this._snake_path.unshift({x: this._x, y: this._y});
    	
    		// Remove the last element of the array	
    		let last_segment = this._snake_path.pop();
    	
    	}

    }
    
    draw_self(map_game) {
    	
    	// Draws the full snake onto the map
    	this._snake_path.forEach(function (thissegment, thisindex, thisarr) {
    		map_game.set(thissegment['x'], thissegment['y'], 0, 0, 0, 0);
    	});
    
    }
    
    
	set x(value) {
		this._x = value;
	} 
    
    get x() {
    	return this._x;
    }
    
    set y(value) {
		this._y = value;
	} 
    
    get y() {
    	return this._y;
    }
    
    set snake_length(value) {
		this._snake_length = value;
	} 
    
    get snake_length() {
    	return this._snake_length;
    }    
    
	resetSnake() {
		this._x = 39;
		this._y = 56;

		this._dir_x = 0;
		this._dir_y = -1;
		
		this._snake_length = 20;
		this._snake_path = [];
		
		// Adds the starting point of the snake
		this._snake_path.unshift({x: this._x, y: this._y});
		
	}    
    
}
