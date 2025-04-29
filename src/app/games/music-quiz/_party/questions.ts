/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { GenerativeModel } from "@google/generative-ai";

import { AnswerOption, QuestionWithAnswer } from "./musicquiz";

export const questionFunctions = {
	getTopArtistsQuestion,
	getAlbumArtworkQuestion,
	getSongsFromGeminiQuestion,
	getAlbumDateQuestion,
	getTopTracksQuestion,
	getCompareArtistsQuestion,
	getfavouriteSongQuestion,
};

export async function getTopArtistsQuestion(
	token: string,
	model: GenerativeModel,
): Promise<QuestionWithAnswer | null> {
	const data = await getTopArtistsSpotify(token, 6);
	if (data) {
		const answers: AnswerOption[] = [];
		const top6ArtistAnswer = { answer: data.items[5].name, isCorrect: true };
		answers.push(top6ArtistAnswer);
		for (const artist of data.items.slice(0, 5)) {
			answers.push({ answer: artist.name, isCorrect: false });
		}
		return {
			question:
				"Which Artist is NOT in your Top 5 Most Listened to of the last 6 months?",
			answers: answers.sort(() => Math.random() - 0.5),
		};
	}
	return null;
}

export async function getfavouriteSongQuestion(
	token: string,
): Promise<QuestionWithAnswer | null> {
	const data = await getTopTracksSpotify(token, 31);
	if (data) {
		const num1 = Math.floor(Math.random() * 27);
		const num2 = Math.floor(Math.random() * (28 - num1)) + num1 + 1;
		const num3 = Math.floor(Math.random() * (29 - num2)) + num2 + 1;
		const num4 = Math.floor(Math.random() * (29 - num3)) + num3 + 1;

		const song1 = data.items[num1];
		const song2 = data.items[num2];
		const song3 = data.items[num3];
		const song4 = data.items[num4];

		const answers: AnswerOption[] = [
			{
				answer: song1.name,
				isCorrect: true,
			},
			{
				answer: song2.name,
				isCorrect: false,
			},
			{
				answer: song3.name,
				isCorrect: false,
			},
			{
				answer: song4.name,
				isCorrect: false,
			},
		];

		return {
			question: "Which of these songs was your highest played?",
			answers: answers.sort(() => Math.random() - 0.5),
		};
	}
	return null;
}

export async function getCompareArtistsQuestion(
	token: string,
): Promise<QuestionWithAnswer | null> {
	const data = await getTopArtistsSpotify(token, 30);
	if (data) {
		// Limit num1 to the range 0 to 8
		const num1 = Math.floor(Math.random() * 17);
		console.log("Num1: " + num1);
		// Generate num2, ensuring it's greater than num1 and within 0 to 9
		const num2 = Math.floor(Math.random() * (18 - num1)) + num1 + 1;
		console.log("Num2: " + num2);
		// Generate num2, ensuring it's greater than num2 and within 0 to 9
		const num3 = Math.floor(Math.random() * (19 - num2)) + num2 + 1;
		console.log("Num3: " + num3);
		// Generate num2, ensuring it's greater than num2 and within 0 to 9
		const num4 = Math.floor(Math.random() * (19 - num3)) + num3 + 1;
		console.log("Num3: " + num4);

		const artist1 = data.items[num1];
		const artist2 = data.items[num2];
		const artist3 = data.items[num3];
		const artist4 = data.items[num4];

		const answers: AnswerOption[] = [
			{
				answer: artist1.name,
				isCorrect: true,
			},
			{
				answer: artist2.name,
				isCorrect: false,
			},
			{
				answer: artist3.name,
				isCorrect: false,
			},
			{
				answer: artist4.name,
				isCorrect: false,
			},
		];

		return {
			question: "Which artist did you listen to the most in the last 6 months?",
			answers: answers.sort(() => Math.random() - 0.5),
		};
	}
	return null;
}

export async function getSongsFromGeminiQuestion(
	token: string,
	model: GenerativeModel,
) {
	const topArtists = await getTopArtistsSpotify(token, 15);
	const randomArtistIndex = Math.floor(Math.random() * topArtists.items.length);
	const randomArtist = topArtists.items[randomArtistIndex].name;

	try {
		const prompt = `
			List the name of 4 ${randomArtist} songs, making sure they are middle popular. Add in 1 fake song name too that sounds similar to another one of their songs not on the list.
			Return the result in a JSON format like this:
			Song = {"song": string, "isCorrect": boolean}
			Return a list[Song]
		`;

		const result = await model.generateContent(prompt);
		const promptText: string = result.response.text();
		const jsonResponse = JSON.parse(promptText);
		console.log(jsonResponse);

		const answers: AnswerOption[] = [];
		for (const answer of jsonResponse) {
			answers.push({ answer: answer.song, isCorrect: !answer.isCorrect });
		}
		return {
			question: `Which song is not by the band ${randomArtist}?`,
			answers: answers.sort(() => Math.random() - 0.5),
		};
	} catch (error) {
		console.log("Error getting words: " + JSON.stringify(error));
	}
}

