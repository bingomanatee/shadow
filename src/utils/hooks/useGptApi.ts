import { useEffect, useState } from 'react';

/**
 * Chat GPT API hook, to use the API, you must add
 * a .env.local with `OPENAI_API_KEY` set to an api
 * key from OpenAI.
 * @see https://beta.openai.com/account/api-keys
 *
 * @param {string} message - Message to send and "ask" GPT about.
 * @returns {string}
 */
const useGptApi = (message: string): string => {
  const [gptResponse, setGptResponse] = useState<string>('');

  useEffect(() => {
    fetch('/api/gpt', {
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    .then((gptResponse) => gptResponse.json())
    .then((gptResponseJson) => setGptResponse(gptResponseJson.content))
    .catch(console.error);
  }, [message]);

  return gptResponse;
};

export default useGptApi;

