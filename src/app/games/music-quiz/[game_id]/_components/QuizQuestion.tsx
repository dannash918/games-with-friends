/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import PartySocket from "partysocket";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { AnswerOption, QuestionWithAnswer } from "../../_party/musicquiz";

interface QuizQuestionProps {
	socket: PartySocket;
	token: string | undefined;
}

export default function QuizQuestion({ socket, token }: QuizQuestionProps) {
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [questionData, setQuestionData] = useState<QuestionWithAnswer>();
	const initialized = useRef(false);

	const getQuestion = () => {
		setQuestionData(undefined);
		setSelectedAnswer(null);
		setIsCorrect(null);
		console.log("Getting Question!");
		socket.send(
			JSON.stringify({ message: "getQuestion", data: { token: token } }),
		);
	};

	const handleAnswerClick = (answer: AnswerOption) => {
		setSelectedAnswer(answer.answer);
		setIsCorrect(answer.isCorrect);
	};

	socket.onmessage = (response) => {
		const mess = JSON.parse(response.data);
		if (mess.message === "getQuestion") {
			console.log("Got Question back! : " + JSON.stringify(mess.data));
			setQuestionData(mess.data.questionData);
		}
	};

	// Call getQuestion on component mount
	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			console.log("Component mounted, calling getQuestion");
			getQuestion();
		}
	}, []); // Empty dependency array ensures this runs only once

	return (
		<div className="flex flex-col items-center p-4">
			{!questionData && (
				<div className="flex items-center justify-center">
					<Spinner />
				</div>
			)}
			{questionData && (
				<div className="quiz-container mx-auto w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
					<h2 className="mb-4 text-center text-xl font-bold text-gray-800">
						{questionData.question}
					</h2>
					{questionData.pictureUrl && (
						<div className="relative mx-auto mb-4 flex h-24 w-64 overflow-hidden">
							<Image
								src={questionData.pictureUrl}
								alt="Album Artwork (Top Quarter)"
								layout="fill"
								objectFit="cover"
								objectPosition="top"
							/>
						</div>
					)}
					<div className="answers flex flex-col items-center gap-4">
						{questionData.answers.map((answer, index) => (
							<button
								key={index}
								onClick={() => handleAnswerClick(answer)}
								className={`answer-button w-full max-w-md rounded border px-4 py-2 font-medium text-gray-800 ${
									selectedAnswer === answer.answer
										? answer.isCorrect
											? "border-green-500 bg-green-500 text-white"
											: "border-red-500 bg-red-500 text-white"
										: "bg-gray-200 hover:bg-gray-300"
								}`}
							>
								{answer.answer}
							</button>
						))}
					</div>
					{selectedAnswer && (
						<div
							className={`result mt-4 text-center text-lg font-semibold ${
								isCorrect ? "text-green-600" : "text-red-600"
							}`}
						>
							{isCorrect ? "Correct!" : "Wrong answer. Try again!"}
						</div>
					)}
				</div>
			)}
			<div className="mt-4">
				<Button onClick={getQuestion}>Next Question</Button>
			</div>
		</div>
	);
}
