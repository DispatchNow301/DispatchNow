import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Generation parameters
const MAX_OUTPUT_TOKENS = 150;
const TEMPERATURE = 0.7;

interface DialogueRequest {
	character: {
		id: string;
		name: string;
		role: string;
		personality?: string;
		portrait: string;
	};
	context: {
		overallStory?: string;
		pastIncidents?: Array<{
			type: string;
			resolution: string;
			outcome?: string;
			date?: string;
		}>;
		currentIncident?: {
			type: string;
			description: string;
			location?: string;
			severity?: string;
		};
		situation?: string;
	};
}

function buildPrompt(req: DialogueRequest): string {
	const lines: string[] = [];

	lines.push("You are writing dialogue for a noir-style vigilante game.");
	lines.push(`Write EXACTLY 3 SEPARATE lines that ${req.character.name} says.`);
	lines.push(`IMPORTANT: ${req.character.name} is the one speaking. Use first person: I, me, my.`);
	lines.push("Each line must be a self-contained thought with 1-2 sentences maximum. Never combine them.");

	if (req.context.overallStory) {
		lines.push(`\nThe story: ${req.context.overallStory}`);
	}

	if (req.context.pastIncidents && req.context.pastIncidents.length > 0) {
		lines.push("\nWhat happened lately:");
		req.context.pastIncidents.forEach((inc, i) => {
			lines.push(`- ${inc.type}: ${inc.resolution}${inc.outcome ? ` - ${inc.outcome}` : ""}`);
		});
	}

	if (req.context.currentIncident) {
		lines.push(`\nRight now: ${req.context.currentIncident.type}${req.context.currentIncident.location ? ` at ${req.context.currentIncident.location}` : ""}. ${req.context.currentIncident.description}`);
	}

	if (req.context.situation) {
		lines.push(`\nContext: ${req.context.situation}`);
	}

	if (req.character.personality) {
		lines.push(`\n${req.character.name} is: ${req.character.personality}`);
	}

	lines.push("\nWRITE EXACTLY 3 SEPARATE LINES. Each line starts with a label in square brackets. DO NOT include the label in the dialogue text itself.");
	lines.push("[PAST] Reference a past incident from what happened lately. Reflect the character's personality.");
	lines.push("[CURRENT] Reference the current incident (right now). Reflect the character's personality.");
	lines.push("[STORY] Reference the overall story/situation. Reflect the character's personality.");
	lines.push("\nPlace '---' (three dashes) on a separate line between each dialogue. Example:");
	lines.push("[PAST] The dialogue text here.");
	lines.push("---");
	lines.push("[CURRENT] The dialogue text here.");
	lines.push("---");
	lines.push("[STORY] The dialogue text here.");
	lines.push("\nRULES - FOLLOW EXACTLY:");
	lines.push(" - After the label, write only the dialogue text. Do NOT repeat the label in your text.");
	lines.push(" - Each line must have exactly 1-2 sentences. NO EXCEPTIONS.");
	lines.push(" - First person only: I, me, my, mine. Character speaks about themselves.");
	lines.push(" - Simple English only: short words, common words, casual speech.");
	lines.push(" - NEVER use em dashes (—) or semicolons (;). Not even once.");
	lines.push(" - No fancy writing. No complex words. No filler phrases.");
	lines.push(" - Do not use character titles. Use name only when needed.");
	lines.push(" - Output ONLY the 3 lines with labels, separated by '---' on separate lines.");
	lines.push(" - Nothing else. No explanations. No numbering.");

	return lines.join("\n");
}

export async function POST(req: NextRequest) {
	const apiKey = process.env.GROQ_API_KEY;
	if (!apiKey?.trim()) {
		return NextResponse.json(
			{ error: "Missing GROQ_API_KEY on the server" },
			{ status: 500 }
		);
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const { character, context } = body as DialogueRequest;
	if (!character?.name || !context) {
		return NextResponse.json(
			{ error: "Expected character and context" },
			{ status: 400 }
		);
	}

	const prompt = buildPrompt({ character, context });

	try {
		const response = await fetch(GROQ_API_URL, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "moonshotai/kimi-k2-instruct",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				temperature: TEMPERATURE,
				max_tokens: MAX_OUTPUT_TOKENS,
			}),
		});

		if (!response.ok) {
			const errText = await response.text();
			return NextResponse.json(
				{ error: "Groq API error", details: errText },
				{ status: response.status }
			);
		}

		const data = await response.json();
		// Chat Completions response format: choices[0].message.content
		const generatedText = data?.choices?.[0]?.message?.content;

		if (!generatedText) {
			return NextResponse.json(
				{ error: "No dialogue generated" },
				{ status: 500 }
			);
		}

		// Parse the generated text to extract labeled lines
		// Expected format: [TYPE] Dialogue text --- [TYPE] Dialogue text --- [TYPE] Dialogue text
		// But also handle cases where AI doesn't use separators correctly

		// Find all matches of [TYPE] followed by text
		// This regex finds each labeled section and captures the type and content
		const labelPattern = /\[(PAST|CURRENT|STORY)\]\s*([\s\S]*?)(?=\[(?:PAST|CURRENT|STORY)\]|$)/g;
		const matches = [];
		let match;
		while ((match = labelPattern.exec(generatedText)) !== null) {
			let text = match[2].trim();
			// Remove trailing --- if present
			text = text.replace(/---\s*$/, '');
			matches.push({
				type: match[1].toLowerCase() as 'past' | 'current' | 'story',
				text: text.trim()
			});
		}

		// If we didn't find any labeled sections, fallback to the old method
		const parsedLines = matches.length > 0 ? matches : [];

		return NextResponse.json({
			lines: parsedLines
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to generate dialogue", details: String(error) },
			{ status: 500 }
		);
	}
}
