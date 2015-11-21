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
var convolver2 = ctx.createConvolver();


var input = ctx.createGain();

convolver2.connect(ctx.destination);

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
		'name' : 'radio2',
		'soundFile' : '262267__gowlermusic__radio-static.wav',
		'worldCoords' : {
			x: 120,
			z: 200,
		},
		loop: true,
		gain: 1, // float between 0.0 - 1.0
	},
	{
		'name' : 'river1',
		'soundFile' : '325182__kentspublicdomain__river-stream-creek-sound-of-waves-moving-water.wav',
		'worldCoords' : {
			x: 295,
			z: 300,
		},
		loop: true,
		gain: 1, // float between 0.0 - 1.0
	},
	{
		'name' : 'river2',
		'soundFile' : '325182__kentspublicdomain__river-stream-creek-sound-of-waves-moving-water.wav',
		'worldCoords' : {
			x: 280,
			z: 340,
		},
		loop: true,
		gain: 1, // float between 0.0 - 1.0
	},
	{
		'name' : 'river3',
		'soundFile' : '325182__kentspublicdomain__river-stream-creek-sound-of-waves-moving-water.wav',
		'worldCoords' : {
			x: 280,
			z: 380,
		},
		loop: true,
		gain: 1, // float between 0.0 - 1.0
	},
	{
		'name' : 'river4',
		'soundFile' : '325182__kentspublicdomain__river-stream-creek-sound-of-waves-moving-water.wav',
		'worldCoords' : {
			x: 230,
			z: 420,
		},
		loop: true,
		gain: 1, // float between 0.0 - 1.0
	},
	{
		'name' : 'duck',
		'soundFile' : 'Mallard Duck Quacks-SoundBible.com-289141159.wav',
		'worldCoords' : {
			x: 220,
			z: 400,
		},
		loop: true,
	},
	{
		'name' : 'tree',
		'soundFile' : '177778__dheming__wood-creak-03.wav',
		'worldCoords' : {
			x: 100,
			z: 400,
		},
		loop: true,
	},
	{
		'name' : 'tree2',
		'soundFile' : '177778__dheming__wood-creak-03.wav',
		'worldCoords' : {
			x: 140,
			z: 300,
		},
		loop: true,
	},
	{
		'name' : 'tree3',
		'soundFile' : '177778__dheming__wood-creak-03.wav',
		'worldCoords' : {
			x: 230,
			z:  80,
		},
		loop: true,
	},
	{
		'name' : 'door',
		'soundFile' : '219492__jarredgibb__door-creak-02.wav',
		'worldCoords' : {
			x: 0,
			z: 0,
		},
		loop: true,
	},
	{
		'name' : 'alligator',
		'soundFile' : 'Alligator Hissing-SoundBible.com-638955379.wav',
		'worldCoords' : {
			x: 300,
			z: 300,
		},
		loop: true,
	},
];

var quests = [
	{
		name: 'Quest 1',
		mission: 'Walk towards the radio.<br>',
		activated: false,
		completionActivates: 'Quest 2'
	},
	{
		name: 'Quest 2',
	}
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

				object.convolver = ctx.createConvolver();
				object.convolver.buffer = convolverBuffer;

				object.panner = ctx.createPanner();
				object.bs.connect(object.convolver);
				object.convolver.connect(object.panner);
				object.panner.connect(ctx.destination);
				object.bs.start();
				object.bs.loop = object.loop; 
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

window.setTimeout(function(){
	window.setInterval(eventLoop, 1000/fps);
}, 2000);
