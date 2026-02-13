export type ApiError = {
	code: number;
	message: string;
};

export const ApiErrors = {
	NETWORK_ERROR: {
		code: 0,
		message: "Network error. Please try again later.",
	},
	INVALID_CREDENTIALS: { code: 401, message: "Invalid email or password." },
	UNAUTHORIZED: {
		code: 403,
		message: "You are not authorized to perform this action.",
	},
	FORM_VALIDATION: {
		code: 400,
		message: "Please check the form for errors.",
	},
	USER_NOT_FOUND: { code: 404, message: "User does not exist." },
	SERVER_ERROR: { code: 500, message: "Something went wrong on the server." },
} as const;
