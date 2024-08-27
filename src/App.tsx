import { useEffect, useState } from "react";
import playedSound from "/first-sound.wav";
import winningSound from "/winning-sound.wav";
import startSound from "/start-sound.wav";
import useSound from "use-sound";
import Confetti from "react-confetti";
import CheckWinner from "./utils/CheckWinner";
import Box from "./Box";
import { ASK_GEMINI } from "./utils/gemini";

function App() {
  const [firstSelection, setFirstSelection] = useState<number[]>([]);
  const [secondSelection, setSecondSelection] = useState<number[]>([]);
  const [playSound] = useSound(playedSound);
  const [playWinningSound] = useSound(winningSound);
  const [playStartSound] = useSound(startSound);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [useBot, setUseBot] = useState<boolean | null>(null);

  const [player, setPlayer] = useState<Player>("One");

  async function handleSelection(index: number) {
    if (firstSelection.length + secondSelection.length === 9) return;
    if (firstSelection.includes(index) || secondSelection.includes(index))
      return;
    if (player === "One") {
      setFirstSelection((prev) => [...prev, index]);
      playSound();
      if (CheckWinner([...firstSelection, index])) {
        setWinner("One");
        playWinningSound();
        setShowConfetti(true);
      }
    } else if (player === "Two") {
      setSecondSelection((prev) => [...prev, index]);
      if (CheckWinner([...secondSelection, index])) {
        setWinner("Two");
        playWinningSound();
        setShowConfetti(true);
      }
      playSound();
    } else {
      const index = await ASK_GEMINI({
        botProgress: secondSelection,
        playerProgress: firstSelection,
      });
      setSecondSelection((prev) => [...prev, index]);
      if (CheckWinner([...secondSelection, index])) {
        setWinner("Bot");
        playWinningSound();
        setShowConfetti(true);
      }
      playSound();
    }
    // setPlayer((prev) => (prev === "One" ? useBot ? : "Bot" "Two" : "One"));
    setPlayer((prev) =>
      prev === "Bot" || prev === "Two" ? "One" : useBot ? "Bot" : "Two"
    );
  }

  function restartGame() {
    setFirstSelection([]);
    setSecondSelection([]);
    setPlayer("One");
    setWinner(null);
    setShowConfetti(false);
    playStartSound();
  }

  useEffect(() => {
    if (player === "Bot" && !winner) {
      console.log("Bot plays");
      handleSelection(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(() => {
    let id: number;
    if (showConfetti) {
      id = setTimeout(() => {
        setShowConfetti(false);
      }, 10_000); //10 secs
    }

    return () => {
      clearTimeout(id);
    };
  }, [showConfetti]);

  const displayPlayer = player === "One" ? 1 : 2;
  const gameOver = firstSelection.length + secondSelection.length === 9;

  return (
    <div className='min-h-[100dvh] bg-stone-800 text-white flex items-center justify-center flex-col gap-10 font-mono'>
      {useBot === null ? (
        <div className='text-center'>
          <h1 className='mb-5 text-2xl'>Select Mode</h1>
          <button
            className='px-8 py-4 bg-purple-500 hover:bg-purple-500/80 mx-4 rounded-xl'
            onClick={() => setUseBot(false)}
          >
            MultiPlayer
          </button>
          <button
            className='px-8 py-4 bg-first hover:bg-first/80 mx-4 rounded-xl text-black'
            onClick={() => setUseBot(true)}
          >
            With Bot
          </button>
        </div>
      ) : (
        <>
          <h1 className='font-mono font-medium text-2xl text-center'>
            {gameOver || winner
              ? `Game finished ✨`
              : `Player ${displayPlayer}`}
            {winner
              ? winner === "One"
                ? "Player 1 won 🚀"
                : "Player 2 won 🎉"
              : gameOver
              ? "Nobody Won 🥱"
              : ""}
          </h1>
          <div className='grid grid-cols-3 w-[22rem] border border-stone-500'>
            {Array.from({ length: 9 }, (_, index) => (
              <Box
                key={index}
                index={index + 1}
                handleSelection={
                  !winner || !gameOver ? handleSelection : undefined
                }
                selected={
                  firstSelection.includes(index + 1)
                    ? "One"
                    : secondSelection.includes(index + 1)
                    ? "Two"
                    : null
                }
              />
            ))}
          </div>
          {showConfetti && (
            <Confetti className='w-[90%] h-100' tweenDuration={130} />
          )}
          {(gameOver || winner) && (
            <button
              className='bg-white px-8 py-3 rounded-xl text-black hover:bg-stone-200'
              onClick={restartGame}
            >
              🔄️ Restart
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
