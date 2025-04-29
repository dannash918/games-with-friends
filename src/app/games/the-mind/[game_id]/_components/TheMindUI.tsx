/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { generateUUID } from "@/app/functions/device-functions";
import InfoButton from "@/app/games/_components/info-button";
import { Button } from "@/components/ui/button";
import Select from "@/components/ui/Select";

import giphyLogo from "../../../../../../assets/powered_by_giphy.png";

const DealButton = ({ cardsToDeal, onClick }: any) => {
	return (
		<Button
			className="bg-green-500 px-8 hover:bg-green-500/90"
			onClick={() => onClick(cardsToDeal)}
		>
			DEAL CARDS
		</Button>
	);
};

const Keyboard = ({ cards, onClick, gameState }: any) => {
	return (
		<div>
			<div className="row flex justify-center">
				{cards.map((number: string) => (
					<Button
						className="m-1 px-4 py-6"
						key={number}
						disabled={gameState != "play"}
						onClick={() => onClick(number)}
					>
						<div>{number}</div>
					</Button>
				))}
			</div>
		</div>
	);
};

async function fetchAndProcessGif(
	tag: string,
): Promise<{ height: number; url: string; width: number }> {
	const gifSearchUrl = `https://api.giphy.com/v1/gifs/random?tag=${tag}&api_key=TcX2E9NN88FXG1LTEiZU3SWMNKTUG1Vn`;
	const response = await fetch(gifSearchUrl);
	const gifresp = await response.json();
	const originalImage = gifresp.data.images.original;
	const width = 250;
	const height = (width / originalImage.width) * originalImage.height;

	return {
		url: originalImage.url,
		width: width,
		height: height,
	};
}

export default function TheMindGame({ gameId }: { gameId: string }) {
	const room = gameId;
	const playerName = localStorage.getItem("userName") || "Fred";
	const deviceId = localStorage.getItem("deviceId") || generateUUID();
	const cardOptions = ["1", "2", "3", "4", "5", "6", "7"];
	const initialized = useRef(false);
	const [numbers, setNumbers] = useState<string[]>([]);
	const [cardsToDeal, setCardsToDeal] = useState<string>("2");
	const [totalCards, setTotalCards] = useState();
	const [text, setText] = useState<string[]>([]);
	const [playedCards, setPlayedCards] = useState(0);
	const [cards, setCards] = useState<string[]>([]);
	const [ws, setWs] = useState<WebSocket>();
	const [gif, setGif] = useState<any>();
	const scrollEndRef = useRef<null | HTMLDivElement>(null);
	const [gameOver, setGameOver] = useState<boolean>(false);
	console.log("Device ID: " + deviceId);

	useEffect(() => {
		if (gameOver) {
			return;
		}
		const fetchData = async () => {
			console.log("Numbers: " + JSON.stringify(numbers));
			let tag = "epic win";
			let endGame = "You have won!";
			for (let i = 0; i < numbers.length - 1; i++) {
				if (parseInt(numbers[i]) > parseInt(numbers[i + 1])) {
					console.log("out of order!");
					tag = `fail loser`;
					endGame = "You have lost :(";
				}
			}
			if (numbers.length === totalCards || endGame === "You have lost :(") {
				const gif = await fetchAndProcessGif(tag);
				const newText = [...text];
				newText.push(endGame);
				setText(newText);
				setGif(gif);
				setGameOver(true);
			}
			console.log("In order");
		};
		void fetchData();
	}, [gameOver, numbers, text, totalCards]);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			console.log("Starting up");
			const ws2 = new WebSocket(
				`wss://kke8tbr1y5.execute-api.ap-southeast-2.amazonaws.com/test?room=${room}&name=${playerName}&deviceId=${deviceId}`,
			);
			setWs(ws2);
		}
	}, [room, playerName, deviceId]);

	useEffect(() => {
		console.log("Scrolling");
		scrollEndRef &&
			scrollEndRef.current &&
			scrollEndRef.current.scroll({
				top: scrollEndRef.current.scrollHeight,
				behavior: "smooth",
			});
	});

	if (!ws) {
		return <div>Loading...</div>;
	}

	const handleDeal = (numCards: any) => {
		console.log(`Attempting to deal: ${numCards} cards`);
		const jsonData = { action: "deal", room: room, numCards: cardsToDeal };
		ws.send(JSON.stringify(jsonData));
		const playCardWarmUp = {
			action: "playCard",
			warmUp: true,
		};
		ws.send(JSON.stringify(playCardWarmUp));
	};

	const handleKeyPress = (number: string) => {
		console.log(number + " pressed");
		const jsonData = {
			action: "playCard",
			card: number,
			player: playerName,
			room: room,
		};
		ws.send(JSON.stringify(jsonData));

		// remove from cards
		const newCards = [...cards];
		const index = newCards.indexOf(number);
		if (index > -1) {
			newCards.splice(index, 1);
		}
		setCards(newCards);
	};

	ws.onmessage = function (event) {
		const response = JSON.parse(event.data);
		if (response.handler == "deal") {
			console.log("Getting a deal back");
			console.log("Cards: " + response.cards);
			console.log("Total Cards: " + response.totalCards);
			setCards([]);
			setGif(undefined);
			setCards(response.cards);
			setTotalCards(response.totalCards);
			setNumbers([]);
			setText([]);
			setPlayedCards(0);
			setGameOver(false);
		}
		if (response.handler == "playCard") {
			const newPlayedCards = playedCards + 1;
			setPlayedCards(newPlayedCards);
			console.log("Message returned: playing number");
			const number = response.card;
			const player = response.player;
			const newNumbers = [...numbers];
			newNumbers.push(number);
			setNumbers(newNumbers);
			const newText = [...text];
			const newLine = `${player} played: ${number}`;
			newText.push(newLine);
			setText(newText);
		}
	};

	return (
		<div>
			<div className="row flex justify-evenly">
				{room && <div className="">Room Is Awesome!: {room}</div>}
				{totalCards && (
					<div className="">
						Cards Played: {playedCards} / {totalCards}
					</div>
				)}
			</div>
			<div
				id="scrollable"
				ref={scrollEndRef}
				className="scroll-snap-y-container h-[60vh] overflow-auto"
			>
				<div className="pt-6">
					{text.map((t, idx) => (
						<div key={idx} className="flex justify-center pt-2">
							{t}
						</div>
					))}
				</div>
				{gif && (
					<div className="row flex justify-center pt-2">
						<div>
							<Image
								src={gif.url}
								width={gif.width}
								height={gif.height}
								alt={""}
							/>
							<Image
								src={giphyLogo}
								width={75}
								height={27}
								alt={""}
								className="translate-y-[-100%]"
							/>
						</div>
					</div>
				)}
			</div>

			{!gameOver && (
				<div className="row absolute inset-x-0 bottom-0 flex items-end justify-evenly">
					<Keyboard onClick={handleKeyPress} cards={cards} gameState="play" />
				</div>
			)}
			{(gameOver || !totalCards) && (
				<div className="row absolute inset-x-0 bottom-0 flex items-end justify-evenly">
					<DealButton cardsToDeal={cardsToDeal} onClick={handleDeal} />
					<Select
						defaultValue={cardsToDeal}
						selectItems={cardOptions}
						onChange={setCardsToDeal}
					/>
					<InfoButton game="The Mind" />
				</div>
			)}
		</div>
	);
}
