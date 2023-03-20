import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Handler function for the /api/gpt endpoint.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 * @returns {Promise<void>} A Promise that resolves when the response has been sent.
 */
const postGpt = (req: NextApiRequest, res: NextApiResponse): void => {
  fetch('https://api.openai.com/v1/chat/completions', {
    body: JSON.stringify({
      messages: [req.body.message],
      model: 'gpt-3.5-turbo',
    }),
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  .then((response) => response.json())
  .then((responseJson) => {
    res.json({
      content: responseJson.choices[0].message.content,
      role: 'system'
    });
  })
  .catch((error) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send(error.message);
  });
};

export default postGpt;
