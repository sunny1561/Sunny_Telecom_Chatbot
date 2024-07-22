//components/Sidebar.tsx

// 'use client';
// import { useState, useEffect,useCallback } from 'react';
// import Link from 'next/link';
// import { useInView } from 'react-intersection-observer';
// import { format } from 'date-fns';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { fetchChats } from '@/app/actions/chat';
// import { FileDown, Loader2, MessageSquare, MoreHorizontal, Plus, LogOut } from 'lucide-react';
// import { redirect, usePathname, useRouter } from 'next/navigation';
// import { ScrollArea } from './ui/scroll-area';
// import { cn } from '@/lib/utils';
// import { signOut } from 'next-auth/react';

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// type Chat = {
//   _id: string;
//   title: string;
//   createdAt: string;
// };

// export function Sidebar() {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const { ref, inView } = useInView();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isVisible, setIsVisible] = useState(false);

//   const loadMoreChats = useCallback(async () => {
//     if (loadingMore || !hasMore) return;
//     setLoadingMore(true);
//     const newChats = await fetchChats(chats.length);
//     const parsedChats = JSON.parse(newChats);
//     setChats(prevChats => {
//       const uniqueChats = parsedChats.filter((chat: Chat) => 
//         !prevChats.some(prevChat => prevChat._id === chat._id)
//       );
//       return [...prevChats, ...uniqueChats];
//     });
//     setHasMore(parsedChats.length === 20);
//     setLoading(false);
//     setLoadingMore(false);
//   },[loadingMore,hasMore,chats.length]);

//   const handleLogout = () => {
//     signOut();
//     router.push("/home")
//   };
//   useEffect(() => {
//     loadMoreChats();
//   }, [loadMoreChats]);

//   useEffect(() => {
//     if (inView && hasMore && !loadingMore) {
//       loadMoreChats();
//     }
//   }, [inView, hasMore, loadingMore,loadMoreChats]);

//   useEffect(() => {
//     const handleMouseMove = (event: MouseEvent) => {
//       if (event.clientX <= 20) {
//         setIsVisible(true);
//       } else if (event.clientX > 250) {
//         setIsVisible(false);
//       }
//     };

//     document.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);
//   const exportChatToCSV = (chatId: string) => {
//     // Implement the export to CSV functionality here
//     console.log(`Exporting chat ${chatId} to CSV`);
//   };
//   const groupChatsByDate = (chats: Chat[]): Map<string, Chat[]> => {
//     const groups = new Map<string, Chat[]>();
  
//     chats.forEach(chat => {
//       const date = new Date(chat.createdAt);
//       const key = getDateKey(date);
  
//       if (!groups.has(key)) {
//         groups.set(key, []);
//       }
  
//       groups.get(key)!.push(chat);
//     });
  
//     return groups;
//   };

//   const getDateKey = (date: Date) => {
//     const now = new Date();
//     const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return format(date, 'MMMM yyyy');
//   };

//   const groupedChats = groupChatsByDate(chats);

//   const truncateTitle = (title: string, maxLength: number) => {
//     return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
//   };

   
// return (
//     <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col">
//       <div className="p-4">
//         <h1 className="text-4xl font-bold mb-8 flex items-center text-white">
//           <span className="mr-2">🤖</span> ChatBot
//         </h1>
//         <Button 
//           className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
//           onClick={() => router.push('/')}
//         >
//           <Plus className="mr-2 h-4 w-4" /> New Chat
//         </Button>
//       </div>
//       <ScrollArea className="flex-1 px-4">
//         {Array.from(groupedChats).map(([date, chatsInGroup]) => (
//           <div key={date} className="mb-4">
//             <h3 className="text-sm font-semibold text-gray-400 mb-2">{date}</h3>
//             {chatsInGroup.map(chat => (
//               <div key={chat._id} className="mb-2">
//                 <Link href={`/chat/${chat._id}`}>
//                   <div
//                     className={cn(
//                       "flex items-center cursor-pointer bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg",
//                       pathname === `/chat/${chat._id}` && "bg-purple-600 ring-2 ring-purple-400"
//                     )}
//                   >
//                     <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
//                     <p className="truncate">{truncateTitle(chat.title, 25)}</p>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-auto">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-40 p-0">
//                         <Button
//                           variant="ghost"
//                           className="w-full justify-start"
//                           onClick={() => exportChatToCSV(chat._id)}
//                         >
//                           <FileDown className="mr-2 h-4 w-4" />
//                           Export to CSV
//                         </Button>
//                       </PopoverContent>
//                     </Popover>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         ))}
//         {loading && <Skeleton className="h-[20px] w-[100px] rounded-full mx-4" />}
//         {loadingMore && (
//           <div className="flex justify-center items-center py-4">
//             <Loader2 className="h-6 w-6 animate-spin" />
//           </div>
//         )}
//         <div ref={ref}></div>
//       </ScrollArea>
//       <div className="p-4">
//         <Button 
//           className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
//           onClick={handleLogout}
//         >
//           <LogOut className="mr-2 pb-2 h-4 w-4" /> Logout
//         </Button>
//       </div>
//     </div>
//   )
// }


