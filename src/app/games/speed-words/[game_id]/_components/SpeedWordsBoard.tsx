/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getBgColor } from "@/app/functions/color-functions";

export const getCellLetter = (
	rowNum: any,
	colNum: any,
	letterGrid: { [x: string]: { [x: string]: any } },
): string => {
	if (letterGrid[rowNum] != null) {
		if (letterGrid[rowNum][colNum] != null) {
			return letterGrid[rowNum][colNum];
		}
	}
	return "";
};

const Cell = (props: { isSelected: any; letter: any; isShaded: boolean }) => {
	return (
		<div
			className={`border-1 flex h-8 w-8 items-center justify-center border ${props.isShaded ? "bg-gray-300" : ""} 
			${props.isSelected ? "border-2 border-red-300" : "border-grey-300"}`}
		>
			{props.letter != "" && (
				<div
					className={`text-m flex h-8 w-8 items-center justify-center rounded-sm ${getBgColor(props.letter.color)} font-bold`}
				>
					{props.letter.letter}
				</div>
			)}
		</div>
	);
};
const Row = (props: {
	handleCellPress: any;
	letterGrid: any;
	rowNum: any;
	selectedCell: any;
	autoDirect: string;
}) => {
	const cells = [];
	for (let colNum = 0; colNum < 30; colNum++) {
		const isSelected =
			props.selectedCell[0] == props.rowNum && props.selectedCell[1] == colNum;
		const isShaded =
			(props.selectedCell[0] == props.rowNum &&
				props.autoDirect == "→" &&
				props.selectedCell[1] < colNum) ||
			(props.selectedCell[1] == colNum &&
				props.autoDirect == "↓" &&
				props.selectedCell[0] < props.rowNum);
		cells.push(
			<div
				key={colNum}
				onClick={() => props.handleCellPress([props.rowNum, colNum])}
			>
				<Cell
					letter={getCellLetter(props.rowNum, colNum, props.letterGrid)}
					isSelected={isSelected}
					isShaded={isShaded}
				/>
			</div>,
		);
	}
	return <div className="flex flex-row items-center">{cells}</div>;
};
export const getRows = (
	letterGrid: any,
	selectedCell: any,
	handleCellPress: any,
	autoDirect: string,
) => {
	const rows = [];
	for (let i = 0; i < 30; i++) {
		rows.push(
			<Row
				key={i}
				letterGrid={letterGrid}
				rowNum={i}
				selectedCell={selectedCell}
				handleCellPress={handleCellPress}
				autoDirect={autoDirect}
			/>,
		);
	}
	return rows;
};

export default function SpeedWordsBoard({
	letterGrid,
	selectedCell,
	handleCellPress,
	autoDirect,
}: {
	handleCellPress: any;
	letterGrid: any;
	selectedCell: any;
	autoDirect: string;
}) {
	return (
		<div className="mt-30 mb-100 ml-0">
			{getRows(letterGrid, selectedCell, handleCellPress, autoDirect)}
		</div>
	);
}
