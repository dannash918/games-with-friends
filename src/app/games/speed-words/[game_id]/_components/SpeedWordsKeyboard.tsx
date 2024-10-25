/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { getBgColor } from "@/app/functions/color-functions";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const Keyboard = ({
	letters,
	onKeyPress,
	sendPeel,
	setIsDump,
	color,
	handleBackSpace,
	lettersLeft,
	isDump,
	isActive,
}: any) => {
	const kl = [...letters];
	const keyRows = [];
	while (kl.length >= 10) {
		const row = kl.splice(0, 9);
		keyRows.push(row);
	}
	keyRows.push(kl);

	return (
		<div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
			{isActive && (
				<div className="flex-col">
					{keyRows.map((kr, idx) => (
						<KeyboardRow
							key={idx}
							rowLetters={kr}
							onKeyPress={onKeyPress}
							color={color}
							isDump={isDump}
						/>
					))}
					<div className="mb-4 flex items-center justify-center">
						<div onClick={() => handleBackSpace()}>
							<div className="mx-3 my-2 rounded-md bg-blue-500 p-3">
								<div className="text-sm font-medium">⌫</div>
							</div>
						</div>
						<div onClick={() => setIsDump()}>
							<div
								className={`mx-3 my-2 rounded-md ${isDump ? "bg-blue-700" : "bg-blue-500"} p-3`}
							>
								<div className="text-sm font-medium">DUMP</div>
							</div>
						</div>
						<div onClick={() => sendPeel(letters.length)}>
							<div
								className={`mx-3 my-2 rounded-md ${letters.length != 0 ? "bg-gray-300" : "bg-blue-500"} p-3`}
							>
								{lettersLeft != 0 ? (
									<div className="text-sm font-medium">PEEL</div>
								) : (
									<div className="text-sm font-medium">WIN!</div>
								)}
							</div>
						</div>
					</div>
					<div className="flex items-center justify-evenly">
						<div>Letters Left: {lettersLeft}</div>
					</div>
				</div>
			)}
		</div>
	);
};

const KeyboardRow = ({ onKeyPress, rowLetters, color, isDump }: any) => (
	<div className="mb-2 flex justify-center">
		{rowLetters.map((letter: any, idx: any) => (
			<div key={idx} onClick={() => onKeyPress(letter, idx)}>
				<div
					className={`m-0.5 rounded-md ${getBgColor(color, isDump)} hover:${getBgColor(color)} p-3`}
				>
					<div className="px-1 text-sm font-medium">{letter}</div>
				</div>
			</div>
		))}
	</div>
);
