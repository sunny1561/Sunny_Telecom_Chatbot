"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveFeedback } from '@/app/actions/chat';
import { useToast } from "@/components/ui/use-toast"

interface FeedbackDialogProps {
  message_id: string;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ message_id }) => {
  const [feedback, setFeedback] = useState({
    referencedDocument: '',
    feedback1: '',
    relaventAnswer: '',
    feedback2: '',
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await saveFeedback({ messageId: message_id, feedback });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
        duration: 3000,
      });
      setOpen(false); // Close the dialog
      // Reset the form
      setFeedback({
        referencedDocument: '',
        feedback1: '',
        relaventAnswer: '',
        feedback2: '',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='' variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span className="sr-only">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            Please share your thoughts about the response.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="referencedDocument" className="text-right">
              Referenced Document
            </Label>
            <Input
              id="referencedDocument"
              name="referencedDocument"
              value={feedback.referencedDocument}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="feedback1" className="text-right">
              Feedback 1
            </Label>
            <Textarea
              id="feedback1"
              name="feedback1"
              value={feedback.feedback1}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relaventAnswer" className="text-right">
              Relevant Answer
            </Label>
            <Input
              id="relaventAnswer"
              name="relaventAnswer"
              value={feedback.relaventAnswer}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="feedback2" className="text-right">
              Feedback 2
            </Label>
            <Textarea
              id="feedback2"
              name="feedback2"
              value={feedback.feedback2}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;