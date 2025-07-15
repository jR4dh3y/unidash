
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Send } from 'lucide-react';
import { studentCoach } from '@/ai/flows/student-coach';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface Message {
  role: 'user' | 'model';
  content: string;
}

export function StuckButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    const currentPrompt = prompt;
    setPrompt('');
    setIsLoading(true);

    try {
      const result = await studentCoach(currentPrompt);
      setMessages([...newMessages, { role: 'model', content: result }]);
    } catch (error) {
      console.error('AI coach error:', error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with the AI coach. Please try again later.",
      });
      setMessages(messages); // Revert to previous state on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setMessages([]);
    }
    setIsOpen(open);
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleOpenChange(true)}
              className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110"
              size="icon"
            >
              <Bot className="h-8 w-8" />
              <span className="sr-only">Stuck? Get help.</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Stuck? Get help from the AI Coach.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] flex flex-col h-[70vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot />
              Developer Coach
            </DialogTitle>
            <DialogDescription>
              Feeling stuck on your development journey? Ask for guidance, ideas, or encouragement.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-4 -mr-6">
             <div className="space-y-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'model' && (
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[85%] whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
               {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border">
                       <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                       <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
               )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <div className="relative w-full">
              <Textarea
                placeholder="e.g., How do I get started with React?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="pr-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={isLoading || !prompt.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
