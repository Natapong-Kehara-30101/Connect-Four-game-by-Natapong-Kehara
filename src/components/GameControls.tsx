import React from 'react';
import { AIDifficulty, GameMode } from '../types';
import { RotateCcw, Users, Bot, Volume2, VolumeX, Music, Tv, Trash2 } from 'lucide-react';

interface GameControlsProps {
  gameMode: GameMode;
  onSetGameMode: (mode: GameMode) => void;
  aiDifficulty: AIDifficulty;
  onSetAIDifficulty: (diff: AIDifficulty) => void;
  onRestartGame: () => void;
  onResetScore: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  isBgmOn: boolean;
  onToggleBgm: () => void;
  showScanlines: boolean;
  onToggleScanlines: () => void;
  isGameOver: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  onSetGameMode,
  aiDifficulty,
  onSetAIDifficulty,
  onRestartGame,
  onResetScore,
  isMuted,
  onToggleSound,
  isBgmOn,
  onToggleBgm,
  showScanlines,
  onToggleScanlines,
  isGameOver,
}) => {
  return (
    <div id="game-controls-container" className="w-full flex flex-col gap-4">
      {/* Primary Action Button: Large Arcade New Game */}
      <button
        id="btn-restart-game"
        type="button"
        onClick={onRestartGame}
        className={`w-full py-4 px-6 btn-arcade-red font-pixel text-sm sm:text-base font-bold uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer select-none ${
          isGameOver ? 'animate-bounce ring-4 ring-red-400' : ''
        }`}
      >
        <RotateCcw className="w-5 h-5" />
        <span>NEW GAME</span>
      </button>

      {/* Game Mode Console Box */}
      <div className="console-card p-4">
        <h2 className="text-xs font-pixel text-white mb-3 border-b border-[#333348] pb-1.5 uppercase flex items-center gap-2">
          <span className="text-[#00ff41]">#</span> MODE SELECT
        </h2>
        <div className="flex flex-col gap-2">
          <button
            id="toggle-pvp"
            type="button"
            onClick={() => onSetGameMode('PVP')}
            className={`px-3 py-2.5 text-xs font-mono font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
              gameMode === 'PVP'
                ? 'btn-arcade-green shadow-[2px_2px_0_0_#000]'
                : 'btn-arcade-dark'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{gameMode === 'PVP' ? '[X]' : '[ ]'} PLAYER VS PLAYER</span>
            </div>
            <span className="text-[10px] opacity-75">2P LOCAL</span>
          </button>

          <button
            id="toggle-pva"
            type="button"
            onClick={() => onSetGameMode('AI')}
            className={`px-3 py-2.5 text-xs font-mono font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
              gameMode === 'AI'
                ? 'btn-arcade-green shadow-[2px_2px_0_0_#000]'
                : 'btn-arcade-dark'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>{gameMode === 'AI' ? '[X]' : '[ ]'} PLAYER VS AI</span>
            </div>
            <span className="text-[10px] opacity-75">VS CPU</span>
          </button>
        </div>

        {/* AI Difficulty Sub-options */}
        {gameMode === 'AI' && (
          <div className="mt-3 pt-3 border-t border-[#222238]">
            <div className="text-[10px] font-pixel text-slate-400 mb-2 uppercase">
              AI DIFFICULTY:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['EASY', 'MEDIUM', 'HARD'] as AIDifficulty[]).map(diff => {
                const labels: Record<AIDifficulty, string> = {
                  EASY: 'EASY',
                  MEDIUM: 'MED',
                  HARD: 'HARD',
                };
                const isSelected = aiDifficulty === diff;

                return (
                  <button
                    key={diff}
                    id={`btn-difficulty-${diff.toLowerCase()}`}
                    type="button"
                    onClick={() => onSetAIDifficulty(diff)}
                    className={`py-1.5 px-1 text-[10px] font-pixel text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-yellow-400 text-black border-yellow-300 font-bold shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                        : 'bg-[#151528] text-slate-400 border-[#333348] hover:bg-[#202038]'
                    }`}
                  >
                    {labels[diff]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Players Color Reference */}
      <div className="console-card p-3 flex flex-col gap-2 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shrink-0"></div>
          <span className="text-white font-bold">P1: RED (ผู้เล่น 1)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white shrink-0"></div>
          <span className="text-yellow-400 font-bold">
            {gameMode === 'AI' ? 'AI: YELLOW (คอมพิวเตอร์)' : 'P2: YELLOW (ผู้เล่น 2)'}
          </span>
        </div>
      </div>

      {/* Console Utility Settings */}
      <div className="console-card p-3 flex flex-col gap-2.5">
        <div className="text-[10px] font-pixel text-slate-400 uppercase flex items-center justify-between border-b border-[#222238] pb-1">
          <span>AUDIO & DISPLAY</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* SFX Button */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            className={`py-1.5 px-2 text-xs font-mono border transition-colors cursor-pointer rounded flex items-center justify-center gap-1 ${
              !isMuted
                ? 'bg-[#1a2e1a] text-[#00ff41] border-[#008000] shadow-[0_0_6px_rgba(0,255,65,0.3)]'
                : 'bg-[#151528] text-slate-500 border-[#333348]'
            }`}
            title={!isMuted ? 'ปิดเสียงเอฟเฟกต์ (SFX)' : 'เปิดเสียงเอฟเฟกต์ (SFX)'}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[9px] font-pixel">SFX</span>
          </button>

          {/* BGM Music Button */}
          <button
            id="btn-toggle-bgm"
            type="button"
            onClick={onToggleBgm}
            className={`py-1.5 px-2 text-xs font-mono border transition-colors cursor-pointer rounded flex items-center justify-center gap-1 ${
              isBgmOn
                ? 'bg-[#2a1a3a] text-purple-300 border-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.4)] animate-pulse'
                : 'bg-[#151528] text-slate-500 border-[#333348]'
            }`}
            title={isBgmOn ? 'ปิดดนตรีประกอบ (8-bit BGM)' : 'เปิดดนตรีประกอบ (8-bit BGM)'}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="text-[9px] font-pixel">BGM</span>
          </button>

          {/* Scanlines Button */}
          <button
            id="btn-toggle-scanlines"
            type="button"
            onClick={onToggleScanlines}
            className={`py-1.5 px-2 text-xs font-mono border transition-colors cursor-pointer rounded flex items-center justify-center gap-1 ${
              showScanlines
                ? 'bg-[#1a1a3a] text-cyan-300 border-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.3)]'
                : 'bg-[#151528] text-slate-500 border-[#333348]'
            }`}
            title="เปิด/ปิด CRT Scanlines"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="text-[9px] font-pixel">CRT</span>
          </button>
        </div>

        {/* Reset Score Button */}
        <button
          id="btn-reset-score"
          type="button"
          onClick={onResetScore}
          className="w-full py-1.5 px-3 text-[11px] font-mono text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/60 flex items-center justify-center gap-1.5 cursor-pointer transition-colors rounded"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>RESET SCORE</span>
        </button>
      </div>
    </div>
  );
};
