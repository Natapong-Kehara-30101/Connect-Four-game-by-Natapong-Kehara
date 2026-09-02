import React, { useState, useEffect, useCallback } from 'react';
import { BoardState, CellCoord, Player, WinResult } from '../types';
import { COLS, ROWS, getLowestEmptyRow } from '../utils/connectFour';
import { ChevronDown, Sparkles, CornerDownLeft, MoveHorizontal } from 'lucide-react';

interface BoardProps {
  board: BoardState;
  onColumnClick: (col: number) => void;
  currentPlayer: Player;
  winnerResult: WinResult | null;
  isDraw: boolean;
  disabled: boolean;
  lastMove: CellCoord | null;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onColumnClick,
  currentPlayer,
  winnerResult,
  isDraw,
  disabled,
  lastMove,
}) => {
  const [selectedCol, setSelectedCol] = useState<number>(3);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  // Check if a specific cell is part of the 4-in-a-row winning line
  const isWinningCell = (r: number, c: number): boolean => {
    if (!winnerResult) return false;
    return winnerResult.line.some(cell => cell.row === r && cell.col === c);
  };

  const isGameOver = !!winnerResult || isDraw;
  const activeCol = hoverCol !== null ? hoverCol : selectedCol;

  const targetLandingRow =
    activeCol !== null && !disabled && !isGameOver
      ? getLowestEmptyRow(board, activeCol)
      : -1;

  // Handle keyboard navigation: ArrowLeft/Right, A/D, Enter, Space, ArrowDown
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing inside any form inputs
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setHoverCol(null);
        setSelectedCol(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setHoverCol(null);
        setSelectedCol(prev => Math.min(COLS - 1, prev + 1));
      } else if (
        e.key === 'Enter' ||
        e.key === ' ' ||
        e.key === 'ArrowDown' ||
        e.key === 's' ||
        e.key === 'S'
      ) {
        if (e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
        }
        if (!disabled && !isGameOver) {
          const colToDrop = hoverCol !== null ? hoverCol : selectedCol;
          const isFull = board[0][colToDrop] !== null;
          if (!isFull) {
            onColumnClick(colToDrop);
          }
        }
      } else if (e.key >= '1' && e.key <= '7') {
        // Quick direct number keys 1-7
        const colNum = parseInt(e.key, 10) - 1;
        setSelectedCol(colNum);
        setHoverCol(null);
        if (!disabled && !isGameOver && board[0][colNum] === null) {
          onColumnClick(colNum);
        }
      }
    },
    [disabled, isGameOver, hoverCol, selectedCol, board, onColumnClick]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div id="connect4-board-container" className="w-full max-w-[560px] mx-auto select-none">
      {/* Column Hover & Drop Indicator Arrow Bar */}
      <div className="grid grid-cols-7 gap-2 sm:gap-2.5 px-3 sm:px-4 mb-2">
        {Array.from({ length: COLS }).map((_, colIdx) => {
          const isFull = board[0][colIdx] !== null;
          const isActive = activeCol === colIdx && !disabled && !isFull && !isGameOver;

          return (
            <button
              key={`drop-btn-${colIdx}`}
              id={`drop-col-btn-${colIdx}`}
              type="button"
              disabled={disabled || isFull || isGameOver}
              onClick={() => {
                setSelectedCol(colIdx);
                onColumnClick(colIdx);
              }}
              onMouseEnter={() => {
                setHoverCol(colIdx);
                setSelectedCol(colIdx);
              }}
              onMouseLeave={() => setHoverCol(null)}
              className={`h-9 flex flex-col items-center justify-center transition-all rounded relative ${
                isFull || isGameOver
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-white/5 active:scale-95'
              }`}
              aria-label={`หยอดหมากคอลัมน์ที่ ${colIdx + 1} (${isActive ? 'กำลังเลือก' : ''})`}
            >
              {isActive ? (
                <div className="flex flex-col items-center animate-bounce">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.6)] ${
                      currentPlayer === 'RED' ? 'bg-red-600' : 'bg-yellow-400'
                    }`}
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-[#00ff41] -mt-1" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isFull ? 'bg-slate-800' : 'bg-slate-600/50 hover:bg-[#00ff41]'
                    }`}
                  />
                  <span className="text-[9px] font-pixel text-slate-500">
                    {colIdx + 1}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Immersive Console Board Frame */}
      <div
        id="game-board"
        className="relative grid grid-cols-7 gap-2 sm:gap-2.5 p-3 sm:p-4 bg-[#2020a0] border-4 sm:border-8 border-[#101060] console-board-shadow rounded-xl"
      >
        {Array.from({ length: COLS }).map((_, colIdx) => {
          const isColFull = board[0][colIdx] !== null;
          const isColActive = activeCol === colIdx && !disabled && !isGameOver && !isColFull;

          return (
            <div
              key={`col-${colIdx}`}
              id={`board-column-${colIdx}`}
              onClick={() => {
                setSelectedCol(colIdx);
                if (!disabled && !isGameOver && !isColFull) {
                  onColumnClick(colIdx);
                }
              }}
              onMouseEnter={() => {
                setHoverCol(colIdx);
                setSelectedCol(colIdx);
              }}
              onMouseLeave={() => setHoverCol(null)}
              className={`flex flex-col gap-2 sm:gap-2.5 cursor-pointer touch-manipulation transition-all rounded-lg ${
                isColActive ? 'bg-white/[0.07] ring-2 ring-[#00ff41]/40' : ''
              }`}
            >
              {Array.from({ length: ROWS }).map((_, rowIdx) => {
                const cell = board[rowIdx][colIdx];
                const isWinning = isWinningCell(rowIdx, colIdx);
                const isJustDropped =
                  lastMove && lastMove.row === rowIdx && lastMove.col === colIdx;
                const isTargetGhostCell =
                  activeCol === colIdx &&
                  rowIdx === targetLandingRow &&
                  cell === null &&
                  !disabled &&
                  !isGameOver;

                return (
                  <div
                    key={`cell-${rowIdx}-${colIdx}`}
                    id={`cell-${rowIdx}-${colIdx}`}
                    className="relative aspect-square w-full rounded-full flex items-center justify-center cell-hole overflow-hidden"
                  >
                    {cell !== null ? (
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center transition-all ${
                          cell === 'RED' ? 'chip-red' : 'chip-yellow'
                        } ${
                          isJustDropped ? 'animate-drop' : ''
                        } ${
                          isWinning ? 'animate-win-flash ring-4 ring-white' : ''
                        }`}
                        style={
                          isJustDropped
                            ? ({
                                '--drop-start-y': `-${(rowIdx + 1) * 60}px`,
                              } as React.CSSProperties)
                            : undefined
                        }
                      >
                        {isWinning && (
                          <Sparkles className="w-4 h-4 text-white drop-shadow animate-spin" />
                        )}
                      </div>
                    ) : isTargetGhostCell ? (
                      <div
                        className={`w-full h-full rounded-full border-2 border-dashed flex items-center justify-center transition-all animate-pulse ${
                          currentPlayer === 'RED'
                            ? 'bg-red-600/40 border-red-400 shadow-[inset_0_0_12px_rgba(239,68,68,0.5)]'
                            : 'bg-yellow-400/40 border-yellow-300 shadow-[inset_0_0_12px_rgba(250,204,21,0.5)]'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full opacity-70 ${
                            currentPlayer === 'RED' ? 'bg-red-400' : 'bg-yellow-300'
                          }`}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Control Guide Bar: Keyboard & Mouse/Touch indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-mono mt-3 px-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="px-1.5 py-0.5 bg-[#1a1a2e] border border-[#333348] rounded text-[#00ff41] font-bold">
              ←
            </span>
            <span className="px-1.5 py-0.5 bg-[#1a1a2e] border border-[#333348] rounded text-[#00ff41] font-bold">
              →
            </span>
            <span className="text-[10px] text-slate-400">เลือก</span>
          </span>

          <span className="text-slate-600">&bull;</span>

          <span className="flex items-center gap-1 text-slate-300">
            <span className="px-1.5 py-0.5 bg-[#1a1a2e] border border-[#333348] rounded text-[#00ff41] font-bold text-[10px]">
              SPACE
            </span>
            <span className="text-slate-500">/</span>
            <span className="px-1.5 py-0.5 bg-[#1a1a2e] border border-[#333348] rounded text-[#00ff41] font-bold text-[10px] flex items-center gap-0.5">
              <CornerDownLeft className="w-2.5 h-2.5" /> ENTER
            </span>
            <span className="text-[10px] text-slate-400">หยอด</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-[10px]">
          <span>หรือคลิก/แตะคอลัมน์</span>
        </div>
      </div>
    </div>
  );
};

