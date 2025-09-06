import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DemoPatient = () => {
  const [showVideo, setShowVideo] = useState(false);

  if (showVideo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="w-full max-w-4xl aspect-video bg-muted flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-primary-foreground border-y-[4px] border-y-transparent ml-1"></div>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Demo Video Placeholder</h2>
            <p className="text-muted-foreground">Video content will be added here</p>
          </div>
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