// //app/(chat)/chat/[id]/page.tsx

 
"use client";
import { Sidebar } from '@/components/Sidebar';
import { ChatBox } from '@/components/ChatBox';
import { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { motion, AnimatePresence } from "framer-motion";
import RightSidebar from "@/components/RightSidebar";
import { GroupedChats } from '@/app/types/chat';
import TransitionScreen from "@/components/TransitionScreen";

export default function ChatPage({ params }: { params: { id: string } }) {
  const [leftWidth, setLeftWidth] = useState(20);
  const [middleWidth, setMiddleWidth] = useState(60);
  const [rightWidth, setRightWidth] = useState(20);
  
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [groupedChats, setGroupedChats] = useState<GroupedChats>({});
  const [error, setError] = useState<string | null>(null);
  const [showTransition, setShowTransition] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransition(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
 
  return (
    <>
      <AnimatePresence>
        {showTransition && <TransitionScreen />}
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-1.5"
      >
        {error && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
            {error}
          </div>
        )}
        <PanelGroup direction="horizontal">
          <Panel defaultSize={leftWidth} minSize={15}>
            <Sidebar/>
          </Panel>
          <PanelResizeHandle className="w-1 bg-purple-700 hover:bg-purple-900 transition-colors" />
          <Panel defaultSize={middleWidth} minSize={30}>
            <ChatBox chatId={params.id} />
          </Panel>
          <PanelResizeHandle className="w-1 bg-purple-600 hover:bg-purple-900 transition-colors" />
          <Panel defaultSize={rightWidth} minSize={10}>
            <RightSidebar />
          </Panel>
        </PanelGroup>
      </motion.div>
    </>
  );
}