

// CLASSES

/**
 * The snake object.
 */
function Snake() {
    this.elementRef; // A reference to the Snake element.
    this.scales; // {Scale[]} An array of scales.

    this.elementRef = document.getElementById('snake');

    this.grow = function () {
        var scale = this.generateScale();

        this.elementRef.append(scale.getRef());

        if (!this.scales) {
            this.scales = [scale];
        } else {
            this.scales.push(scale);
        }
    }

    this.move = function (direction) {
        this.scales[0].direction = direction;

        var me = this;
        function frame() {
            // Base case: check for valididty.
            if (!me.isInValidState()) {

                // Reset game.
                clearInterval(me.interval);
                me.scales.forEach(scale => {
                    scale.getRef().remove();
                });
                me.scales = null;
                
                me.grow();
            }

            for (var i = 0; i < me.scales.length; i++) {
                var newX = framework.getElementPos(me.scales[i].getRef(), 'left');
                var newY = framework.getElementPos(me.scales[i].getRef(), 'top');

                if (me.scales[i].direction === 'right') {
                    var x = framework.getElementPos(me.scales[i].getRef(), 'left');
                    me.scales[i].getRef().style.left = (x + 15) + 'px';
                    newX = x + 15;
                } else if (me.scales[i].direction === 'left') {
                    var x = framework.getElementPos(me.scales[i].getRef(), 'left');
                    me.scales[i].getRef().style.left = (x - 15) + 'px';
                    newX = x - 15;
                } else if (me.scales[i].direction === 'down') {
                    var y = framework.getElementPos(me.scales[i].getRef(), 'top');
                    me.scales[i].getRef().style.top = (y + 15) + 'px';
                    newY = y + 15;
                } else if (me.scales[i].direction === 'up') {
                    var y = framework.getElementPos(me.scales[i].getRef(), 'top');
                    me.scales[i].getRef().style.top = (y - 15) + 'px';
                    newY = y - 15;
                }

                if (i === 0 && me.hasCollidedWithApple(newX, newY)) {
                    app.apple.move();
                    me.grow();
                }
            }

            for (var i = me.scales.length - 1; i > 0; i--) {
                me.scales[i].direction = me.scales[i-1].direction;
            }
        }
        this.interval = setInterval(frame, 75);
    }

    this.generateScale = function () {
        var node = document.createElement('div');
        node.classList.add('scale');

        if (this.scales) {

            // This scale is being appended to a list of scales.
            var tail = this.scales[this.scales.length - 1];
            var tailX = framework.getElementPos(tail.getRef(), 'left');
            var tailY = framework.getElementPos(tail.getRef(), 'top');

            var offset = this.scales.length === 1 ? 30 : 15;

            if (tail.direction === 'right') {

                // Place the next scale trailing to the left.
                node.style.left = tailX - offset + 'px';
                node.style.top = tailY + 'px';
            } else if (tail.direction === 'left') {

                // Place the next scale trailing to the left.
                node.style.left = tailX + offset + 'px';
                node.style.top = tailY + 'px';
            } else if (tail.direction === 'up') {

              // Place the next scale trailing from the bottom.
              node.style.left = tailX + 'px';
              node.style.top = tailY + offset + 'px';  
            } else if (tail.direction === 'down') {

              // Place the next scale trailing from the top.
              node.style.left = tailX + 'px';
              node.style.top = tailY - offset + 'px';  
            }
            
            return new Scale(node, tail.direction);
        } else {
            return new Scale(node);
        }
    }

    this.hasCollidedWithApple = function (x, y) {
        var appleRef = document.getElementsByClassName('apple')[0];
        var appleX = framework.getElementPos(appleRef, 'left');
        var appleY = framework.getElementPos(appleRef, 'top');

        if (x === appleX && y === appleY) {
            return true
        }

        return false;
    }

    this.isInValidState = function () {

        // Check if the snake has reached a border.
        var x = framework.getElementPos(this.scales[0].getRef(), 'left');
        var y = framework.getElementPos(this.scales[0].getRef(), 'top');


        if (y < 0) {

            // The snake has collided with the top border.
            return false;
        }

        if (x < 0) {

            // The snake has collided with the left border.
            return false;
        }

        if (x > window.innerWidth) {
            // The snake has collided with the right border.
            return false;
        }

        if (y > window.innerHeight) {

            // The snake has collided with the bottom border.
            return false;
        }

        // Check if the snake has collided with itself.
       for (var i = 1; i < this.scales.length; i++) {
           var scaleX = framework.getElementPos(this.scales[i].getRef(), 'left');
           var scaleY = framework.getElementPos(this.scales[i].getRef(), 'top');
           

           if (x === scaleX && y === scaleY) {
               return false;
           }
       }

        return true;
    }

    this.grow.apply(this); // Initialize with the first scale on new.

    var me = this;
    window.onkeyup = function (e) {
        clearInterval(me.interval);

        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 39) {
            me.move('right');
        } else if (key == 40) {
            me.move('down');
        } else if (key == 37) {
            me.move('left');
        } else if (key == 38) {
            me.move('up');
        }
    }
}

/**
 * A single Scale (a link in the chain of nodes making up the Snake).
 * @param {HTMLElement} elementRef 
 */
function Scale(elementRef, direction) {
    this.direction = direction; // The direction that the Scale is moving in (up, down, left, right).

    this.getRef = function () {
        return elementRef;
    }
}

function Apple() {

    this.generate = function () {
        var x = Math.floor(Math.random() * ((window.innerWidth / 15) - 2)) * 15;
        var y = Math.floor(Math.random() * ((window.innerHeight / 15) - 2)) * 15;

        var node = document.createElement('div');
        node.classList.add('apple');

        document.getElementById('border').append(node);
        node.style.top = y + 'px';
        node.style.left = x + 'px';
    }

    this.move = function () {
        var x = Math.floor(Math.random() * (window.innerWidth / 15)) * 15;
        var y = Math.floor(Math.random() * (window.innerHeight / 15)) * 15;

        var appleRef = document.getElementsByClassName('apple')[0];
        appleRef.style.top = y + 'px';
        appleRef.style.left = x + 'px';
    }

    this.generate();
}

// FRAMEWORK

var framework = {}; // Isolate the framework scope within an object.

// Returns an integer representing an elements position, either top or left.
framework.getElementPos = function (el, edge) {
    if (edge === 'top') {
        return el.style.top ? parseInt(el.style.top.substring(0, el.style.top.length - 2)) : 0;
    }

    if (edge === 'left') {
        return el.style.left ? parseInt(el.style.left.substring(0, el.style.left.length - 2)) : 0;
    }
}


// APPLICATION

var app = {}; // Isolate the application within an object.

app.snake = new Snake();

app.apple = new Apple();