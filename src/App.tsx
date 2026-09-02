/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AIDifficulty, BoardState, CellCoord, GameMode, Player, ScoreState, WinResult } from './types';
import { checkWinner, createEmptyBoard, getLowestEmptyRow, isBoardFull } from './utils/connectFour';
import { getAIMove } from './utils/ai';
import {
  initAudio,
  playChimeSound,
  playClickSound,
  playDrawSound,
  playDropSound,
  playWinSound,
  setSoundMuted,
  startBgm,
  stopBgm,
  toggleBgm,
} from './utils/sound';
import { ScoreBoard } from './components/ScoreBoard';
import { Board } from './components/Board';
import { GameControls } from './components/GameControls';
import { HowToPlay } from './components/HowToPlay';

export default function App() {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('RED');
  const [winnerResult, setWinnerResult] = useState<WinResult | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('AI');
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>('MEDIUM');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [lastMove, setLastMove] = useState<CellCoord | null>(null);
  const [isMuted, setIsMutedState] = useState<boolean>(false);
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);
  const [showScanlines, setShowScanlines] = useState<boolean>(true);

  // Persistent score
  const [score, setScore] = useState<ScoreState>(() => {
    try {
      const saved = localStorage.getItem('connect4_scores');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return { red: 0, yellow: 0, draws: 0 };
  });

  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save scores to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('connect4_scores', JSON.stringify(score));
    } catch {
      // Ignore
    }
  }, [score]);

  // User column click handler (Human player)
  const handleColumnClick = (col: number) => {
    if (winnerResult || isDraw || isAiThinking) return;
    if (gameMode === 'AI' && currentPlayer !== 'RED') return;

    const row = getLowestEmptyRow(board, col);
    if (row === -1) return;

    const nextBoard = board.map(r => [...r]);
    nextBoard[row][col] = currentPlayer;

    setBoard(nextBoard);
    setLastMove({ row, col });
    playDropSound(row);

    // Check win condition
    const win = checkWinner(nextBoard);
    if (win) {
      setWinnerResult(win);
      playWinSound();
      setScore(prev => ({
        ...prev,
        red: win.winner === 'RED' ? prev.red + 1 : prev.red,
        yellow: win.winner === 'YELLOW' ? prev.yellow + 1 : prev.yellow,
      }));
      return;
    }

    // Check draw condition
    if (isBoardFull(nextBoard)) {
      setIsDraw(true);
      playDrawSound();
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    // Switch turn
    setCurrentPlayer(currentPlayer === 'RED' ? 'YELLOW' : 'RED');
  };

  // Trigger AI move when it is YELLOW's turn in AI mode
  useEffect(() => {
    if (gameMode !== 'AI' || currentPlayer !== 'YELLOW' || winnerResult || isDraw) {
      setIsAiThinking(false);
      return;
    }

    setIsAiThinking(true);

    const timer = setTimeout(() => {
      setBoard(currentBoard => {
        const aiCol = getAIMove(currentBoard, aiDifficulty);
        const row = getLowestEmptyRow(currentBoard, aiCol);
        if (row === -1) {
          setIsAiThinking(false);
          return currentBoard;
        }

        const nextBoard = currentBoard.map(r => [...r]);
        nextBoard[row][aiCol] = 'YELLOW';
        setLastMove({ row, col: aiCol });
        playDropSound(row);

        const win = checkWinner(nextBoard);
        if (win) {
          setWinnerResult(win);
          playWinSound();
          setScore(prev => ({ ...prev, yellow: prev.yellow + 1 }));
        } else if (isBoardFull(nextBoard)) {
          setIsDraw(true);
          playDrawSound();
          setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
        } else {
          setCurrentPlayer('RED');
        }

        setIsAiThinking(false);
        return nextBoard;
      });
    }, 450);

    aiTimeoutRef.current = timer;

    return () => {
      clearTimeout(timer);
    };
  }, [currentPlayer, gameMode, winnerResult, isDraw, aiDifficulty]);

  // Restart / New Game
  const handleRestartGame = () => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    playClickSound();
    setBoard(createEmptyBoard());
    setCurrentPlayer('RED');
    setWinnerResult(null);
    setIsDraw(false);
    setIsAiThinking(false);
    setLastMove(null);
  };

  // Reset Scores
  const handleResetScore = () => {
    playClickSound();
    setScore({ red: 0, yellow: 0, draws: 0 });
  };

  // Toggle SFX Sound (Sound Effects)
  const handleToggleSound = () => {
    initAudio();
    const nextMuted = !isMuted;
    setIsMutedState(nextMuted);
    setSoundMuted(nextMuted);
    if (!nextMuted) {
      playChimeSound();
    }
  };

  // Toggle 8-bit Background Music (BGM)
  const handleToggleBgm = () => {
    initAudio();
    const playing = toggleBgm();
    setIsBgmOn(playing);
  };

  // Change Game Mode
  const handleSetGameMode = (mode: GameMode) => {
    if (mode === gameMode) return;
    playClickSound();
    setGameMode(mode);
    handleRestartGame();
  };

  // Change AI Difficulty
  const handleSetAIDifficulty = (diff: AIDifficulty) => {
    if (diff === aiDifficulty) return;
    playClickSound();
    setAIDifficulty(diff);
  };

  return (
    <div className="relative min-h-screen bg-[#080810] text-[#00ff41] font-mono flex flex-col justify-between overflow-x-hidden select-none">
      {/* Optional Retro CRT Scanline Overlay */}
      {showScanlines && <div className="fixed inset-0 crt-overlay z-40 pointer-events-none" />}

      {/* Immersive Console Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 lg:px-12 py-4 lg:py-5 bg-[#101020] border-b-4 border-[#1a1a2e] shadow-[0_4px_0_0_#000] z-20">
        <div className="flex flex-col text-center sm:text-left">
          <h1
            id="game-main-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none text-white italic font-pixel"
          >
            PIXEL CONNECT IV
          </h1>
          <p className="text-[11px] sm:text-xs text-[#00ff41] opacity-75 mt-1.5 uppercase tracking-widest font-mono">
            8-BIT STRATEGY CONSOLE v1.0 &bull; 4 IN A ROW
          </p>
        </div>
      </header>

      {/* Main Arcade Gameplay Cockpit */}
      <main className="flex-grow flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-8 xl:gap-10 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full z-10">
        {/* Left Side Column: Status & Rules */}
        <div className="w-full lg:w-72 flex flex-col gap-4 order-2 lg:order-1">
          <ScoreBoard
            score={score}
            currentPlayer={currentPlayer}
            winnerResult={winnerResult}
            isDraw={isDraw}
            gameMode={gameMode}
            isAiThinking={isAiThinking}
          />
          <HowToPlay />
        </div>

        {/* Center Column: The 7x6 Connect Four Board */}
        <div className="w-full max-w-[560px] flex flex-col items-center order-1 lg:order-2">
          <Board
            board={board}
            onColumnClick={handleColumnClick}
            currentPlayer={currentPlayer}
            winnerResult={winnerResult}
            isDraw={isDraw}
            disabled={isAiThinking || !!winnerResult || isDraw}
            lastMove={lastMove}
          />
        </div>

        {/* Right Side Column: Controls, Game Mode & Settings */}
        <div className="w-full lg:w-64 flex flex-col gap-4 order-3">
          <GameControls
            gameMode={gameMode}
            onSetGameMode={handleSetGameMode}
            aiDifficulty={aiDifficulty}
            onSetAIDifficulty={handleSetAIDifficulty}
            onRestartGame={handleRestartGame}
            onResetScore={handleResetScore}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
            isBgmOn={isBgmOn}
            onToggleBgm={handleToggleBgm}
            showScanlines={showScanlines}
            onToggleScanlines={() => setShowScanlines(prev => !prev)}
            isGameOver={!!winnerResult || isDraw}
          />
        </div>
      </main>

      {/* Console Footer */}
      <footer className="py-3 px-4 text-center text-[10px] text-slate-500 font-mono border-t border-[#1a1a2e] bg-[#0c0c18] z-20">
        <span>CONNECT FOUR 8-BIT RETRO CONSOLE &bull; IMMERSIVE ARCADE UI &bull; NO EXTERNAL LIBRARIES REQUIRED</span>
      </footer>
    </div>
  );
}
