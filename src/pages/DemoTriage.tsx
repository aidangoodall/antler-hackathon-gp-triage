import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DemoTriage = () => {
  const [showWidget, setShowWidget] = useState(false);

  if (showWidget) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-muted flex items-center justify-center">
          <iframe 
            id="audio_iframe" 
            src="https://widget.synthflow.ai/widget/v2/52e8c91e-d1e4-496e-abee-513da1e43edd/1757194854411x821359361237070500" 
            allow="microphone" 
            width="400px" 
            height="400px" 
            className="border-none bg-transparent"
            style={{ pointerEvents: 'none' }}
            scrolling="no"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Demo Triage</h1>
          <p className="text-lg text-muted-foreground">Experience the AI Triage system in action</p>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => setShowWidget(true)}
          className="px-12 py-6 text-lg"
        >
          Begin Demo
        </Button>
      </div>
    </div>
  );
};

export default DemoTriage;