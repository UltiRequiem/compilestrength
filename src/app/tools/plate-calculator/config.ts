// Tolerance for floating point precision when calculating plate combinations
export const PLATE_WEIGHT_TOLERANCE = 0.01;

export const plateConfigs = {
	kg: [
		{ weight: 25, color: "bg-red-600", count: 0 },
		{ weight: 20, color: "bg-blue-600", count: 0 },
		{ weight: 15, color: "bg-yellow-600", count: 0 },
		{ weight: 10, color: "bg-green-600", count: 0 },
		{ weight: 5, color: "bg-white text-black", count: 0 },
		{ weight: 2.5, color: "bg-red-800", count: 0 },
		{ weight: 1.25, color: "bg-gray-600", count: 0 },
	],
	lbs: [
		{ weight: 45, color: "bg-red-600", count: 0 },
		{ weight: 35, color: "bg-blue-600", count: 0 },
		{ weight: 25, color: "bg-yellow-600", count: 0 },
		{ weight: 10, color: "bg-green-600", count: 0 },
		{ weight: 5, color: "bg-white text-black", count: 0 },
		{ weight: 2.5, color: "bg-red-800", count: 0 },
	],
};