//components/Sidebar.tsx

'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { format } from 'date-fns';
import { fetchChats } from '@/app/actions/chat';
import { FileDown, Loader2, MessageSquare, MoreHorizontal, Plus, LogOut } from 'lucide-react';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

type Chat = {
  _id: string;
  title: string;
  createdAt: string;
};

export function Sidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const loadMoreChats = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const newChats = await fetchChats(chats.length);
    const parsedChats = JSON.parse(newChats);
    setChats(prevChats => {
      const uniqueChats = parsedChats.filter((chat: Chat) => 
        !prevChats.some(prevChat => prevChat._id === chat._id)
      );
      return [...prevChats, ...uniqueChats];
    });
    setHasMore(parsedChats.length === 20);
    setLoading(false);
    setLoadingMore(false);
  }, [loadingMore, hasMore, chats.length]);

  const handleLogout = () => {
    signOut();
    router.push("/home")
  };

  useEffect(() => {
    loadMoreChats();
  }, [loadMoreChats]);

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMoreChats();
    }
  }, [inView, hasMore, loadingMore, loadMoreChats]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientX <= 20) {
        setIsVisible(true);
      } else if (event.clientX > 250) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const exportChatToCSV = (chatId: string) => {
    console.log(`Exporting chat ${chatId} to CSV`);
  };

  const groupChatsByDate = (chats: Chat[]): Map<string, Chat[]> => {
    const groups = new Map<string, Chat[]>();
  
    chats.forEach(chat => {
      const date = new Date(chat.createdAt);
      const key = getDateKey(date);
  
      if (!groups.has(key)) {
        groups.set(key, []);
      }
  
      groups.get(key)!.push(chat);
    });
  
    return groups;
  };

  const getDateKey = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return format(date, 'MMMM yyyy');
  };

  const groupedChats = groupChatsByDate(chats);

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col">
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-8 flex items-center text-white">
          <span className="mr-2">🤖</span> ChatBot
        </h1>
        <button 
          className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
          onClick={() => router.push('/')}
        >
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </button>
      </div>
      <div className="flex-1 px-4 overflow-y-auto">
        {Array.from(groupedChats).map(([date, chatsInGroup]) => (
          <div key={date} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">{date}</h3>
            {chatsInGroup.map(chat => (
              <div key={chat._id} className="mb-2">
                <Link href={`/chat/${chat._id}`}>
                  <div
                    className={cn(
                      "flex items-center cursor-pointer bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg",
                      pathname === `/chat/${chat._id}` && "bg-purple-600 ring-2 ring-purple-400"
                    )}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <p className="truncate">{truncateTitle(chat.title, 25)}</p>
                    <div className="relative ml-auto">
                      <button 
                        className="h-8 w-8 p-0 bg-transparent text-white hover:bg-gray-700 rounded-full flex items-center justify-center"
                        onClick={(e) => {
                          e.preventDefault();
                          setPopoverOpen(popoverOpen === chat._id ? null : chat._id);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {popoverOpen === chat._id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              exportChatToCSV(chat._id);
                            }}
                          >
                            <FileDown className="mr-2 h-4 w-4" />
                            Export to CSV
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ))}
        {loading && <div className="h-[20px] w-[100px] bg-gray-300 rounded-full mx-4 animate-pulse"></div>}
        {loadingMore && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        <div ref={ref}></div>
      </div>
      <div className="p-3 mb-3">
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 shadow-lg"
    onClick={handleLogout}
  >
    <LogOut className="h-5 w-5 mr-2" />
    <span>Logout</span>
  </motion.button>
</div>
    </div>
  )
}




 