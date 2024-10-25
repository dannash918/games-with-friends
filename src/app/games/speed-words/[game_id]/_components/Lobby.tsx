/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PartySocket from "partysocket";
import React from "react";

import { getTextColor } from "@/app/functions/color-functions";
import { Button } from "@/components/ui/button";

export default function Lobby({
	socket,
	players,
}: {
	players: any[];
	socket: PartySocket;
}) {
	const sendStartGame = () => {
		socket.send(JSON.stringify({ message: "startGame" }));
	};

	players.sort((a, b) => b.score - a.score);
	const winner = players.find((player) => player.score > -1);

	return (
		<>
			<div className="items-center justify-center">
				<div className="row flex items-center justify-center">
					Welcome to Speed Words
				</div>
				<div className="row flex items-center justify-center">
					Room: {socket.room}
				</div>

				{winner && (
					<div className="row m-2 flex items-center justify-center">
						Congratulations {winner.name}!
					</div>
				)}

				<div className="row mb-2 mt-3 flex items-center justify-center">
					{winner && <div>Scores</div>}
					{!winner && <div>Players</div>}
				</div>
				{players.map((player: any, idx: number) => (
					<div className={`row flex items-center justify-center `} key={idx}>
						<div className={getTextColor(player.color)}>{player.name}</div>
						{player.score > -1 && (
							<div className={getTextColor(player.color)}>: {player.score}</div>
						)}
					</div>
				))}
			</div>
			<div className="mt-6 flex flex-col items-center">
				<Button
					className={`transform bg-green-500 px-4 hover:bg-green-500/90`}
					onClick={() => sendStartGame()}
				>
					<div className="flex items-center">
						{winner != undefined ? "Restart Round" : "Start Round"}
					</div>
				</Button>
			</div>
		</>
	);
}
