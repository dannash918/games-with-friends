/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type * as Party from "partykit/server";

import {
	getColor,
	getLetters,
	initLetterGrid,
	initLetterPool,
} from "../[game_id]/_components/letterFunctions";

export interface Player {
	active: boolean;
	color: string;
	connectionId: string;
	name: string;
	score: number;
}

export default class SpeedWordsServer implements Party.Server {
	constructor(readonly room: Party.Room) {}
	roomExists: boolean = false;
	token: string = "";
	letterPool: string[] = [];
	letterGrid: any = {};
	gameInProgress: boolean = false;
	colors: string[] = [
		"red",
		"orange",
		"yellow",
		"amber",
		"lime",
		"green",
		"blue",
		"cyan",
		"rose",
		"indigo",
		"violet",
		"pink",
		"fuchsia",
		"purple",
	];
	players: Player[] = [];

	async onStart() {
		console.log("Partykit server starting up");
	}

	// This Method Creates or returns the room
	async onRequest(req: Party.Request) {
		console.log("Got to OnRequest...");
		// TODO create or return room
		if (req.method === "POST") {
			const message: any = await req.json();
			console.log("Got to OnRequest. Message: " + JSON.stringify(message));

			if (this.roomExists) {
				console.log(
					`Game of Speed Words exists, returning game! There are ${this.players.length} players`,
				);
			} else {
				this.roomExists = true;
				console.log(
					`Game of Speed Words does not exist, creating game! There are ${this.players.length} players`,
				);
			}
		}
		if (this.roomExists) {
			return new Response("You got the party kit server!", {
				status: 200,
			});
		}
		console.log("You did a POST and didn't make it. Failing");
		return new Response("Not found", { status: 404 });
	}

