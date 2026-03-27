import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "buffer";

const INWORLD_TTS_URL = "https://api.inworld.ai/tts/v1/voice";

/**
 * InWorld AI TTS endpoint
 * Docs: https://docs.inworld.ai/api-reference/ttsAPI/texttospeech/synthesize-speech
 *
 * Requires INWORLD_API_KEY in .env.local (Base64 encoded API key from InWorld portal)
 */
export async function POST(req: NextRequest) {
	const apiKey = process.env.INWORLD_API_KEY;
	if (!apiKey?.trim()) {
		return NextResponse.json(
			{ error: "Missing INWORLD_API_KEY on the server" },
			{ status: 500 }
		);
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const text =
		typeof (body as { text?: unknown }).text === "string"
			? (body as { text: string }).text.trim()
			: "";
	const voiceId =
		typeof (body as { voiceId?: unknown }).voiceId === "string"
			? (body as { voiceId: string }).voiceId.trim()
			: "";
	const modelId =
		typeof (body as { modelId?: unknown }).modelId === "string"
			? (body as { modelId: string }).modelId.trim()
			: "inworld-tts-1.5-max"; // default model

	if (!text || !voiceId) {
		return NextResponse.json(
			{ error: "Expected non-empty text and voiceId" },
			{ status: 400 }
		);
	}

	try {
		const response = await fetch(INWORLD_TTS_URL, {
			method: "POST",
			headers: {
				"Authorization": `Basic ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text,
				voiceId,
				modelId,
			}),
		});

		if (!response.ok) {
			const errText = await response.text();
			console.error("[InWorld TTS] Error:", response.status, errText);
			return NextResponse.json(
				{ error: "InWorld TTS failed", details: errText },
				{ status: response.status }
			);
		}

		// InWorld returns JSON with base64-encoded audio
		const data = await response.json();
		const audioContent = data.audioContent;
		if (!audioContent) {
			throw new Error("No audioContent in response");
		}

		// Decode base64 to binary
		const audioBuffer = Buffer.from(audioContent, "base64");

		return new NextResponse(audioBuffer, {
			status: 200,
			headers: {
				"Content-Type": "audio/mpeg",
				"Cache-Control": "private, max-age=300",
			},
		});
	} catch (error) {
		console.error("[InWorld TTS] Exception:", error);
		return NextResponse.json(
			{ error: "Failed to synthesize speech", details: String(error) },
			{ status: 500 }
		);
	}
}
