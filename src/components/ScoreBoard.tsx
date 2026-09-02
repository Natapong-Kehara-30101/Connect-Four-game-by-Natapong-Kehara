import React from 'react';
import { GameMode, Player, ScoreState, WinResult } from '../types';
import { Bot, User, Trophy, ShieldAlert, Sparkles } from 'lucide-react';

interface ScoreBoardProps {
  score: ScoreState;
  currentPlayer: Player;
  winnerResult: WinResult | null;
  isDraw: boolean;
  gameMode: GameMode;
  isAiThinking: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  currentPlayer,
  winnerResult,
  isDraw,
  gameMode,
  isAiThinking,
}) => {
  const isGameOver = !!winnerResult || isDraw;

  return (
    <div id="game-scoreboard" className="w-full">
      {/* Console Status Box */}
      <div className="console-card p-4 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#333348] pb-1.5 mb-2">
          <span className="text-[10px] font-pixel text-[#00ff41] uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-ping" />
            CONSOLE STATUS
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            SYS_OK
          </span>
        </div>

        <div className="min-h-[44px] flex items-center justify-center text-center">
          {winnerResult ? (
            <div className="flex items-center gap-2 font-pixel text-xs sm:text-sm animate-pulse">
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
              <span
                className={
                  winnerResult.winner === 'RED'
                    ? 'text-red-500 text-glow-red font-bold'
                    : 'text-yellow-400 text-glow-yellow font-bold'
                }
              >
                {winnerResult.winner === 'RED'
                  ? 'PLAYER 1 (RED) WINS! 🏆'
                  : gameMode === 'AI'
                  ? 'CPU AI (YELLOW) WINS! 🤖'
                  : 'PLAYER 2 (YELLOW) WINS! 🏆'}
              </span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
          ) : isDraw ? (
            <div className="flex items-center gap-2 font-pixel text-xs sm:text-sm text-white">
              <ShieldAlert className="w-5 h-5 text-slate-400" />
              <span className="text-white font-bold">GAME DRAW! กระดานเต็ม 🤝</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className={`font-pixel text-xs sm:text-sm tracking-wide ${
                  currentPlayer === 'RED'
                    ? 'text-red-500 text-glow-red animate-pulse'
                    : 'text-yellow-400 text-glow-yellow animate-pulse'
                }`}
              >
                {currentPlayer === 'RED'
                  ? "PLAYER 1'S TURN (RED)"
                  : gameMode === 'AI'
                  ? isAiThinking
                    ? 'CPU IS THINKING...'
                    : 'CPU TURN (YELLOW)'
                  : "PLAYER 2'S TURN (YELLOW)"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Score Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {/* Player 1 (Red) */}
        <div
          id="score-card-red"
          className={`p-3 console-card transition-all ${
            !isGameOver && currentPlayer === 'RED'
              ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4),4px_4px_0_0_#000]'
              : 'border-[#333348]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1 font-pixel">
              <User className="w-3 h-3" /> P1
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white" />
          </div>
          <div className="text-2xl font-pixel text-white text-center">
            {score.red.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Draws */}
        <div
          id="score-card-draw"
          className="p-3 console-card border-[#333348] text-center flex flex-col justify-between"
        >
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-pixel mb-1">
            TIED
          </div>
          <div className="text-2xl font-pixel text-slate-300 text-center">
            {score.draws.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Player 2 / AI (Yellow) */}
        <div
          id="score-card-yellow"
          className={`p-3 console-card transition-all ${
            !isGameOver && currentPlayer === 'YELLOW'
              ? 'border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.4),4px_4px_0_0_#000]'
              : 'border-[#333348]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1 font-pixel">
              {gameMode === 'AI' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {gameMode === 'AI' ? 'CPU' : 'P2'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white" />
          </div>
          <div className="text-2xl font-pixel text-white text-center">
            {score.yellow.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};