	async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
		const queryParams = this.extractQueryParams(ctx.request.url);
		console.log("Got to onConnect: " + queryParams.name || "Fred");
		this.players.push({
			connectionId: connection.id,
			name: queryParams.name || `Player ${this.players.length + 1}`,
			color: getColor(this.colors),
			score: -1,
			active: false,
		});
		const response = {
			message: "joined",
			data: {
				players: this.players,
				gameInProgress: this.gameInProgress,
				letterGrid: this.letterGrid,
			},
		};
		this.room.broadcast(JSON.stringify(response));
	}

	async onMessage(request: string) {
		const requestJson = JSON.parse(request);
		const message = requestJson.message;
		if (message === "peel") {
			this.peel();
		}
		if (message === "startGame") {
			this.startGame();
		}
		if (message === "playLetter") {
			this.playLetter(requestJson.data);
		}
		if (message === "backspace") {
			this.backspace(requestJson.data);
		}
		if (message === "dump") {
			this.dump(requestJson.data);
		}
		if (message === "win") {
			this.finish(requestJson.data);
		}
	}

	async onClose(connection: Party.Connection) {
		// Handle the disconnection event
		console.log("Client disconnected:", connection.id);
		this.players = this.players.filter(
			(player) => player.connectionId !== connection.id,
		);
		const response = {
			message: "disconnected",
			data: {
				players: this.players,
			},
		};
		console.log("Player list is: " + JSON.stringify(response));
		this.room.broadcast(JSON.stringify(response));
		if (this.players.length === 0) {
			this.gameInProgress = false;
		}
	}

	extractQueryParams(urlString: string): {
		_pk: string | null;
		name: string | null;
	} {
		const url = new URL(urlString);
		const params = new URLSearchParams(url.search);

		const _pk = params.get("_pk");
		const name = params.get("name");

		return { _pk, name };
	}

	startGame() {
		// TODO pass through settings. If each playing on own board, then just make individual play grids for each person and return those
		this.letterPool = initLetterPool();
		const initLetter = getLetters(1, this.letterPool);
		this.letterGrid = initLetterGrid(initLetter[0]);
		for (const player of this.players) {
			player.active = true;
			const newLetters = getLetters(7, this.letterPool);
			const response = {
				message: "startGame",
				data: {
					letterGrid: this.letterGrid,
					letters: newLetters,
					color: player.color,
					active: true,
				},
			};
			const connections = Array.from(this.room.getConnections());
			const connection = connections.find(
				(connection) => connection.id === player.connectionId,
			);

			connection && connection.send(JSON.stringify(response));
		}
		this.broadcastLettersLeft();
		this.gameInProgress = true;
	}

	playLetter(data: any) {
		const letterGrid = this.letterGrid;
		const letter = data.letter;
		const selectedCell = data.selectedCell;
		const letterFromGrid = letterGrid[selectedCell[0]][selectedCell[1]]?.letter;
		this.sendExistingLetterBack(data.color, letterFromGrid);
		letterGrid[selectedCell[0]] = letterGrid[selectedCell[0]] ?? {};
		letterGrid[selectedCell[0]][selectedCell[1]] = {
			letter: letter,
			color: data.color,
		};
		this.letterGrid = letterGrid;
		const response = {
			message: "letterGridUpdate",
			data: { letterGrid: this.letterGrid },
		};
		console.log("Letter Grid: " + JSON.stringify(letterGrid));
		this.room.broadcast(JSON.stringify(response));
	}

	sendExistingLetterBack(color: string, letterFromGrid: string) {
		// Send letter back to original player
		console.log("Sending letter back: " + letterFromGrid);
		if (letterFromGrid && letterFromGrid != "") {
			for (const player of this.players) {
				if (player.color == color) {
					const connections = Array.from(this.room.getConnections());
					const connection = connections.find(
						(connection) => connection.id === player.connectionId,
					);

					const response = {
						message: "peel",
						data: { letters: [letterFromGrid] },
					};
					console.log("Sending letter back: " + letterFromGrid + color);

					connection && connection.send(JSON.stringify(response));
				}
			}
		}
	}

	backspace(data: any) {
		// Update Letter grid and send to all
		const selectedCell = data.selectedCell;
		const letterGrid = this.letterGrid;
		const letterFromGrid = letterGrid[selectedCell[0]][selectedCell[1]]?.letter;
		console.log("Backspace Letter: " + letterFromGrid);
		this.sendExistingLetterBack(data.color, letterFromGrid);
		letterGrid[selectedCell[0]] = letterGrid[selectedCell[0]] ?? {};
		letterGrid[selectedCell[0]][selectedCell[1]] = null;
		this.letterGrid = letterGrid;
		const response = {
			message: "letterGridUpdate",
			data: { letterGrid: this.letterGrid },
		};
		this.room.broadcast(JSON.stringify(response));
	}

	peel() {
		for (const player of this.players.filter((player) => player.active)) {
			const connections = Array.from(this.room.getConnections());
			const connection = connections.find(
				(connection) => connection.id === player.connectionId,
			);
			const newLetters = getLetters(2, this.letterPool);
			console.log(
				"Player: " +
					player.color +
					"New Letters: " +
					JSON.stringify(newLetters),
			);
			const response = { message: "peel", data: { letters: newLetters } };
			connection && connection.send(JSON.stringify(response));
		}
		this.broadcastLettersLeft();
	}

	dump(data: any) {
		console.log("Got to dump!");
		const dumpedLetter = data.letter;
		this.letterPool.push(dumpedLetter);
		const connectionId = this.players.find(
			(player) => player.color == data.color,
		)?.connectionId;
		if (!connectionId) {
			return;
		}
		const connections = Array.from(this.room.getConnections());
		const connection = connections.find(
			(connection) => connection.id === connectionId,
		);

		const newLetters = getLetters(3, this.letterPool);
		const response = { message: "peel", data: { letters: newLetters } };
		connection && connection.send(JSON.stringify(response));
		this.broadcastLettersLeft();
	}

	finish(data: any) {
		console.log("Got to finish!");

		const colorCounts: any = {};

		Object.values(this.letterGrid).forEach((row) => {
			const rowObject = row as { [key: string]: any };
			Object.values(rowObject).forEach((cell) => {
				if (cell.color) {
					const color = cell.color;
					if (colorCounts[color]) {
						colorCounts[color]++;
					} else {
						colorCounts[color] = 1;
					}
				}
			});
		});

		console.log("Colors is: " + JSON.stringify(colorCounts));
		this.players.forEach((player) => {
			const matchingColor = Object.keys(colorCounts).find(
				(color) => color === player.color,
			);
			player.score = 0;
			if (matchingColor) {
				player.score = colorCounts[matchingColor];
				if (player.color == data.color) {
					player.score += 10;
				}
			}
		});
		console.log("Players: " + JSON.stringify(this.players));
		const response = { message: "finish", data: { players: this.players } };
		this.room.broadcast(JSON.stringify(response));
		this.gameInProgress = false;
	}

	broadcastLettersLeft() {
		const response = {
			message: "lettersLeft",
			data: { lettersLeft: this.letterPool.length },
		};
		this.room.broadcast(JSON.stringify(response));
	}
}

SpeedWordsServer satisfies Party.Worker;
