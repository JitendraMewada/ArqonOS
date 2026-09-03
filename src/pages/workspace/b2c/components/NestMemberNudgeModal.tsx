import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Sparkles, 
  Users,
  BellRing
} from 'lucide-react';
import { 
  NestGroup,
  NestMember, 
  NestMemberNudge, 
  NestTransaction 
} from '../types';
import { cn } from '../../../../lib/utils';

interface NestMemberNudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: NestGroup;
  members: NestMember[];
  transactions: NestTransaction[];
  nudges: NestMemberNudge[];
  preselectedMemberId?: string;
  onSendNudge: (nudge: NestMemberNudge) => void;
  onAcknowledgeNudge: (id: string) => void;
  onDeleteNudge?: (id: string) => void;
}

export const NestMemberNudgeModal: React.FC<NestMemberNudgeModalProps> = ({
  isOpen,
  onClose,
  group,
  members,
  transactions,
  nudges,
  preselectedMemberId,
  onSendNudge,
  onAcknowledgeNudge,
  onDeleteNudge
}) => {
  const initialMemberId = (typeof preselectedMemberId === 'string' && preselectedMemberId) 
    ? preselectedMemberId 
    : (members[1]?.id || members[0]?.id || '');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(initialMemberId);
  const [customMessage, setCustomMessage] = useState('');
  const [nudgeType, setNudgeType] = useState<NestMemberNudge['type']>('reminder_to_log');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update selected member when preselectedMemberId changes
  React.useEffect(() => {
    if (typeof preselectedMemberId === 'string' && preselectedMemberId) {
      setSelectedMemberId(preselectedMemberId);
    }
  }, [preselectedMemberId]);

  if (!isOpen) return null;

  const currentAdmin = members.find(m => m.isCurrentUser) || members[0] || {
    id: 'mem_1',
    name: 'Group Admin'
  };

  const selectedMember = members.find(m => m.id === selectedMemberId);

  // Compute activity stats for each member
  const memberStats = members.map(member => {
    const memberTxs = transactions.filter(t => t.paidByMemberId === member.id);
    const lastTx = memberTxs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const totalSpentThisMonth = memberTxs.reduce((sum, t) => sum + (t.type === 'expense' ? Math.abs(t.amount) : 0), 0);

    return {
      member,
      txCount: memberTxs.length,
      lastDate: lastTx ? lastTx.date : 'No activity yet',
      totalSpentThisMonth
    };
  });

  const presetMessages = [
    {
      type: 'reminder_to_log' as const,
      label: 'Log Spends & Receipts',
      text: `Hey ${selectedMember?.name?.split(' ')[0] || 'there'}, friendly reminder to log your recent expenses and receipts in Nest before our group audit!`
    },
    {
      type: 'bill_split' as const,
      label: 'Shared Bill Confirmation',
      text: `Hi ${selectedMember?.name?.split(' ')[0] || 'there'}, could you please confirm if you paid your share of the utility/grocery bill?`
    },
    {
      type: 'allowance_check' as const,
      label: 'Allowance Receipts Check',
      text: `Hello ${selectedMember?.name?.split(' ')[0] || 'there'}, please update your allowance pocket money spends and receipts in the app.`
    }
  ];

  const handleSendNudge = () => {
    if (!selectedMember) return;
    const msgText = customMessage.trim() || presetMessages.find(p => p.type === nudgeType)?.text || 'Please log your expenses!';

    const newNudge: NestMemberNudge = {
      id: `nudge_${Date.now()}`,
      targetMemberId: selectedMember.id,
      targetMemberName: selectedMember.name,
      senderMemberName: currentAdmin.name,
      message: msgText,
      timestamp: new Date().toISOString(),
      type: nudgeType,
      isAcknowledged: false
    };

    onSendNudge(newNudge);
    setCustomMessage('');
  };

  const handleCopyWhatsAppText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-500/5 via-slate-50 to-transparent dark:from-blue-500/10 dark:via-slate-900 dark:to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Member Activity & Nudge Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track family logging activity and send friendly reminders so no expenses are missed.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Member Activity Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Family Member Logging Status
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {memberStats.map(({ member, txCount, lastDate }) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={cn(
                    "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                    selectedMemberId === member.id
                      ? "bg-[#22c55e]/10 border-[#22c55e] ring-1 ring-[#22c55e]"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        Last logged: {lastDate}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    {txCount} entries
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compose Nudge Section */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
                Send Nudge to {selectedMember?.name || 'Selected Member'}
              </span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presetMessages.map((preset) => (
                <button
                  key={preset.type}
                  type="button"
                  onClick={() => {
                    setNudgeType(preset.type);
                    setCustomMessage(preset.text);
                  }}
                  className={cn(
                    "p-2.5 rounded-lg border text-left transition-all text-xs font-semibold",
                    nudgeType === preset.type
                      ? "bg-[#22c55e]/15 border-[#22c55e] text-[#22c55e]"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              rows={3}
              value={customMessage || presetMessages.find(p => p.type === nudgeType)?.text || ''}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => handleCopyWhatsAppText(customMessage || presetMessages.find(p => p.type === nudgeType)?.text || '', 'new_nudge')}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {copiedId === 'new_nudge' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy for WhatsApp / SMS</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendNudge}
                className="px-4 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold hover:bg-[#22c55e]/90 shadow-md shadow-[#22c55e]/20 flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send In-App Nudge</span>
              </button>
            </div>
          </div>

          {/* Past Nudges Feed */}
          {nudges.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Recent Nudge Notifications
              </span>

              <div className="space-y-2">
                {nudges.map((nudge) => (
                  <div
                    key={nudge.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          To: {nudge.targetMemberName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          by {nudge.senderMemberName}
                        </span>
                        {nudge.isAcknowledged ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Acknowledged
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Sent
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {nudge.message}
                      </p>
                    </div>

                    {!nudge.isAcknowledged && (
                      <button
                        type="button"
                        onClick={() => onAcknowledgeNudge(nudge.id)}
                        className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold hover:bg-[#22c55e] hover:text-white transition-colors shrink-0"
                      >
                        Mark Seen
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 px-5 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
