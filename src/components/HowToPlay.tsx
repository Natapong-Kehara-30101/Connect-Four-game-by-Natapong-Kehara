import React from 'react';
import { HelpCircle, Target, Users, Zap, CheckCircle2 } from 'lucide-react';

export const HowToPlay: React.FC = () => {
  return (
    <div id="how-to-play-card" className="console-card p-4">
      <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-[#333348]">
        <HelpCircle className="w-4 h-4 text-[#00ff41]" />
        <h2 className="font-pixel text-[11px] text-[#00ff41] uppercase tracking-wider">
          HOW TO PLAY (วิธีเล่น)
        </h2>
      </div>

      <div className="space-y-2.5 text-xs text-slate-300 font-mono">
        <div className="flex items-start gap-2">
          <Target className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-bold">เป้าหมาย:</span> เรียงหมากให้ครบ <strong className="text-[#00ff41]">4 ตัวต่อแถว</strong> (แนวนอน, แนวตั้ง หรือแนวทแยง)
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-bold">หยอดหมาก:</span> คลิก เคาะแตะ หรือใช้คีย์บอร์ด <strong className="text-[#00ff41]">← / →</strong> เลือกคอลัมน์แล้วกด <strong className="text-[#00ff41]">SPACE / ENTER</strong>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-bold">สลับตา:</span> หมากแดง (P1) และหมากเหลือง (P2/AI) สลับกันหยอด
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-bold">ผลเสมอ:</span> เมื่อหยอดเต็ม 42 ช่องแล้วไม่มีผู้ชนะ
          </div>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-3 p-2 bg-[#080810] border border-[#222238] text-[11px] text-slate-400 font-mono flex items-center gap-2">
        <span className="font-pixel text-[9px] text-black bg-[#00ff41] px-1 py-0.5 font-bold">
          TIP
        </span>
        <span>ยึดคอลัมน์กึ่งกลางเพื่อเพิ่มโอกาสชนะสูงสุด</span>
      </div>
    </div>
  );
};
