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
	winner = undefined,
}: {
	players: any[];
	socket: PartySocket;
	winner: string | undefined;
}) {
	const sendStartGame = () => {
		socket.send(JSON.stringify({ message: "startGame" }));
	};

	console.log("Players: " + JSON.stringify(players));

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
					<div className="row my-5 flex items-center justify-center">
						WINNER OF ROUND IS: {winner}!!
					</div>
				)}
				<div className="row flex items-center justify-center">
					<div>Players</div>
				</div>
				{players.map((player: any, idx: number) => (
					<div className={`row flex items-center justify-center `} key={idx}>
						<div className={getTextColor(player.color)}>{player.name}</div>
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
