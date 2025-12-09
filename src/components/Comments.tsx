import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Comment } from '../types';
import { MessageSquare, Send, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommentsProps {
  groupId: string;
}

export const Comments: React.FC<CommentsProps> = ({ groupId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState(() => localStorage.getItem('et_username') || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    
    if (data) setComments(data);
  };

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`comments-${groupId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `group_id=eq.${groupId}` },
        (payload) => {
          setComments((prev) => [...prev, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    localStorage.setItem('et_username', authorName);

    const { error } = await supabase.from('comments').insert({
      group_id: groupId,
      author_name: authorName,
      content: newComment,
    });

    if (!error) {
      setNewComment('');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 overflow-hidden flex flex-col h-[500px]">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          Discussion Board
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            <p>No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment, idx) => {
            const isMe = comment.author_name === authorName;
            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs font-bold text-slate-400 mb-1 px-1">
                  {comment.author_name}
                </span>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-700 rounded-tl-none'
                  }`}
                >
                  {comment.content}
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!localStorage.getItem('et_username') && (
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name (for chat)"
                className="w-full bg-slate-50 rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                required
              />
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-50 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || !authorName.trim()}
              className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
