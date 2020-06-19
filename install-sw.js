// if the browser supports service workers
// install one.
if (navigator.serviceWorker) {
	console.log('ServiceWorker: support detected.');
	async function registerServiceWorker() {
		console.log('ServiceWorker: registering.');
		try {
			const registration = await navigator.serviceWorker.register('/sw.js');
			console.log('ServiceWorker: registered', registration);
		} catch (error) {
			console.error(
				'Service Worker failed.  Falling back to online-only.',
				error
			);
		}
	}
	window.addEventListener('load', registerServiceWorker);
}
