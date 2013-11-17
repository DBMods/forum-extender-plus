if ([0, 1, 11].indexOf(date.month) > -1)
	snowfall();

/*
 * Snowfall jQuery plugin
 *
 * ====================================================================
 * LICENSE
 * ====================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ====================================================================
 *
 * Developed by Jason Brown
 * Email: loktar69@hotmail
 * Info: somethinghitme.com
 *
 * Modified for Greasemonkey by Andy Yasger
 */

function snowfall() {
	var options = {
		flakeCount: 100,
		flakeColor: '#eee',
		minSize: 2,
		maxSize: 6,
		minSpeed: 1,
		maxSpeed: 5,
		collection: false,
		collectionHeight: 40,
	};

	function random(min, max) {
		return Math.round(min + Math.random() * (max - min));
	};

	$('body').data("snowfall", this);

	//Snowflake object
	function Flake(_x, _y, _size, _speed, _id) {
		//Flake properties
		this.id = _id;
		this.x = _x;
		this.y = _y;
		this.size = _size;
		this.speed = _speed;
		this.step = 0;
		this.stepSize = random(1, 10) / 100;

		if (options.collection)
			this.target = canvasCollection[random(0, canvasCollection.length - 1)];

		$('body').append('<div id="flake-' + this.id + '" class="snowfall-flakes" />')
		$('#flake-' + this.id).css({
			'width': this.size,
			'height': this.size,
			'top': this.y,
			'left': this.x
		});

		this.element = document.getElementById('flake-' + this.id);

		//Update snowflakes and check current snowflake against bounds
		this.update = function() {
			this.y += this.speed;

			if (this.y > (elHeight) - (this.size + 6))
				this.reset();

			this.element.style.top = this.y + 'px';
			this.element.style.left = this.x + 'px';

			this.step += this.stepSize;

			this.x += Math.cos(this.step);

			//Pileup check
			if (options.collection && this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y) {
				var ctx = this.target.element.getContext("2d"), curX = this.x - this.target.x, curY = this.y - this.target.y, colData = this.target.colData;

				if (colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] !== undefined || curY + this.speed + this.size > this.target.height) {
					if (curY + this.speed + this.size > this.target.height) {
						while (curY + this.speed + this.size > this.target.height && this.speed > 0) {
							this.speed *= .5;
						}

						ctx.fillStyle = "#fff";

						if (colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] == undefined) {
							colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] = 1;
							ctx.fillRect(curX, (curY) + this.speed + this.size, this.size, this.size);
						} else {
							colData[parseInt(curX)][parseInt(curY + this.speed)] = 1;
							ctx.fillRect(curX, curY + this.speed, this.size, this.size);
						}
						this.reset();
					} else {
						//Flow to sides
						this.speed = 1;
						this.stepSize = 0;

						if (parseInt(curX) + 1 < this.target.width && colData[parseInt(curX)+1][parseInt(curY) + 1] == undefined)
							this.x++;
						else if (parseInt(curX) - 1 > 0 && colData[parseInt(curX)-1][parseInt(curY) + 1] == undefined)
							this.x--;
						else {
							//Stop
							ctx.fillStyle = "#fff";
							ctx.fillRect(curX, curY, this.size, this.size);
							colData[parseInt(curX)][parseInt(curY)] = 1;
							this.reset();
						}
					}
				}
			}

			if (this.x > (elWidth) - widthOffset || this.x < widthOffset)
				this.reset();
		}
		//Reset snowflake upon reach of set bounds
		this.reset = function() {
			this.y = 0;
			this.x = random(widthOffset, elWidth - widthOffset);
			this.stepSize = random(1, 10) / 100;
			this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
			this.speed = random(options.minSpeed, options.maxSpeed);
		}
	}

	//Local vars
	var flakes = [], flakeId = 0, i = 0, elHeight = $('body').height(), elWidth = $('body').width(), widthOffset = 0, snowTimeout = 0;

	//Collection Piece
	if (options.collection !== false) {
		var testElem = document.createElement('canvas');
		if (!!(testElem.getContext && testElem.getContext('2d'))) {
			var canvasCollection = [], elements = $(options.collection), collectionHeight = options.collectionHeight;

			for (var i = 0; i < elements.length; i++) {
				var bounds = elements[i].getBoundingClientRect(), canvas = document.createElement('canvas'), collisionData = [];

				if (bounds.top - collectionHeight > 0) {
					document.body.appendChild(canvas);
					canvas.style.position = 'absolute';
					canvas.height = collectionHeight;
					canvas.width = bounds.width;
					canvas.style.left = bounds.left + 'px';
					canvas.style.top = bounds.top - collectionHeight + 'px';

					for (var w = 0; w < bounds.width; w++) {
						collisionData[w] = [];
					}

					canvasCollection.push({
						element: canvas,
						x: bounds.left,
						y: bounds.top - collectionHeight,
						width: bounds.width,
						height: collectionHeight,
						colData: collisionData
					});
				}
			}
		} else
			//Canvas element not supported
			options.collection = false;
	}

	//Prevent horizontal scroll bar
	widthOffset = 25;

	//Bind window resize event to get innerHeight again
	$(window).bind("resize", function() {
		elHeight = $('body').clientHeight;
		elWidth = $('body').offsetWidth;
		console.log(elHeight);
	});
	//Initialize flakes
	for ( i = 0; i < options.flakeCount; i += 1) {
		flakeId = flakes.length;
		flakes.push(new Flake(random(widthOffset, elWidth - widthOffset), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed), flakeId));
	}

	$('.snowfall-flakes').css({
		'border-radius': options.maxSize,
		'box-shadow': '1px 1px 1px #aaa',
		'background': options.flakeColor,
		'position': 'absolute',
		'fontSize': 0,
		'zIndex': 999999
	});

	//Control flow of updating snow
	function snow() {
		for ( i = 0; i < flakes.length; i += 1) {
			flakes[i].update();
		}
		snowTimeout = setTimeout(function() {
			snow();
		}, 30);
	}

	snow();

	//Clear snowflakes
	this.clear = function() {
		$('.snowfall-flakes').remove();
		flakes = [];
		clearTimeout(snowTimeout);
	};
};