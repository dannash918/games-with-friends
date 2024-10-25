export const getTextColor = (color: string) => {
	switch (color) {
		case "red":
			return "text-red-500";
		case "blue":
			return "text-blue-500";
		case "green":
			return "text-green-500";
		case "yellow":
			return "text-yellow-500";
		case "purple":
			return "text-purple-500";
		case "pink":
			return "text-pink-500";
		case "orange":
			return "text-orange-500";
		case "teal":
			return "text-teal-500";
		case "cyan":
			return "text-cyan-500";
		case "gray":
			return "text-gray-500";
		case "black":
			return "text-black";
		case "white":
			return "text-white";
		case "amber":
			return "text-amber-500";
		case "lime":
			return "text-lime-500";
		case "rose":
			return "text-rose-500";
		case "indigo":
			return "text-indigo-500";
		case "violet":
			return "text-violet-500";
		case "fuchsia":
			return "text-fuchsia-500";
		default:
			return `text-${color}-500`; // default color
	}
};

export const getBgColor = (color: string, _isLight = false) => {
	if (!_isLight) {
		switch (color) {
			case "red":
				return "bg-red-500";
			case "blue":
				return "bg-blue-500";
			case "green":
				return "bg-green-500";
			case "yellow":
				return "bg-yellow-500";
			case "purple":
				return "bg-purple-500";
			case "pink":
				return "bg-pink-500";
			case "orange":
				return "bg-orange-500";
			case "teal":
				return "bg-teal-500";
			case "cyan":
				return "bg-cyan-500";
			case "gray":
				return "bg-gray-500";
			case "black":
				return "bg-black";
			case "white":
				return "bg-white";
			case "amber":
				return "bg-amber-500";
			case "lime":
				return "bg-lime-500";
			case "rose":
				return "bg-rose-500";
			case "indigo":
				return "bg-indigo-500";
			case "violet":
				return "bg-violet-500";
			case "fuchsia":
				return "bg-fuchsia-500";
			default:
				return `bg-${color}-500`; // default color
		}
	}

	switch (color) {
		case "red":
			return "bg-red-700";
		case "blue":
			return "bg-blue-700";
		case "green":
			return "bg-green-700";
		case "yellow":
			return "bg-yellow-700";
		case "purple":
			return "bg-purple-700";
		case "pink":
			return "bg-pink-700";
		case "orange":
			return "bg-orange-700";
		case "teal":
			return "bg-teal-700";
		case "cyan":
			return "bg-cyan-700";
		case "gray":
			return "bg-gray-700";
		case "black":
			return "bg-black";
		case "white":
			return "bg-white";
		case "amber":
			return "bg-amber-700";
		case "lime":
			return "bg-lime-700";
		case "rose":
			return "bg-rose-700";
		case "indigo":
			return "bg-indigo-700";
		case "violet":
			return "bg-violet-700";
		case "fuchsia":
			return "bg-fuchsia-700";
		default:
			return `bg-${color}-700`; // default color
	}
};
