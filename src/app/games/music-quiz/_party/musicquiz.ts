/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GoogleGenerativeAI } from "@google/generative-ai";
import type * as Party from "partykit/server";

import { GEMINI_API_KEY } from "@/lib/env";

import { questionFunctions } from "./questions";

const API_KEY: string = GEMINI_API_KEY;

const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash",
	// Set the `responseMimeType` to output JSON
	generationConfig: { responseMimeType: "application/json" },
});

export interface QuestionWithAnswer {
	answers: AnswerOption[];
	pictureUrl: string | null;
	question: string;
}

export interface AnswerOption {
	answer: string;
	isCorrect: boolean;
}

export default class MusicQuizServer implements Party.Server {
	constructor(readonly room: Party.Room) {}
	gameExists: boolean = false;
	gamePlayers: number = 0;
	token: string = "";
	private usedFunctions: Set<string> = new Set();

	// TODO DAN FOLLOW THIS BLOG
	// https://docs.partykit.io/guides/using-multiple-parties-per-project/#example-tracking-connections-across-rooms

	// eslint-disable-next-line @typescript-eslint/require-await
	async onStart() {
		console.log("Partykit server starting up");
	}

	// This Method Creates or returns the room
	async onRequest(req: Party.Request) {
		console.log("Got to OnRequest...");
		// TODO create or return room
		if (req.method === "POST") {
			const message: string = await req.json();
			console.log("Got to OnRequest. Message: " + JSON.stringify(message));
			this.gamePlayers++;
			if (this.gameExists) {
				console.log(
					`Game of Music Quiz exists, returning game! There are ${this.gamePlayers} players`,
				);
			} else {
				this.gameExists = true;
				console.log(
					`Game of Music Quiz does not exist, creating game! There are ${this.gamePlayers} players`,
				);
			}
		}

		if (this.gameExists) {
			return new Response("You got the party kit server!", {
				status: 200,
			});
		}
		console.log("You did a POST and didn't make it. Failing");
		return new Response("Not found", { status: 404 });
	}

	async onMessage(request: string) {
		const requestJson = JSON.parse(request);
		const message = requestJson.message;
		console.log("Got to message in Music Quiz");
		const token: string = requestJson.data.token;
		this.token = token;
		// if (message === "getTopArtists") {
		// 	await this.getTopArtists();
		// }
		if (message === "getQuestion") {
			console.log("Getting question now!");
			const questionData = await this.generateRandomQuestion();
			const result = {
				message: "getQuestion",
				data: { success: true, questionData: questionData },
			};
			this.room.broadcast(JSON.stringify(result));
		}
		if (message === "getSongs") {
			await this.getSongs();
		}
	}

	async generateRandomQuestion(): Promise<QuestionWithAnswer> {
		const functionNames = Object.keys(questionFunctions);

		// Filter out already used functions
		const availableFunctions = functionNames.filter(
			(fn) => !this.usedFunctions.has(fn),
		);

		// If all functions have been used, reset the usedFunctions set
		if (availableFunctions.length === 0) {
			this.usedFunctions.clear();
			availableFunctions.push(...functionNames);
		}

		// Pick a random function from the available ones
		const randomFunctionName = availableFunctions[
			Math.floor(Math.random() * availableFunctions.length)
		] as keyof typeof questionFunctions;

		// Mark the function as used
		this.usedFunctions.add(randomFunctionName);

		const question = await questionFunctions[randomFunctionName](
			this.token,
			model,
		);
		// const question = await getTopArtists(this.token);
		if (question) {
			return question;
		}
		throw new Error("Failed to generate a valid question.");
	}

	async getSongs() {
		console.log("Getting song now!");
		const endpoint =
			"https://api.spotify.com/v1/search?type=track&q=artist:Yellowcard";
		const headers = new Headers({
			Authorization: `Bearer ${this.token}`,
			"Content-Type": "application/json",
		});

		const result = await fetch(endpoint, { headers })
			.then((res) => res.json())
			// .then((data) => console.log(JSON.stringify(data)))
			.catch((error) => console.error("Error:", error));
		const response = {
			message: "getSong",
			data: { success: true, songData: result },
		};
		this.room.broadcast(JSON.stringify(response));
		// return data;
	}
}

MusicQuizServer satisfies Party.Worker;
