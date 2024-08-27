import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

const model = GEMINI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function ASK_GEMINI({
  botProgress,
  playerProgress,
}: {
  botProgress: number[];
  playerProgress: number[];
}) {
  try {
    const res = await model.generateContent(
      `
      you are playing tictactoe to win. it has box from 1 to 9, and index starts from 1, not zero \n
      here is player 1 progress, ${playerProgress.toString()}\n
      here is your progress,  ${botProgress.toString()}\n
      what is your next wining move\n
      give me just an integer\n
        example response: {"next_move": "5"} \n
        play to win
      `,
      {
        timeout: 10_000,
      }
    );

    const data = res.response;
    const text = data.text();

    console.log("RESPONSE", text);

    const decoded = JSON.parse(text);
    const move = parseInt(decoded?.next_move);

    if (!Number.isNaN(move)) {
      return move;
    } else throw "Could not decode result";
  } catch {
    throw "Could not get suggestions! 😥";
  }
}
