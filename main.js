const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

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

// Initialise the canvas and add event listeners.
const init = () => {
	const pixelRatio = resize(canvas);
	context.scale(pixelRatio, pixelRatio);
	canvas.addEventListener('pointerdown', handlePointerDown);
	canvas.addEventListener('pointermove', handlePointerMove);
	canvas.addEventListener('pointerup', handlePointerUp);
};

window.addEventListener('load', init);
