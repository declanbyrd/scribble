const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

const ongoingTouches = [];
const lineColour = 'black';
let painting = false;

// Only store the touch data that is needed.
const copyTouch = ({ identifier, pageX, pageY }) => {
	return { identifier, pageX, pageY };
};

// Return the index of an ongoing touch
const findTouch = (touchToFind) => {
	const search = ongoingTouches.find(
		(touch) => touch.identifier == touchToFind.identifier
	);
	return search !== undefined ? ongoingTouches.indexOf(search) : -1;
};

// Resize the canvas to be the exact size of the device.
const resize = (canvas) => {
	const width = window.innerWidth;
	const height = window.innerHeight;

	const pixelRatio = window.devicePixelRatio;

	canvas.width = width * pixelRatio;
	canvas.height = height * pixelRatio;

	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;

	return pixelRatio;
};

/**
 * 	Handles pointer down event
 * 	Will be fired when mousedown and touchstart occur.
 */
const handlePointerDown = (event) => {
	event.preventDefault();
	painting = true;

	context.beginPath();
	context.moveTo(event.pageX, event.pageY);
};

/**
 * 	Handles pointer move event
 * 	Will be fired when mousemove and touchmove occur.
 */
const handlePointerMove = (event) => {
	if (painting) {
		event.preventDefault();

		context.lineTo(event.pageX, event.pageY);
		context.lineWidth = 4;
		context.strokeStyle = lineColour;
		context.stroke();
	}
};

/**
 * 	Handles pointer up event
 * 	Will be fired when mouseup and touchend occur.
 */
const handlePointerUp = (event) => {
	event.preventDefault();
	context.lineWidth = 4;
	context.fillStyle = lineColour;
	context.closePath();
	painting = false;
};

const handleTouchStart = (event) => {
	event.preventDefault();
	const touches = event.changedTouches;

	for (let index = 0; index < touches.length; index++) {
		ongoingTouches.push(copyTouch(touches[index]));

		context.beginPath();
		context.lineTo(touches[index].pageX, touches[index].pageY);
		context.lineWidth = 4;
		context.strokeStyle = lineColour;
		context.stroke();
	}
};

const handleTouchMove = (event) => {
	event.preventDefault();
	const touches = event.changedTouches;

	for (let index = 0; index < touches.length; index++) {
		const identifier = findTouch(touches[index]);

		if (identifier >= 0) {
			context.beginPath();
			context.moveTo(
				ongoingTouches[identifier].pageX,
				ongoingTouches[identifier].pageY
			);
			context.lineTo(touches[index].pageX, touches[index].pageY);
			context.lineWidth = 4;
			context.strokeStyle = lineColour;
			context.stroke();

			ongoingTouches.splice(identifier, 1, copyTouch(touches[index]));
		}
	}
};

const handleTouchEnd = (event) => {
	event.preventDefault();
	const touches = event.changedTouches;

	for (let index = 0; index < touches.length; index++) {
		const identifier = findTouch(touches[index]);
		if (identifier >= 0) {
			context.lineWidth = 4;
			context.fillStyle = lineColour;
			context.beginPath();
			context.moveTo(
				ongoingTouches[identifier].pageX,
				ongoingTouches[identifier].pageY
			);
			context.lineTo(touches[index].pageX, touches[index].pageY);
			context.arc(
				touches[index].pageX,
				touches[index].pageY,
				2,
				0,
				2 * Math.PI
			);
			context.fillStyle = lineColour;
			context.fill();
			ongoingTouches.splice(identifier, 1, touches[index]);
		}
	}
};

const addPointerListeners = () => {
	canvas.addEventListener('pointerdown', handlePointerDown);
	canvas.addEventListener('pointermove', handlePointerMove);
	canvas.addEventListener('pointerup', handlePointerUp);
};

const addTouchListeners = () => {
	canvas.addEventListener('touchstart', handleTouchStart);
	canvas.addEventListener('touchmove', handleTouchMove);
	canvas.addEventListener('touchend', handleTouchEnd);
};

// Initialise the canvas and add event listeners.
const init = () => {
	const pixelRatio = resize(canvas);
	context.scale(pixelRatio, pixelRatio);
	addPointerListeners();
	addTouchListeners();
};

window.addEventListener('load', init);