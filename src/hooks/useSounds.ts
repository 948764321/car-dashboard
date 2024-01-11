import { useEffect } from 'react';

interface SoundManager {
	baseURL: string;
	ctx: AudioContext;
	sources: {
		[key: string]: {
			volume: number;
			fileNames: string[];
			buffers: any[];
		};
	};
}

const soundManager: SoundManager = {
	baseURL: '/',
	// @ts-ignore
	ctx: new (window.AudioContext || window.webkitAudioContext)(),
	sources: {
		catapult: {
			volume: 1,
			fileNames: ['catapult.mp3'],
			buffers: []
		},
		drive: {
			volume: 3,
			fileNames: ['drive.mp3'],
			buffers: []
		}
	}
};

export default () => {
	const soundsMap = new Map<string, AudioBufferSourceNode>();

	useEffect(() => {
		preload();
	}, []);

	const preload = () => {
		const allFilePromises: Promise<AudioBuffer>[] = [];
		function checkStatus(response: Response) {
			if (response.status >= 200 && response.status < 300) {
				return response;
			}
			const customError = new Error(response.statusText);
			throw customError;
		}
		const types = Object.keys(soundManager.sources);
		types.forEach(type => {
			const source = soundManager.sources[type];
			const { fileNames } = source;
			const filePromises: Promise<AudioBuffer>[] = [];
			fileNames.forEach(fileName => {
				const fileURL = soundManager.baseURL + fileName;
				// Promise will resolve with decoded audio buffer.
				const promise = fetch(fileURL)
					.then(checkStatus)
					.then(response => response.arrayBuffer())
					.then(
						data =>
							new Promise<AudioBuffer>(resolve => {
								soundManager.ctx.decodeAudioData(data, resolve);
							})
					);

				filePromises.push(promise);
				allFilePromises.push(promise);
			});

			Promise.all(filePromises).then(buffers => {
				source.buffers = buffers;
			});
		});

		return Promise.all(allFilePromises);
	};

	const playSound = (type: string) => {
		if (soundsMap.get(type)) return;
		const source = soundManager.sources[type];
		if (!source) {
			throw new Error(`Sound of type "${type}" doesn't exist.`);
		}
		const initialVolume = source.volume;
		const gainNode = soundManager.ctx.createGain();
		gainNode.gain.value = initialVolume;

		const bufferSource = soundManager.ctx.createBufferSource();
		bufferSource.buffer = source.buffers[0];
		bufferSource.connect(gainNode);
		gainNode.connect(soundManager.ctx.destination);
		bufferSource.start(0);

		soundsMap.set(type, bufferSource);
		bufferSource.onended = () => {
			soundsMap.delete(type);
		};
	};

	const stopSound = (type: string) => {
		const bufferSource = soundsMap.get(type);
		if (!bufferSource) {
			throw new Error(`Sound of type "${type}" doesn't created.`);
		}
		bufferSource.stop();
	};

	return { playSound, stopSound };
};
