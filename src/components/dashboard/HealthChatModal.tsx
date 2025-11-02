'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle,
  Send,
  Loader2,
  Bot,
  User,
  Trash2,
  AlertCircle,
  Sparkles,
  X,
} from 'lucide-react';
import {
  getChatHistory,
  saveChatMessage,
  getUserHealthContext,
  getUserIdFromClerkId,
  subscribeToChatUpdates,
  clearChatHistory,
  type ChatMessage,
  type UserHealthContext,
} from '@/utils/supabase/chat';
import { generateHealthChatResponse, extractTopic } from '@/utils/ai/health-chat';
import { toast } from 'sonner';

export default function HealthChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [healthContext, setHealthContext] = useState<UserHealthContext | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch user data and chat history
  useEffect(() => {
    if (!user?.id || !isOpen) return;

    const loadData = async () => {
      setIsLoadingHistory(true);

      // Get user's Supabase ID
      const { data: supabaseUserId } = await getUserIdFromClerkId(user.id);
      if (supabaseUserId) {
        setUserId(supabaseUserId);

        // Fetch health context
        const { data: context } = await getUserHealthContext(user.id);
        setHealthContext(context);

        // Fetch chat history
        const { data: history } = await getChatHistory(supabaseUserId);
        if (history) {
          setMessages(history);
        }
      }

      setIsLoadingHistory(false);
    };

    loadData();
  }, [user?.id, isOpen]);

  // Real-time subscription
  useEffect(() => {
    if (!userId || !isOpen) return;

    const channel = subscribeToChatUpdates(userId, (newMessage) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((msg) => msg.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [userId, isOpen]);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Send message
  const handleSendMessage = async () => {
    if (!userMessage.trim() || !userId || isLoading) return;

    const messageText = userMessage.trim();
    setUserMessage('');
    setIsLoading(true);

    try {
      // Prepare FULL chat history for context (all previous messages)
      const chatHistory = messages.map((msg) => [
        { role: 'user', text: msg.user_message },
        { role: 'assistant', text: msg.ai_response },
      ]).flat();

      // Generate AI response with health context and FULL conversation history
      const { success, response, error } = await generateHealthChatResponse(
        messageText,
        healthContext,
        chatHistory
      );

      if (!success || !response) {
        throw new Error(error || 'Failed to generate response');
      }

      // Extract topic
      const topic = extractTopic(messageText);

      // Save to database
      const { data: savedMessage, error: saveError } = await saveChatMessage(
        userId,
        messageText,
        response,
        topic
      );

      if (saveError || !savedMessage) {
        throw new Error('Failed to save message');
      }

      // Add to local state (real-time will also update, but this is faster)
      setMessages((prev) => [...prev, savedMessage]);

      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const handleClearChat = async () => {
    if (!userId) return;

    const confirmed = window.confirm(
      'Are you sure you want to clear all chat history? This cannot be undone.'
    );

    if (!confirmed) return;

    const { success } = await clearChatHistory(userId);
    if (success) {
      setMessages([]);
      toast.success('Chat history cleared');
    } else {
      toast.error('Failed to clear chat history');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <Card className="w-full max-w-4xl h-[90vh] sm:h-[85vh] md:h-[80vh] flex flex-col bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                HealthMate AI Chat
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate hidden sm:block">
                Apni sehat ke baare mein kuch bhi poochein
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Messages - Fixed scrolling container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-3 sm:p-4" ref={scrollRef}>
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                Salam! Main HealthMate AI hoon 👋
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mb-3 sm:mb-4">
                Apne health ke baare mein kuch bhi poochein. Main aapki medical
                history dekh kar personalized advice dunga.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUserMessage('Meri blood sugar control kaise karein?')}
                  className="text-xs sm:text-sm"
                >
                  Blood Sugar Tips
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUserMessage('Mera BP kaise hai?')}
                  className="text-xs sm:text-sm"
                >
                  Check My BP
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUserMessage('Weight loss ke liye kya karein?')}
                  className="text-xs sm:text-sm"
                >
                  Weight Loss
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message, index) => (
                <div key={message.id || index}>
                  {/* User Message */}
                  <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3 break-words">
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                          {message.user_message}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        {new Date(message.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3 break-words">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="text-xs sm:text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed break-words">
                            {message.ai_response}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-1 flex-wrap">
                        <p className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {message.topic && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                            {message.topic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-green-600" />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Soch raha hoon...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Disclaimer */}
        {messages.length > 0 && (
          <div className="px-3 sm:px-4 py-2 bg-yellow-50 dark:bg-yellow-950/20 border-t border-yellow-200 dark:border-yellow-800 shrink-0">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ Yeh AI advice hai, medical treatment nahi. Serious issues ke liye apne doctor se zaroor consult karein.
              </p>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Apna sawal yahan likhein... (Press Enter to send)"
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!userMessage.trim() || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white shrink-0 h-10 w-10 p-0 sm:w-auto sm:px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
