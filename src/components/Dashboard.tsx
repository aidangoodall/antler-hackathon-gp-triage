import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Phone, Clock, Activity, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { LiveTranscript } from "./LiveTranscript";

interface CallData {
  id: string;
  callerName: string;
  callerPhone: string;
  reason: string;
  startTime: Date;
  severity: "low" | "medium" | "high";
  transcript: string[];
  isActive?: boolean;
  audioAmplitude?: number;
}

interface WebSocketMessage {
  type: "audio" | "transcript" | "call_ended";
  data?: any;
  timestamp: string;
}

interface TranscriptData {
  speaker: "User" | "Assistant";
  text: string;
  timestamp: string;
  isFinal: boolean;
  confidence: number;
}

// Real-time Audio Waveform Component (matches HTML demo functionality)
function RealTimeAudioWaveform({ amplitude = 0, isActive = false }: { amplitude?: number; isActive?: boolean }) {
  const [animatedHeights, setAnimatedHeights] = useState([20, 20, 20, 20, 20]);

  useEffect(() => {
    if (!isActive) {
      setAnimatedHeights([20, 20, 20, 20, 20]);
      return;
    }

    const interval = setInterval(() => {
      setAnimatedHeights(prev => prev.map((_, index) => {
        // Use amplitude to influence bar heights, with some randomness
        const baseHeight = Math.max(20, amplitude * 60 * (0.5 + Math.random() * 0.5));
        return Math.min(60, baseHeight);
      }));
    }, 150);

    return () => clearInterval(interval);
  }, [amplitude, isActive]);

  if (!isActive) {
    return (
      <div className="bg-muted rounded-lg p-3 h-20 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No audio data</span>
      </div>
    );
  }

  return (
    <div className="bg-muted rounded-lg p-3">
      <div className="flex items-end justify-center h-16 gap-1">
        {animatedHeights.map((height, index) => (
          <div
            key={index}
            className="bg-primary rounded-sm transition-all duration-150 ease-out w-1"
            style={{
              height: `${height}px`,
              opacity: 0.7 + (height / 60) * 0.3,
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

const DEMO_CALLS: CallData[] = [
  {
    id: "4",
    callerName: "James Wilson",
    callerPhone: "+44 7700 900321",
    reason: "Prescription renewal",
    startTime: new Date(Date.now() - 3600000),
    severity: "low",
    transcript: ["Need to renew my blood pressure medication", "Same dosage as before"],
  },
  {
    id: "5",
    callerName: "Lisa Brown",
    callerPhone: "+44 7700 900654",
    reason: "Severe allergic reaction",
    startTime: new Date(Date.now() - 7200000),
    severity: "high",
    transcript: ["Allergic reaction to new medication", "Face is swelling", "Difficulty breathing"],
  }
];

export function Dashboard() {
  const [liveCalls, setLiveCalls] = useState<CallData[]>([]);
  const [pastCalls] = useState<CallData[]>(DEMO_CALLS);
  const [demoActive, setDemoActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  
  const ws = useRef<WebSocket | null>(null);
  const currentCall = useRef<CallData | null>(null);
  const hasActiveCall = useRef<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const connectWebSocket = async () => {
    setConnectionStatus("connecting");
    
    try {
      let wsUrl = 'wss://gp-surgery-app.kindhill-4b358ea4.uksouth.azurecontainerapps.io';
      
      try {
        const serverUrl = 'https://gp-surgery-app.kindhill-4b358ea4.uksouth.azurecontainerapps.io';
        const response = await fetch(`${serverUrl}/api/config`);
        const config = await response.json();
        wsUrl = config.downstreamWebSocketUrl;
        console.log('Using WebSocket URL:', wsUrl);
      } catch (error) {
        console.error('Failed to get WebSocket URL from config, using default:', error);
      }
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        setConnectionStatus("connected");
        // Don't create a call here - wait for actual audio/transcript data
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setConnectionStatus("disconnected");
        hasActiveCall.current = false;
        
        // Mark current call as inactive if exists
        if (currentCall.current) {
          setLiveCalls(prev => prev.map(call => 
            call.id === currentCall.current?.id 
              ? { ...call, isActive: false }
              : call
          ));
        }
        
        // Auto-reconnect if still monitoring
        if (demoActive) {
          setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setConnectionStatus("disconnected");
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionStatus("disconnected");
    }
  };

  const calculateAmplitude = (audioData: number[]): number => {
    if (!audioData || audioData.length === 0) return 0;
    
    const audioArray = new Int16Array(audioData);
    let sum = 0;
    for (let i = 0; i < audioArray.length; i++) {
      sum += Math.abs(audioArray[i]);
    }
    return sum / audioArray.length / 32768; // Normalize to 0-1
  };

  const createCallIfNeeded = (): CallData => {
    if (!currentCall.current && !hasActiveCall.current) {
      const newCall: CallData = {
        id: Date.now().toString(),
        callerName: "Live Caller",
        callerPhone: "+44 7700 900000",
        reason: "Live consultation in progress",
        startTime: new Date(),
        severity: "medium",
        transcript: [],
        isActive: true,
        audioAmplitude: 0
      };
      
      currentCall.current = newCall;
      hasActiveCall.current = true;
      setLiveCalls([newCall]);
      
      return newCall;
    }
    return currentCall.current!;
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'audio':
        if (message.data && message.data.length > 0) {
          // Create call on first audio data (indicates active call)
          const call = createCallIfNeeded();
          
          // Calculate amplitude for real-time visualization
          const amplitude = calculateAmplitude(message.data);
          
          setLiveCalls(prev => prev.map(callItem => 
            callItem.id === call.id 
              ? { ...callItem, audioAmplitude: amplitude, isActive: true }
              : callItem
          ));
        }
        break;

      case 'transcript':
        if (message.data) {
          const transcriptData: TranscriptData = message.data;
          
          // Create call on first transcript (indicates active call)
          const call = createCallIfNeeded();
          
          // Only process final transcripts (same as HTML demo)
          if (transcriptData.isFinal) {
            console.log('Transcript received:', transcriptData.text);
            
            setLiveCalls(prev => prev.map(callItem => 
              callItem.id === call.id 
                ? { 
                    ...callItem, 
                    transcript: [...callItem.transcript, `${transcriptData.speaker}: ${transcriptData.text}`],
                    // Update caller info if we learn it from transcript
                    callerName: callItem.callerName === "Live Caller" && transcriptData.speaker === "User" 
                      ? extractNameFromTranscript(transcriptData.text) || callItem.callerName
                      : callItem.callerName,
                    // Update reason based on transcript content
                    reason: callItem.reason === "Live consultation in progress" 
                      ? extractReasonFromTranscript([...callItem.transcript, `${transcriptData.speaker}: ${transcriptData.text}`]) || callItem.reason
                      : callItem.reason
                  }
                : callItem
            ));
          }
        }
        break;

      case 'call_ended':
        console.log('Call ended signal received');
        hasActiveCall.current = false;
        
        if (currentCall.current) {
          setLiveCalls(prev => prev.map(call => 
            call.id === currentCall.current?.id 
              ? { 
                  ...call, 
                  isActive: false, 
                  audioAmplitude: 0,
                  transcript: [...call.transcript, "--- Call Ended ---"] 
                }
              : call
          ));
          
          // Move to past calls after delay
          setTimeout(() => {
            if (currentCall.current) {
              setLiveCalls(prev => prev.filter(call => call.id !== currentCall.current?.id));
            }
            currentCall.current = null;
          }, 5000);
        }
        break;

      default:
        console.log('Unknown message type:', message.type, message);
    }
  };

  const extractNameFromTranscript = (text: string): string | null => {
    const nameMatch = text.match(/(?:my name is|i'm|i am)\s+([a-zA-Z]+)/i);
    return nameMatch ? nameMatch[1] : null;
  };

  const extractReasonFromTranscript = (transcripts: string[]): string | null => {
    const allText = transcripts.join(' ').toLowerCase();
    
    if (allText.includes('chest pain') || allText.includes('heart')) return 'Chest pain consultation';
    if (allText.includes('headache') || allText.includes('head')) return 'Headache assessment';
    if (allText.includes('appointment') || allText.includes('book')) return 'Appointment booking';
    if (allText.includes('prescription') || allText.includes('medication')) return 'Prescription inquiry';
    if (allText.includes('pain')) return 'Pain assessment';
    
    return null;
  };

  const startDemo = () => {
    setDemoActive(true);
    connectWebSocket();
  };

  const stopDemo = () => {
    setDemoActive(false);
    if (ws.current) {
      ws.current.close();
    }
    setLiveCalls([]);
    currentCall.current = null;
    hasActiveCall.current = false;
  };

  const formatElapsedTime = (startTime: Date) => {
    const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high": return "HIGH";
      case "medium": return "MEDIUM";
      case "low": return "LOW";
      default: return "UNKNOWN";
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected": return <Wifi className="h-4 w-4 text-green-500" />;
      case "connecting": return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default: return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connected": return "Connected to Voice System";
      case "connecting": return "Connecting...";
      default: return "Disconnected";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">GP Triage Dashboard</h1>
              <p className="text-sm text-muted-foreground">Live call monitoring and patient triage</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {getConnectionIcon()}
              <span className={connectionStatus === "connected" ? "text-green-600" : "text-muted-foreground"}>
                {getConnectionText()}
              </span>
            </div>
            
            {!demoActive ? (
              <Button onClick={startDemo} className="gap-2">
                <Play className="h-4 w-4" />
                Start Monitoring
              </Button>
            ) : (
              <Button onClick={stopDemo} variant="destructive" className="gap-2">
                Stop Monitoring
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="live" className="gap-2">
              <Activity className="h-4 w-4" />
              Live Calls ({liveCalls.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Calls ({pastCalls.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6">
            {!demoActive && (
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Click "Start Monitoring" to connect to the live voice system and begin receiving calls.
                </AlertDescription>
              </Alert>
            )}

            {liveCalls.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {demoActive ? "Waiting for Calls" : "No Active Calls"}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {demoActive 
                      ? "Connected and ready - call cards will appear when calls begin"
                      : "Start monitoring to connect to the live voice system"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {liveCalls.map((call) => (
                  <Card key={call.id} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{call.callerName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{call.callerPhone}</p>
                        </div>
                        <Badge variant={getSeverityColor(call.severity) as any}>
                          {getSeverityLabel(call.severity)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">Reason for call:</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono font-medium">
                              {formatElapsedTime(call.startTime)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{call.reason}</p>
                      </div>

                      <RealTimeAudioWaveform 
                        amplitude={call.audioAmplitude || 0} 
                        isActive={call.isActive || false} 
                      />

                      <div>
                        <LiveTranscript 
                          transcript={call.transcript} 
                          isActive={call.isActive || false}
                        />
                      </div>

                      {call.transcript.some(t => t.toLowerCase().includes('pain') || t.toLowerCase().includes('emergency') || t.toLowerCase().includes('urgent')) && (
                        <Alert className="border-warning bg-warning/10">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <AlertDescription className="text-warning-foreground">
                            <strong>AI Alert:</strong> Potential urgent symptoms detected. Review immediately.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="grid gap-4">
              {pastCalls.map((call) => (
                <Card key={call.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">{call.callerName}</h3>
                          <Badge variant={getSeverityColor(call.severity) as any} className="text-xs">
                            {getSeverityLabel(call.severity)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{call.callerPhone}</p>
                        <p className="text-sm">{call.reason}</p>
                        
                        {call.callerName === "James Wilson" && (
                          <Alert className="mt-3 border-blue-200 bg-blue-50/50 max-w-md">
                            <AlertTriangle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              Low mood detected. Wellbeing follow-up scheduled for 10th September 2025
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {call.callerName === "Lisa Brown" && (
                          <Alert className="mt-3 border-orange-200 bg-orange-50/50 max-w-md">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800">
                              Frequent caller, may need wellbeing support
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {call.startTime.toLocaleTimeString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}