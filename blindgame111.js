var ctx = new AudioContext()
// var osc = ctx.createOscillator();
// osc.connect(ctx.destination);
//
//


/*
*
*
* load samples
*/

function getSample(url, cb) {
	var request = new XMLHttpRequest()
	request.open('GET', url)
	request.responseType = 'arraybuffer'
	request.onload = function() {
		ctx.decodeAudioData(request.response, cb)
	}
	request.send()
}

getSample('sounds/step-217476__agaxly__walk-3.wav', function(buffer){
	var player = ctx.createBufferSource()
	player.buffer = buffer
	player.loop = true
	player.connect(input)
	player.start(ctx.currentTime, 0, 10)
});

var leftDelay = ctx.createDelay()
var rightDelay = ctx.createDelay()
var merger = ctx.createChannelMerger(2)
var input = ctx.createGain()
var output = ctx.createGain()

leftDelay.delayTime.value = 0
rightDelay.delayTime.value = 1 / 1000 / 1000 * 800

input.connect(leftDelay);
input.connect(rightDelay);

leftDelay.connect(merger, 0, 0)
rightDelay.connect(merger, 0, 1)

merger.connect(ctx.destination)
