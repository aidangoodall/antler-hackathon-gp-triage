import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Phone } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const DemoFull = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [isDialing, setIsDialing] = useState(false);
  const [demosLoaded, setDemosLoaded] = useState(false);
  const [autoPlayStarted, setAutoPlayStarted] = useState(false);

  const startDemo = async () => {
    setShowDemo(true);
    setIsDialing(true);

    // Show dialing animation for 3 seconds
    setTimeout(() => {
      setIsDialing(false);
      setDemosLoaded(true);
      
      // Start auto-play sequence after a short delay
      setTimeout(() => {
        setAutoPlayStarted(true);
        // Here we would trigger the triage demo start and then patient demo
        // For now, we'll just simulate the sequence
      }, 1000);
    }, 3000);
  };

  if (showDemo) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Navigation />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Full Demo Experience</h1>
            <p className="text-lg text-muted-foreground">Watch Julia interact with the GP system</p>
          </div>

          {isDialing && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="p-8 text-center space-y-4">
                <div className="animate-pulse">
                  <Phone className="w-16 h-16 mx-auto text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Julia is dialing the GP...</h3>
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-muted-foreground">Connecting to triage system</span>
                </div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient Demo - Julia */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground">Patient - Julia</h2>
                <p className="text-muted-foreground">AI patient calling for medical advice</p>
              </div>
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                <iframe 
                  src="https://lab.anam.ai/frame/OTfUG4xnOQHzqh6QJ7UP1"
                  width="100%"
                  height="100%"
                  allow="microphone"
                  className="w-full h-full"
                />
              </div>
              {autoPlayStarted && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">🟢 Auto-play activated - Julia is now speaking</p>
                </div>
              )}
            </Card>

            {/* Triage Demo - GP System */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground">GP Triage System</h2>
                <p className="text-muted-foreground">AI-powered medical triage assistant</p>
              </div>
              <div className="flex justify-center items-center h-[480px] bg-muted rounded-lg relative">
                <iframe 
                  id="triage_iframe" 
                  src="https://widget.synthflow.ai/widget/v2/52e8c91e-d1e4-496e-abee-513da1e43edd/1757194854411x821359361237070500" 
                  allow="microphone" 
                  width="400" 
                  height="550"
                  className="pointer-events-auto"
                  style={{ position: "relative", background: "transparent", border: "none", zIndex: 1 }}
                />
                {demosLoaded && !autoPlayStarted && (
                  <div className="absolute top-4 right-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">🔵 Triage system ready</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDemo(false);
                setIsDialing(false);
                setDemosLoaded(false);
                setAutoPlayStarted(false);
              }}
            >
              Reset Demo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Navigation />
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Full Demo Experience</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch as Julia, our AI patient, calls the GP triage system and experiences a full medical consultation workflow
          </p>
        </div>
        
        <Button 
          size="lg" 
          onClick={startDemo}
          className="px-12 py-6 text-lg"
        >
          Begin Demo
        </Button>
      </div>
    </div>
  );
};

export default DemoFull;