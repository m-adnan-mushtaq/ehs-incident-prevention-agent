from deepgram import DeepgramClient

from app.core.config_loader import settings


class DeepgramService:
    def __init__(self):
        self._client = DeepgramClient(api_key=settings.DEEPGRAM_API_KEY)

    def transcribe_file(self, local_path: str) -> str:
        with open(local_path, "rb") as audio_file:
            response = self._client.listen.v1.media.transcribe_file(
                request=audio_file.read(),
                model="nova-3",
                language="en",
                smart_format=True,
            )
        return self._extract_transcript(response)

    @staticmethod
    def _extract_transcript(response) -> str:
        try:
            return response.results.channels[0].alternatives[0].transcript.strip()
        except (AttributeError, IndexError, TypeError, KeyError):
            if isinstance(response, dict):
                return (
                    response.get("results", {})
                    .get("channels", [{}])[0]
                    .get("alternatives", [{}])[0]
                    .get("transcript", "")
                    .strip()
                )
        return ""


deepgram_service = DeepgramService()
