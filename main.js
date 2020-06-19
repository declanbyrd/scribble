const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

const ongoingTouches = [];
const lineColour = 'black';
const lineWidth = 4;
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
 * 	Draw a mark to indicate the start of a line.
 */
const handleMouseDown = (event) => {
	event.preventDefault();
	painting = true;

	context.beginPath();
	context.arc(event.pageX, event.pageY, lineWidth / 2, 0, Math.PI * 2);
	context.lineWidth = lineWidth;
	context.strokeStyle = lineColour;
	context.stroke();
};

/**
 *  Draw a line to where the to where the touch has been continued.
 */
const handleMouseMove = (event) => {
	if (painting) {
		event.preventDefault();

		context.lineTo(event.pageX, event.pageY);
		context.lineWidth = lineWidth;
		context.strokeStyle = lineColour;
		context.stroke();
	}
};

/**
 * 	When touch ends, stop drawing line.
 */
const handleMouseUp = (event) => {
	event.preventDefault();
	context.lineWidth = lineWidth;
	context.fillStyle = lineColour;
	context.closePath();
	painting = false;
};

/**
 * 	Draw a mark to indicate the start of a line.
 */
const handleTouchStart = (event) => {
	event.preventDefault();
	const touches = event.changedTouches;

	for (let index = 0; index < touches.length; index++) {
		ongoingTouches.push(copyTouch(touches[index]));

		context.beginPath();
		context.arc(
			touches[index].pageX,
			touches[index].pageY,
			lineWidth / 2,
			0,
			Math.PI * 2
		);
		context.lineWidth = lineWidth;
		context.strokeStyle = lineColour;
		context.stroke();
	}
};

/**
 *  Draw a line to where the to where the touch has been continued.
 */
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
			context.lineWidth = lineWidth;
			context.strokeStyle = lineColour;
			context.stroke();

			ongoingTouches.splice(identifier, 1, copyTouch(touches[index]));
		}
	}
};

/**
 * 	When touch ends, stop drawing line.
 */
const handleTouchEnd = (event) => {
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
			context.lineWidth = lineWidth;
			context.strokeStyle = lineColour;
			context.stroke();
			ongoingTouches.splice(identifier, 1, touches[index]);
		}
	}
};

const addPointerListeners = () => {
	canvas.addEventListener('mousedown', handleMouseDown);
	canvas.addEventListener('mousemove', handleMouseMove);
	canvas.addEventListener('mouseup', handleMouseUp);
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
