/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";

// import SpotifyPlayer from "react-spotify-web-playback";
import { Button } from "@/components/ui/button";
import { PARTYKIT_HOST } from "@/lib/env";

import QuizQuestion from "./QuizQuestion";

export default function MusicQuizUI({ gameId }: { gameId: string }) {
	const room = gameId;
	const [callbackUri, setCallbackUri] = useState<string | undefined>(undefined);
	console.log("NEW Music quiz room is: " + room);
	const CLIENT_ID = "8b0c0a8afa3f497497fc9955bf27f527";
	const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
	const RESPONSE_TYPE = "token";
	const scope =
		"streaming user-read-email user-read-private user-read-playback-state user-top-read user-modify-playback-state user-library-read user-library-modify";

	const [quizStart, setQuizStart] = useState<boolean>(false);
	const [token, setToken] = useState<string | undefined>(undefined);

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: gameId,
		party: "musicquiz",
	});

	socket.onmessage = (response) => {
		const mess = JSON.parse(response.data);
		if (mess.message === "startGame") {
			console.log("Starting the game!");
		}
		if (mess.message === "getTopArtists") {
			console.log("Got Top Artists back! : " + JSON.stringify(mess.data));
			if (mess.data.success === true) {
				console.log("Successful mission!");
				startQuiz();
			}
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token") || undefined;
		setToken(token);
		const REDIRECT_URI =
			window.location.protocol +
			"//" +
			location.host +
			"/games/music-quiz/callback";
		setCallbackUri(REDIRECT_URI);
		console.log(REDIRECT_URI);
	}, []);

	const startQuiz = () => {
		setQuizStart(!quizStart);
	};

	localStorage.setItem("room", room);
	const storageRoom = localStorage.getItem("room");
	const token2 = localStorage.getItem("token");
	console.log("Room is: " + storageRoom + "Token is: " + token2);

	return (
		<div>
			{!quizStart && (
				<div>
					<div>Welcome to the Music Quiz game!</div>
					{!token && (
						<a
							href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${callbackUri}&response_type=${RESPONSE_TYPE}&scope=${scope}`}
						>
							<Button>Login to Spotify</Button>
						</a>
					)}
					{token && <div>Successfully logged in</div>}
					<br />
					{token && <Button onClick={startQuiz}>Start Quiz</Button>}
				</div>
			)}
			{quizStart && (
				<QuizQuestion socket={socket} token={token} />
				// <SpotifyPlayer
				// 	token={token}
				// 	uris={["spotify:artist:3zxKH0qp3nBCuPZCZT5Vaf"]}
				// />
			)}
		</div>
	);
}
