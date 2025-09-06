import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DemoPatient = () => {
  const [showVideo, setShowVideo] = useState(false);

  if (showVideo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="w-full max-w-4xl aspect-video bg-muted flex items-center justify-center">
          <iframe
            src="https://lab.anam.ai/frame/OTfUG4xnOQHzqh6QJ7UP1"
            width="720"
            height="480"
            allow="microphone"
            className="w-full h-full rounded-lg"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Demo Patient</h1>
          <p className="text-lg text-muted-foreground">Experience the AI Triage system in action</p>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => setShowVideo(true)}
          className="px-12 py-6 text-lg"
        >
          Begin Demo
        </Button>
      </div>
    </div>
  );
};

export default DemoPatient;