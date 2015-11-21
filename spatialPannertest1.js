var ctx = new AudioContext();

var fps = 30;

var getSample = function(url, cb) {
	var request = new XMLHttpRequest();
	request.open('GET', url);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		ctx.decodeAudioData(request.response, cb);
	}
	request.send();
};

getSample('sounds/step-217476__agaxly__walk-3.wav', function(buffer){
	var player = ctx.createBufferSource()
	player.buffer = buffer
	player.loop = true
	player.connect(input)
	//player.start(ctx.currentTime)
});

var playerFootstepsBuffer;
var convolverBuffer;

getSample('sounds/step-217476__agaxly__walk-3.wav', function(buffer){
	playerFootstepsBuffer = buffer;
});

getSample('sounds/conv-alcuin_s1r1front_bformat.wav',function(buffer){
	convolverBuffer = buffer;
	convolver2.buffer = convolverBuffer;
});

var spatialPanner = ctx.createPanner();
var convolver = ctx.createConvolver();
var convolver2 = ctx.createConvolver();


var input = ctx.createGain();

input.connect(convolver);
convolver.connect(spatialPanner);
convolver2.connect(ctx.destination);
spatialPanner.connect(ctx.destination);


var playerStep = function() {
	var playerFootsteps = ctx.createBufferSource();
	playerFootsteps.buffer = playerFootstepsBuffer;
	playerFootsteps.connect(convolver2);
	playerFootsteps.start(ctx.currentTime, 0, .8);
	sounds.playerFootsteps = true;

	console.log('player footstep start');

	playerFootsteps.onended = function(){
		sounds.playerFootsteps = false;

	console.log('player footstep stop');
	};
}


$(window).keydown(function(e){
	if (userInput.keysDown.indexOf(e.keyCode) < 0) {
		userInput.keysDown.push(e.keyCode);
	}
});

$(window).keyup(function(e){
	if (userInput.keysDown.indexOf(e.keyCode) > -1) {
		userInput.keysDown.splice(userInput.keysDown.indexOf(e.keyCode), 1);
	}
});

var userInput = {
	keysDown : []
};

var sounds = { };

var sceneObjects = [
	{
		'name' : 'radio',
		'soundFile' : '262267__gowlermusic__radio-static.wav',
		'worldCoords' : {
			x: 300,
			z: 300,
		},
	},
	{
		'name' : 'radio',
		'soundFile' : '262267__gowlermusic__radio-static.wav',
		'worldCoords' : {
			x: 300,
			z: 300,
		},
	},
];

var player = {
	worldCoords: {
		x: 250,
		z: 300,
	}
};

var calculateDistance = function(x1, z1, x2, z2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((z2 - z1), 2));
}

var eventLoop = function() {

	/** player's walking sound **/
	$('div#keysDown').html(JSON.stringify(userInput.keysDown));
	if (userInput.keysDown.indexOf(87) > -1 || // key w
	userInput.keysDown.indexOf(83) > -1 || // key s
	userInput.keysDown.indexOf(65) > -1 || // key a
	userInput.keysDown.indexOf(68) > -1) { // key d
		userInput.walking = true;

		if (userInput.keysDown.indexOf(87) > -1) {
			player.worldCoords.z += 0.5;
		}

		if (userInput.keysDown.indexOf(83) > -1) {
			player.worldCoords.z -= 0.5;
		}

		if (userInput.keysDown.indexOf(65) > -1) {
			player.worldCoords.x -= 0.5;
		}

		if (userInput.keysDown.indexOf(68) > -1) {
			player.worldCoords.x += 0.5;
		}

		console.log(player.worldCoords);

	}  else {
		userInput.walking = false;
	}

	if (userInput.walking === true && sounds.playerFootsteps !== true) {
		playerStep();
	}

	/** triangulate distance of sceneObjects relative to player **/
	var maxHearingDistance = 50;

	sceneObjects.forEach(function(object){
		// if enter or exit range, start or stop buffer
		var d = calculateDistance(
			object.worldCoords.x, object.worldCoords.z,
			player.worldCoords.x, player.worldCoords.z
		);


		if (d < maxHearingDistance && !sounds[object.name]) {
			sounds[object.name] = true;
			// start sound

			getSample('sounds/' + object.soundFile, function(buffer){
				object.bs = ctx.createBufferSource();
				object.bs.buffer = buffer;
				object.panner = ctx.createPanner();
				object.bs.connect(object.panner);
				object.panner.connect(ctx.destination);
				object.bs.start();
				console.log('start sound for object ' + object.name);
			});
		}

		if (d > maxHearingDistance && sounds[object.name]) {
			sounds[object.name] = false;
			// stop sound

			object.bs.stop();
		}

		if (d < maxHearingDistance && sounds[object.name]) {
			object.panner.setPosition(
				(object.worldCoords.x - player.worldCoords.x) / maxHearingDistance,
				0,
				(object.worldCoords.z - player.worldCoords.z) / maxHearingDistance
			);
			object.panner.refDistance = (maxHearingDistance - d) / maxHearingDistance;
		}
	});

};

window.setInterval(eventLoop, 1000/fps);
