"use client";

import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { generateUUID } from "../functions/device-functions";
import { createExtremeWordsGame } from "../games/extreme-words/_actions/create-extremewords-game";
import { createMusicQuizGame } from "../games/music-quiz/_actions/create-musicquiz-game";
import { createSpeedWordsGame } from "../games/speed-words/_actions/create-speedwords-game";
import { createTheMindGame } from "../games/the-mind/_actions/create-themind-game";

function CreateGameButton() {
	return (
		<Button
			type="submit"
			className={cn("w-full bg-green-500 hover:bg-green-500/90")}
		>
			<div className="flex items-center">
				<Play size={22} className="mr-2" /> Play with a friend
			</div>
		</Button>
	);
}

export default function CreateGameRoomForm({ game }: { game: string }) {
	async function CreateGame(formData: FormData) {
		const name = formData.get("name") as string;
		const room = formData.get("room") as string;
		const deviceId = localStorage.getItem("deviceId") || generateUUID();
		localStorage.setItem("deviceId", deviceId);
		localStorage.setItem("userName", name);

		if (game === "the-mind") {
			await createTheMindGame(room);
		} else if (game === "extreme-words") {
			await createExtremeWordsGame(room);
		} else if (game === "music-quiz") {
			await createMusicQuizGame(room);
		} else if (game === "speed-words") {
			await createSpeedWordsGame(room);
		}
	}

	return (
		<div className="w-full max-w-xs">
			<form
				className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				action={CreateGame}
			>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold text-gray-700">
						Name:
					</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						type="text"
						name="name"
					/>
				</div>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold text-gray-700">
						Room:
					</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						type="text"
						name="room"
					/>
				</div>
				<div className="mb-4">
					<CreateGameButton />
				</div>
			</form>
		</div>
	);
}