export async function getAlbumArtworkQuestion(
	token: string,
	model: GenerativeModel,
): Promise<QuestionWithAnswer | null> {
	const topArtists = await getTopArtistsSpotify(token, 15);
	const randomArtistIndex = Math.floor(Math.random() * topArtists.items.length);
	const randomArtist = topArtists.items[randomArtistIndex];
	const albums = await getAlbumsSpotify(token, randomArtist.id, 5);

	const answers = [];
	const correctAlbum = albums[Math.floor(Math.random() * albums.length)];
	for (const album of albums) {
		if (album.id !== correctAlbum.id) {
			answers.push({ answer: album.name, isCorrect: false });
		} else {
			answers.push({ answer: album.name, isCorrect: true });
		}
	}
	console.log(correctAlbum.images[0].url);
	return {
		question: `What is the name of this album from the band ${randomArtist.name}?`,
		answers: answers.sort(() => Math.random() - 0.5),
		picture: { url: correctAlbum.images[0].url, covered: true },
	};
}

export async function getTopTracksQuestion(
	token: string,
): Promise<QuestionWithAnswer | null> {
	const data = await getTopTracksSpotify(token, 20);
	if (data) {
		const answers: AnswerOption[] = [];
		// Use the 6th track as the correct answer (not in top 5)
		const notTopFiveTrack = {
			answer: data.items[7].name,
			isCorrect: true,
		};
		answers.push(notTopFiveTrack);

		// Add the actual top 5 tracks
		for (const track of data.items.slice(0, 5)) {
			answers.push({
				answer: track.name,
				isCorrect: false,
			});
		}

		return {
			question: "Which song is NOT in your Top 5 most listened to tracks?",
			answers: answers.sort(() => Math.random() - 0.5),
		};
	}
	return null;
}

export async function getAlbumDateQuestion(
	token: string,
	model: GenerativeModel,
): Promise<QuestionWithAnswer | null> {
	const topArtists = await getTopArtistsSpotify(token, 15);
	const randomArtistIndex = Math.floor(Math.random() * topArtists.items.length);
	const randomArtist = topArtists.items[randomArtistIndex];
	const albums = await getAlbumsSpotify(token, randomArtist.id, 6);
	const correctAlbum = albums[Math.floor(Math.random() * albums.length)];

	try {
		const prompt = `
			Tell me the year date of ${correctAlbum.name} by ${randomArtist.name}. Add in 3 fake years that are close to that date.
			Return the result in a JSON format like this:
			Song = {"year": string, "isCorrect": boolean}
			Return a list[Song]
		`;

		const result = await model.generateContent(prompt);
		const promptText: string = result.response.text();
		const jsonResponse = JSON.parse(promptText);
		console.log(jsonResponse);

		const answers: AnswerOption[] = [];
		for (const answer of jsonResponse) {
			answers.push({ answer: answer.year, isCorrect: answer.isCorrect });
		}
		return {
			question: `Which year did the album ${correctAlbum.name} by ${randomArtist.name} come out?`,
			answers: answers.sort(() => Math.random() - 0.5),
			picture: { url: correctAlbum.images[0].url, covered: false },
		};
	} catch (error) {
		console.log("Error getting words: " + JSON.stringify(error));
	}
	return null;
}

async function getAlbumsSpotify(
	token: string,
	artistId: string,
	limit: number,
): Promise<any> {
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	// Step 2: Get the artist's albums
	const albumsEndpoint = `https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}`;
	const albumsResponse = await fetch(albumsEndpoint, { headers });
	if (!albumsResponse.ok) {
		throw new Error(`Spotify API error: ${albumsResponse.statusText}`);
	}
	const albumsData = await albumsResponse.json();
	const albums = albumsData.items;
	console.log(albums);

	if (albums.length === 0) {
		console.error("No albums found for this artist");
		return null;
	}
	return albums;
}

async function getTopTracksSpotify(token: string, limit: number = 20) {
	const endpoint = `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=medium_term`;
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	try {
		const response = await fetch(endpoint, { headers });
		if (!response.ok) {
			throw new Error(`Spotify API error: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching top tracks:", error);
		return null;
	}
}

async function getTopArtistsSpotify(
	token: string,
	limit: number,
): Promise<any> {
	console.log("Getting top artists!");
	const endpoint = `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=medium_term`;
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	try {
		const response = await fetch(endpoint, { headers });
		if (!response.ok) {
			throw new Error(`Spotify API error: ${response.statusText}`);
		}
		const data = await response.json();
		console.log("User's Top Artists:", data.items);
		return data;
	} catch (error) {
		console.error("Error fetching top artists:", error);
		const topArtists = [
			"Taylor Swift",
			"Drake",
			"Billie Eilish",
			"The Weeknd",
			"Harry Styles",
			"Olivia Rodrigo",
			"Ed Sheeran",
			"Dua Lipa",
			"Justin Bieber",
			"Ariana Grande",
			"Kendrick Lamar",
			"Post Malone",
			"Doja Cat",
			"Bad Bunny",
			"SZA",
			"Adele",
			"BTS",
			"Rihanna",
			"Beyoncé",
			"Coldplay",
		];
		return topArtists.map((artist) => ({
			name: artist,
		}));
	}
}
