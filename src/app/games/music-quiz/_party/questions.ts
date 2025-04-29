/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { GenerativeModel } from "@google/generative-ai";

import { AnswerOption, QuestionWithAnswer } from "./musicquiz";

export const questionFunctions = {
	getTopArtists,
	basicQuestion,
	getSongsFromGemini,
};

export async function getTopArtists(
	token: string,
	model: GenerativeModel,
): Promise<QuestionWithAnswer | null> {
	const data = await getTopArtistsSpotify(token);
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

export async function getSongsFromGemini(
	token: string,
	model: GenerativeModel,
) {
	const topArtists = await getTopArtistsSpotify(token);
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
			question: `Which song is not by the all time great band ${randomArtist}?`,
			answers: answers.sort(() => Math.random() - 0.5),
		};
	} catch (error) {
		console.log("Error getting words: " + JSON.stringify(error));
	}
}

export async function basicQuestion(
	token: string,
	model: GenerativeModel,
): Promise<QuestionWithAnswer> {
	return {
		question: "What is the name of this song?",
		answers: [
			{ answer: "Song A", isCorrect: false },
			{ answer: "Song B", isCorrect: true },
			{ answer: "Song C", isCorrect: false },
		],
	};
}

async function getTopArtistsSpotify(token: string): Promise<any> {
	const endpoint =
		"https://api.spotify.com/v1/me/top/artists?limit=6&time_range=medium_term";
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
