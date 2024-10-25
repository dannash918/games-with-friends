/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const initLetterPool = () => {
	// Full bananagrams tileset
	const fullLetters = [
		"J",
		"J",
		"K",
		"K",
		"Q",
		"Q",
		"X",
		"X",
		"Z",
		"Z",
		"B",
		"B",
		"B",
		"C",
		"C",
		"C",
		"F",
		"F",
		"F",
		"H",
		"H",
		"H",
		"M",
		"M",
		"M",
		"P",
		"P",
		"P",
		"V",
		"V",
		"V",
		"W",
		"W",
		"W",
		"Y",
		"Y",
		"Y",
		"G",
		"G",
		"G",
		"G",
		"L",
		"L",
		"L",
		"L",
		"L",
		"D",
		"D",
		"D",
		"D",
		"D",
		"D",
		"S",
		"S",
		"S",
		"S",
		"S",
		"S",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
		"N",
		"N",
		"N",
		"N",
		"N",
		"N",
		"N",
		"N",
		"T",
		"T",
		"T",
		"T",
		"T",
		"T",
		"T",
		"T",
		"T",
		"R",
		"R",
		"R",
		"R",
		"R",
		"R",
		"R",
		"R",
		"R",
		"O",
		"O",
		"O",
		"O",
		"O",
		"O",
		"O",
		"O",
		"O",
		"O",
		"O",
		"I",
		"I",
		"I",
		"I",
		"I",
		"I",
		"I",
		"I",
		"I",
		"I",
		"I",
		"I",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
	];

	// smaller set for debugging
	const letters = [
		"J",
		"K",
		"Q",
		"X",
		"Z",
		"B",
		"B",
		"C",
		"C",
		"F",
		"F",
		"H",
		"H",
		"M",
		"M",
		"P",
		"P",
		"V",
		"V",
		"W",
		"W",
		"Y",
		"Y",
		"G",
		"G",
		"L",
		"L",
		"L",
		"D",
		"D",
		"D",
		"S",
		"S",
		"S",
		"U",
		"U",
		"U",
		"N",
		"N",
		"N",
		"N",
		"T",
		"T",
		"T",
		"T",
		"R",
		"R",
		"R",
		"R",
		"O",
		"O",
		"O",
		"O",
		"O",
		"O",
		"I",
		"I",
		"I",
		"I",
		"I",
		"I",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"A",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
		"E",
	];

	const tinyLetters = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
	];
	console.log("Initing Letter Pool");
	return fullLetters;
};

export const initLetterGrid = (letter: string) => {
	const letterGrid = {
		0: {},
		1: {},
		2: {},
		3: {},
		4: {},
		5: {},
		6: {},
		7: {},
		8: {},
		9: {},
		10: {},
		11: {},
		12: {},
		13: {},
		14: {},
		15: { 15: { letter: letter, color: "teal" } },
		16: {},
		17: {},
		18: {},
		19: {},
		20: {},
		21: {},
		22: {},
		23: {},
		24: {},
		25: {},
		26: {},
		27: {},
		28: {},
		29: {},
		30: {},
		31: {},
		32: {},
		33: {},
		34: {},
		35: {},
		36: {},
		37: {},
		38: {},
		39: {},
	};
	return letterGrid;
};

export const getLetters = (numLetters: any, letterPool: any[]) => {
	letterPool.sort(() => 0.5 - Math.random());
	const selectedLetters = letterPool.splice(0, numLetters);
	return selectedLetters;
};

export const getColor = (colors: string[]) => {
	colors.sort(() => 0.5 - Math.random());
	const color = colors.splice(0, 1);
	return color[0];
};

// export const handleLetterPress = (
// 	autoDirect: string,
// 	selectedCell: number[],
// 	letter: any,
// 	letterGrid: { [x: string]: { [x: string]: any } },
// 	setLetterGrid: (arg0: any) => void,
// 	setSelectedCell: any,
// 	keyboardLetters: any[],
// 	setKeyBoardLetters: (arg0: any) => void,
// 	idx: any,
// ) => {
// 	const existingLetter = letterGrid[selectedCell[0]][selectedCell[1]];
// 	// todo this could be refactored/combined with backspace press somehow
// 	const newLetterGrid = letterGrid;
// 	newLetterGrid[selectedCell[0]][selectedCell[1]] = {
// 		letter: letter,
// 		color: "purple",
// 	};
// 	setLetterGrid({ ...letterGrid, newLetterGrid });

// 	// Change selectedCell location
// 	const cellNum = selectedCell;
// 	if (autoDirect == "→") {
// 		if (cellNum[1] < 39) {
// 			cellNum[1] = selectedCell[1] + 1;
// 		}
// 	} else {
// 		if (cellNum[0] < 39) {
// 			cellNum[0] = selectedCell[0] + 1;
// 		}
// 	}

// 	// remove letter from keyboard row
// 	// todo passing idx is a messy way of removing letters from keyboardRow, probably need to clean that up
// 	keyboardLetters.splice(idx, 1);
// 	if (existingLetter) {
// 		keyboardLetters.push(existingLetter);
// 	}
// 	setKeyBoardLetters(keyboardLetters);
// 	setSelectedCell(cellNum[0], cellNum[1]); //setSelectedCell(cellNum);
// };

// export const handleBackspacePress = (
// 	autoDirect: string,
// 	selectedCell: any,
// 	letterGrid: any,
// 	setLetterGrid: any,
// 	setSelectedCell: any,
// 	keyboardLetters: any,
// 	setKeyBoardLetters: any,
// ) => {
// 	const letter = letterGrid[selectedCell[0]][selectedCell[1]];
// 	if (letter != undefined && letter != "") {
// 		keyboardLetters.push(letter);
// 		setKeyBoardLetters(keyboardLetters);
// 	}

// 	// deletes letter in existing space
// 	const newLetterGrid = letterGrid;
// 	newLetterGrid[selectedCell[0]][selectedCell[1]] = "";
// 	setLetterGrid({ ...letterGrid, newLetterGrid });

// 	const cellNum = selectedCell;
// 	if (autoDirect == "→") {
// 		if (cellNum[1] > 0) {
// 			cellNum[1] = cellNum[1] - 1;
// 		}
// 	} else {
// 		if (cellNum[0] > 0) {
// 			cellNum[0] = cellNum[0] - 1;
// 		}
// 	}
// 	setSelectedCell(cellNum[0], cellNum[1]);
// };
