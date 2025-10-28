import React, { useState, useEffect } from "react";
import "./App.css";

const cardEmojis = ["😎", "😀", "😅", "😛", "😱", "🤩"];

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const shuffleCards = () => {
    const doubled = [...cardEmojis, ...cardEmojis];
    return doubled.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setCards(shuffleCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(20);
    setIsRunning(true);
    setShowModal(false);
  };

  const restartGame = () => {
    startGame();
  };

  const flipCard = (index) => {
    if (!isRunning) return;
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped([...flipped, index]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves((m) => m + 1);
    }
  }, [flipped, cards, matched]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          endGame(false, matched.length / 2);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, matched]);

  const endGame = (completed, matchedPairs = matched.length / 2) => {
    setIsRunning(false);
    if (completed) {
      setModalMessage(`🎉 You Won in ${moves} moves! Matched Pairs: ${matchedPairs}`);
    } else {
      setModalMessage(`⏰ Time Over! You matched ${matchedPairs} pairs.`);
    }
    setShowModal(true);
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      endGame(true, matched.length / 2);
    }
  }, [matched, cards]);

  return (
    <div className="game-container">
      <h1>Memory Match Challenge</h1>
      <p>Match pairs before time runs out!</p>

      <div className="card-container">
        {cards.map((emoji, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={index}
              className={`card ${isFlipped ? "flipped" : ""} ${matched.includes(index) ? "matched" : ""}`}
              onClick={() => flipCard(index)}
            >
              {isFlipped ? emoji : ""}
            </div>
          );
        })}
      </div>

      <p id="score">Moves: {moves}</p>
      <p id="timer">{isRunning ? `Time Remaining: ${time}s` : "Click Start to Begin"}</p>

      <div className="timer-bar">
        <span style={{ width: `${(time / 20) * 100}%` }}></span>
      </div>

      {!isRunning ? (
        <button id="start-button" onClick={startGame}>Start Game</button>
      ) : (
        <button id="restart-button" onClick={restartGame}>Restart Game</button>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modalMessage}</h2>
            <button onClick={restartGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
