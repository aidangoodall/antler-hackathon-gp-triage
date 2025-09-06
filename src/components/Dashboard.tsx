import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Play, Phone, Clock, Activity } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";
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
}

const DEMO_CALLS: CallData[] = [
  {
    id: "1",
    callerName: "Sarah Johnson",
    callerPhone: "+44 7700 900123",
    reason: "Chest pain and shortness of breath",
    startTime: new Date(Date.now() - 180000), // 3 minutes ago
    severity: "high",
    transcript: [
      "Hello, this is Sarah Johnson",
      "I'm experiencing severe chest pain",
      "It started about 20 minutes ago",
      "The pain is radiating to my left arm"
    ],
    isActive: true
  },
  {
    id: "2", 
    callerName: "Michael Smith",
    callerPhone: "+44 7700 900456",
    reason: "Follow-up appointment booking",
    startTime: new Date(Date.now() - 120000), // 2 minutes ago
    severity: "low",
    transcript: [
      "Hi, I need to book a follow-up appointment",
      "I saw Dr. Williams last week",
      "He asked me to come back in a week"
    ],
    isActive: true
  },
  {
    id: "3",
    callerName: "Emma Davis",
    callerPhone: "+44 7700 900789",
    reason: "Persistent headaches",
    startTime: new Date(Date.now() - 300000), // 5 minutes ago
    severity: "medium",
    transcript: [
      "I've been having headaches for 3 days",
      "They're getting worse",
      "I've tried paracetamol but it's not helping"
    ],
    isActive: true
  }
];

const PAST_CALLS: CallData[] = [
  {
    id: "4",
    callerName: "James Wilson",
    callerPhone: "+44 7700 900321",
    reason: "Prescription renewal",
    startTime: new Date(Date.now() - 3600000), // 1 hour ago
    severity: "low",
    transcript: ["Need to renew my blood pressure medication", "Same dosage as before"],
  },
  {
    id: "5",
    callerName: "Lisa Brown",
    callerPhone: "+44 7700 900654",
    reason: "Severe allergic reaction",
    startTime: new Date(Date.now() - 7200000), // 2 hours ago
    severity: "high",
    transcript: ["Allergic reaction to new medication", "Face is swelling", "Difficulty breathing"],
  }
];

export function Dashboard() {
  const [liveCalls, setLiveCalls] = useState<CallData[]>([]);
  const [pastCalls] = useState<CallData[]>(PAST_CALLS);
  const [demoActive, setDemoActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const startDemo = () => {
    setDemoActive(true);
    setLiveCalls(DEMO_CALLS);
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
          
          {!demoActive && (
            <Button onClick={startDemo} className="gap-2">
              <Play className="h-4 w-4" />
              Begin Demo
            </Button>
          )}
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
            {liveCalls.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Calls</h3>
                  <p className="text-muted-foreground text-center">
                    {!demoActive 
                      ? "Click 'Begin Demo' to simulate incoming calls"
                      : "All calls have been completed"
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

                      {call.isActive && <AudioWaveform />}

                      <div>
                        <LiveTranscript 
                          transcript={call.transcript} 
                          isActive={call.isActive || false}
                        />
                      </div>
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