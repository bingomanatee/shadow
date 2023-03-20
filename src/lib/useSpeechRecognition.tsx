import { useEffect, useRef, useState } from 'react';

type Props = {
  shouldRecord: boolean
  onMessage(text: string): void
  onProgress(arg: unknown): void
}
/**
 * creates a persistant record emitter
 * @param shouldRecord
 * @param onMessage
 * @param onProgress // emits just to keep the activity alive
 */
const useSpeechRecognition = ({ shouldRecord, onMessage, onProgress }: Props) => {
  const [response, setResponse] = useState({});

  useEffect(() => {
    let recognition: any;

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition || null;

    if (shouldRecord && SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: Event & { results: Record<string, unknown>[] }) => {
        onProgress(event);
        const result = event.results[event.results.length - 1];
        if (result?.isFinal) {
          // @ts-ignore
          const ts: unknown = result[0]?.transcript;
          if (typeof ts === 'string' && ts) {
            onMessage(ts);
          }
        }

      };

      recognition.start();
    }

    return () => {
      // @ts-ignore
      if (recognition && typeof recognition === 'object') {
        recognition?.stop();
      }
    };

  }, [shouldRecord]);

  return response;
};

export default useSpeechRecognition;
