import { NextRequest, NextResponse } from "next/server";
import {
	getGenderForCharacter,
	getVoiceForCharacter,
} from "@/lib/ttsCharacterVoices";

const ELEVENLABS_TTS = "https://api.elevenlabs.io/v1/text-to-speech";

const OUTPUT_FORMAT = "mp3_22050_32";
const MAX_TEXT = 2500;

const TTS_MODEL =
	process.env.ELEVENLABS_TTS_MODEL?.trim() || "eleven_turbo_v2_5";

const VOICE_SETTINGS = {
	stability: 0.38,
	similarity_boost: 0.72,
	style: 0.22,
	use_speaker_boost: true,
} as const;

const TTS_BODY = (text: string) => ({
	text,
	model_id: TTS_MODEL,
	language_code: "en",
	voice_settings: VOICE_SETTINGS,
});

async function synthesize(
	apiKey: string,
	voiceId: string,
	text: string,
): Promise<Response> {
	const url = new URL(`${ELEVENLABS_TTS}/${voiceId}`);
	url.searchParams.set("output_format", OUTPUT_FORMAT);

	return fetch(url.toString(), {
		method: "POST",
		headers: {
			"xi-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "audio/mpeg",
		},
		body: JSON.stringify(TTS_BODY(text)),
	});
}

export async function POST(req: NextRequest) {
	const apiKey = process.env.ELEVENLABS_API_KEY;
	if (!apiKey?.trim()) {
		return NextResponse.json(
			{ error: "Missing ELEVENLABS_API_KEY on the server" },
			{ status: 500 },
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
	const characterId =
		typeof (body as { characterId?: unknown }).characterId === "string"
			? (body as { characterId: string }).characterId.trim()
			: "";

	if (!text || !characterId) {
		return NextResponse.json(
			{ error: "Expected non-empty text and characterId" },
			{ status: 400 },
		);
	}

	const clipped = text.length > MAX_TEXT ? text.slice(0, MAX_TEXT) : text;
	const primaryVoiceId = getVoiceForCharacter(characterId);
	const gender = getGenderForCharacter(characterId);

	// Detailed logging to diagnose voice issues
	console.log("[TTS] characterId:", characterId, "| voiceId:", primaryVoiceId, "| gender:", gender);
	console.log("[TTS] Request payload:", { text: clipped.substring(0, 100), voice: primaryVoiceId, model: TTS_MODEL });

	const upstream = await synthesize(apiKey, primaryVoiceId, clipped);

	console.log("[TTS] Response status:", upstream.status, upstream.statusText, "| OK:", upstream.ok);

	if (!upstream.ok) {
		const errText = await upstream.text();
		console.error("[TTS] ElevenLabs error response:", errText);
		let parsed: unknown;
		try {
			parsed = JSON.parse(errText) as unknown;
		} catch {
			parsed = errText;
		}
		return NextResponse.json(
			{
				error: "TTS synthesis failed",
				details: parsed,
				voiceId: primaryVoiceId,
				characterId,
			},
			{ status: upstream.status },
		);
	}

	const buf = await upstream.arrayBuffer();
	return new NextResponse(buf, {
		status: 200,
		headers: {
			"Content-Type": "audio/mpeg",
			"Cache-Control": "private, max-age=300",
		},
	});
}
