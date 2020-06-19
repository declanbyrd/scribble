'use strict';

const CACHE_NAME = 'scribble-v1';

const assets = [
	'/',
	'/index.html',
	'/favicon.svg',
	'/sw.js',
	'/main.js',
	'/img/192.png',
	'/img/512.png',
];

const updateCache = async (request) => {
	const cache = await caches.open(CACHE_NAME);
	const response = await fetch(request);
	if (!response || response.status !== 200 || response.type !== 'basic') {
		return response;
	}
	return cache.put(request, response);
};

const handleFetch = async (request) => {
	const cache = await caches.open(CACHE_NAME);
	const cachedCopy = await cache.match(request);
	return cachedCopy || Promise.reject('no-match');
};

const interceptFetch = (event) => {
	event.respondWith(handleFetch(event.request));
	event.waitUntil(updateCache(event.request));
};

const prepareCache = async (event) => {
	const cache = await caches.open(CACHE_NAME);
	cache.addAll(assets);
};

self.addEventListener('install', prepareCache);
self.addEventListener('fetch', interceptFetch);
