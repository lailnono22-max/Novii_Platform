import Layout from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Edit, 
  Search, 
  Camera, 
  Phone, 
  Video, 
  Info, 
  Image as ImageIcon, 
  Heart, 
  Smile, 
  Mic, 
  MessageCircle,
  Send,
  MoreVertical,
  ChevronLeft
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { users, currentUser } from "@/lib/dummy-data";
import { useLanguage } from "@/lib/language-context";
import { getTranslation } from "@/lib/translations";

interface Message {
  id: string;
  senderId: string;
  text: string;
  type: string;
  time: string;
  read?: boolean;
}

export default function Messages() {
  const { language, direction } = useLanguage();
  const t = getTranslation(language.code).messages;
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = direction === "rtl";

  const conversations = [
    { 
      id: "c1", 
      user: users[1], 
      lastMessage: t.sent_attachment, 
      time: "15m", 
      unread: 2,
      isActive: true
    },
    { 
      id: "c2", 
      user: users[2], 
      lastMessage: "Active 11h ago", 
      time: "11h", 
      unread: 0,
      isActive: false
    },
    { 
      id: "c3", 
      user: users[3], 
      lastMessage: "Active 7h ago", 
      time: "7h", 
      unread: 0,
      isActive: false
    },
    { 
      id: "c4", 
      user: currentUser, 
      lastMessage: "Active 1h ago",
      time: "1h",
      unread: 0,
      isActive: true
    },
  ];

  const chatHistory: Message[] = [
    { id: "m1", senderId: "me", text: "مرحباً! كيف حالك؟", type: "text", time: "11:00 PM", read: true },
    { id: "m2", senderId: "me", text: "هل أنت متاح للمحادثة؟", type: "text", time: "11:01 PM", read: true },
    { id: "m3", senderId: "other", text: "مرحباً! نعم متاح الآن 😊", type: "text", time: "11:05 PM" },
    { 
      id: "m4", 
      senderId: "other", 
      text: "ماذا تحتاج؟", 
      type: "text",
      time: "11:06 PM" 
    },
    { 
      id: "m5", 
      senderId: "me", 
      text: "أريد الاستفسار عن المنصة", 
      type: "text",
      time: "11:07 PM",
      read: true 
    },
  ];

  useEffect(() => {
    if (selectedConversation) {
      setMessages(chatHistory);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: `m${Date.now()}`,
        senderId: "me",
        text: messageInput,
        type: "text",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
      
      // Simulate reply after 1.5 seconds
      setTimeout(() => {
        const replyMessage: Message = {
          id: `m${Date.now()}`,
          senderId: "other",
          text: "تم استلام رسالتك! شكراً 👍",
          type: "text",
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedUser = conversations.find(c => c.id === selectedConversation)?.user;

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] md:h-screen w-full bg-background text-foreground overflow-hidden border-t border-border md:border-0">
        
        {/* Conversations Sidebar */}
        <div className={cn(
          "w-full md:w-[400px] flex flex-col border-e border-border bg-background",
          selectedConversation ? "hidden md:flex" : "flex"
        )}>
          
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="font-bold text-xl">{currentUser.username}</span>
              <ChevronLeft className={cn("w-4 h-4 transition-transform", isRTL && "rotate-180")} />
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <Edit className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-border">
             <div className="relative">
                <Search className={cn(
                  "absolute top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4", 
                  isRTL ? "right-3" : "left-3"
                )} />
                <Input 
                  placeholder={t.search_placeholder || "Search..."} 
                  className={cn(
                      "bg-secondary border-none rounded-xl h-10 placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary",
                      isRTL ? "pr-10 text-right" : "pl-10"
                  )} 
                />
             </div>
          </div>

          {/* Stories / Notes */}
          <div className="px-4 py-3 border-b border-border overflow-x-auto scrollbar-hide">
            <div className="flex gap-4">
               <div className="flex flex-col items-center gap-2 min-w-[70px]">
                  <div className="relative">
                      <Avatar className="w-16 h-16 ring-2 ring-border">
                          <AvatarImage src={currentUser.avatar} />
                          <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-background">
                          <span className="text-xs text-primary-foreground">+</span>
                      </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate w-16 text-center">
                    {isRTL ? "ملاحظتك" : "Your note"}
                  </span>
               </div>
               
               {users.slice(1, 4).map((user) => (
                 <div key={user.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                    <Avatar className="w-16 h-16 ring-2 ring-primary">
                        <AvatarImage src={user.avatar} />
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate w-16 text-center">
                      {user.username.split('_')[0]}
                    </span>
                 </div>
               ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center px-4 py-3 gap-6 text-sm font-semibold border-b border-border">
              <button className="text-foreground border-b-2 border-foreground pb-1">
                {isRTL ? "الرسائل" : "Messages"}
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                {isRTL ? "الطلبات" : "Requests"}
              </button>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
               {conversations.map((conv) => (
                 <div 
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={cn(
                        "flex items-center gap-3 p-4 hover:bg-accent cursor-pointer transition-all duration-200 border-b border-border/50 last:border-0",
                        selectedConversation === conv.id && "bg-accent"
                    )}
                 >
                    <div className="relative">
                        <Avatar className="w-14 h-14">
                            <AvatarImage src={conv.user.avatar} />
                            <AvatarFallback>{conv.user.username[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {conv.isActive && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse"></span>
                        )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm truncate">{conv.user.name || conv.user.username}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{conv.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="truncate flex-1">{conv.lastMessage}</span>
                            {conv.unread > 0 && (
                              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-bold flex-shrink-0">
                                {conv.unread}
                              </span>
                            )}
                        </div>
                    </div>
                    <Camera className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" />
                 </div>
               ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn(
            "flex-1 flex flex-col bg-background",
            selectedConversation ? "flex" : "hidden md:flex"
        )}>
            {selectedConversation && selectedUser ? (
                <>
                    {/* Chat Header */}
                    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-background shrink-0">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="md:hidden hover:bg-accent"
                                onClick={() => setSelectedConversation(null)}
                            >
                                <ChevronLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
                            </Button>
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={selectedUser.avatar} />
                                <AvatarFallback>{selectedUser.username[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-semibold text-sm truncate">{selectedUser.name || selectedUser.username}</span>
                                <span className="text-xs text-muted-foreground">
                                  {isRTL ? "نشط الآن" : "Active now"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                              <Phone className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                              <Video className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                              <Info className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-4 bg-background">
                        <div className="flex flex-col gap-2 max-w-3xl mx-auto">
                            <div className="text-center text-muted-foreground text-xs my-4 font-medium">
                              {new Date().toLocaleDateString(isRTL ? 'ar' : 'en', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                            
                            {messages.map((msg, index) => {
                              const isMe = msg.senderId === "me";
                              const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);
                              
                              return (
                                <div 
                                    key={msg.id} 
                                    className={cn(
                                        "flex w-full gap-2 animate-in slide-in-from-bottom-2 duration-300",
                                        isMe ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {!isMe && (
                                      <Avatar className={cn("w-7 h-7 mt-auto", !showAvatar && "opacity-0")}>
                                        <AvatarImage src={selectedUser.avatar} />
                                        <AvatarFallback className="text-xs">{selectedUser.username[0]?.toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                    )}
                                    <div 
                                        className={cn(
                                            "max-w-[75%] md:max-w-[60%] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm",
                                            isMe 
                                                ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md" 
                                                : "bg-secondary text-foreground rounded-2xl rounded-bl-md"
                                        )}
                                    >
                                        {msg.text}
                                        {isMe && msg.read && (
                                          <span className="text-xs opacity-70 ml-2">✓✓</span>
                                        )}
                                    </div>
                                </div>
                              );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border bg-background shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full">
                                <ImageIcon className="w-5 h-5 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full">
                                <Camera className="w-5 h-5 text-primary" />
                              </Button>
                            </div>
                            
                            <div className="flex-1 flex items-center gap-2 bg-secondary rounded-full px-4 py-2 border border-border focus-within:border-primary transition-colors">
                                <Input 
                                    className="flex-1 bg-transparent border-none placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto text-base"
                                    placeholder={isRTL ? "اكتب رسالة..." : "Message..."}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    dir={direction}
                                />
                                {messageInput.length === 0 && (
                                  <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full h-8 w-8">
                                        <Mic className="w-5 h-5" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full h-8 w-8">
                                        <Smile className="w-5 h-5" />
                                      </Button>
                                  </div>
                                )}
                            </div>
                            
                            {messageInput.trim().length > 0 && (
                                <Button 
                                  onClick={handleSendMessage}
                                  size="icon"
                                  className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            )}
                            
                            {messageInput.length === 0 && (
                              <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full">
                                <Heart className="w-5 h-5 text-destructive" />
                              </Button>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background">
                    <div className="w-32 h-32 rounded-full border-4 border-border flex items-center justify-center mb-6 bg-secondary/50">
                        <MessageCircle className="w-16 h-16 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">
                      {isRTL ? "رسائلك" : "Your messages"}
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      {isRTL 
                        ? "أرسل رسائل ومشاركات خاصة إلى صديق أو مجموعة"
                        : "Send private messages and posts to a friend or group"
                      }
                    </p>
                    <Button className="rounded-lg px-6">
                      {isRTL ? "إرسال رسالة" : "Send message"}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
}
