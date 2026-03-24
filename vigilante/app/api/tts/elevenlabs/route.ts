import { NextRequest, NextResponse } from "next/server";
import {
	getGenderForCharacter,
	getVoiceFallbackChain,
	getVoiceForCharacter,
} from "@/lib/ttsCharacterVoices";

const ELEVENLABS_TTS = "https://api.elevenlabs.io/v1/text-to-speech";

/**
 * Free-tier-safe MP3. Do not use mp3_44100_192 (Creator+) or high-end PCM/WAV (Pro+).
 * @see https://elevenlabs.io/docs/api-reference/text-to-speech/convert
 */
const OUTPUT_FORMAT = "mp3_22050_32";

/** Free accounts often cap per-request length; keeps 402s down when quota is tight. */
const MAX_TEXT = 2500;

/**
 * Default `eleven_turbo_v2_5` — same premade voices, noticeably less “flat” than Flash.
 * Set `ELEVENLABS_TTS_MODEL=eleven_flash_v2_5` to maximize monthly character budget.
 */
const TTS_MODEL =
	process.env.ELEVENLABS_TTS_MODEL?.trim() || "eleven_turbo_v2_5";

/**
 * Per-request overrides: lower stability = less monotone / more conversational variation;
 * modest style helps casual delivery without Voice Library / custom voices.
 */
const VOICE_SETTINGS = {
	stability: 0.38,
	similarity_boost: 0.72,
	style: 0.22,
	use_speaker_boost: true,
} as const;

/**
 * Voices must be **premade** IDs only (`lib/ttsCharacterVoices.ts`); Voice Library / clones bill differently.
 */
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

	let upstream = await synthesize(apiKey, primaryVoiceId, clipped);

	/**
	 * 402 = quota / billing / plan. Not “voice unreachable” — but we still try
	 * other premade voices **of the same gender** in case a specific id misbehaves.
	 */
	if (upstream.status === 402) {
		for (const voiceId of getVoiceFallbackChain(gender, primaryVoiceId)) {
			upstream = await synthesize(apiKey, voiceId, clipped);
			if (upstream.ok) break;
			if (upstream.status !== 402) break;
		}
	}

	if (!upstream.ok) {
		const errText = await upstream.text();
		let parsed: unknown;
		try {
			parsed = JSON.parse(errText) as unknown;
		} catch {
			parsed = errText;
		}
		return NextResponse.json(
			{
				error: parsed,
				hint:
					upstream.status === 402
						? "402 = insufficient credits. Flash + premade voices only use your monthly character pool — check Usage on elevenlabs.io or wait for reset."
						: undefined,
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
