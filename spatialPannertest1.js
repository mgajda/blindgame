var ctx = new AudioContext();

var getSample = function(url, cb) {
	var request = new XMLHttpRequest();
	request.open('GET', url);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		ctx.decodeAudioData(request.response, cb);
	}
	request.send()
};

getSample('sounds/step-217476__agaxly__walk-3.wav', function(buffer){
	var player = ctx.createBufferSource()
	player.buffer = buffer
	player.loop = true
	player.connect(input)
	player.start(ctx.currentTime)
});

var spatialPanner = ctx.createPanner();

var input = ctx.createGain();

input.connect(spatialPanner);
spatialPanner.connect(ctx.destination);



$(document).ready(function(){
	$('body').mousemove(function(e){
		var coords = {
			x : e.pageX - $('div#listener').offset().left,
			y : e.pageY - $('div#listener').offset().top
		};

		coords.x = Math.min(200, coords.x);
		coords.x = Math.max(-200, coords.x);

		coords.y = Math.min(200, coords.y);
		coords.y = Math.max(-200, coords.y);

		console.log(coords.x/200, 0, coords.y/200);
		spatialPanner.setPosition(coords.x/200, 0, coords.y/200);
	});
});
