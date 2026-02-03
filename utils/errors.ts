export type ApiError = {
	code: number;
	message: string;
};

export const ApiErrors = {
	USER_NOT_FOUND: { code: 404, message: "User does not exist." },
	INVALID_CREDENTIALS: { code: 401, message: "Invalid email or password." },
	UNAUTHORIZED: {
		code: 403,
		message: "You are not authorized to perform this action.",
	},
	SERVER_ERROR: { code: 500, message: "Something went wrong on the server." },
	NETWORK_ERROR: {
		code: 0,
		message: "Network error. Please try again later.",
	},
	FORM_VALIDATION: {
		code: 400,
		message: "Please check the form for errors.",
	},
} as const;
