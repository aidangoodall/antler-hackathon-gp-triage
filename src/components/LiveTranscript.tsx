import { useEffect, useState } from "react";

interface LiveTranscriptProps {
  transcript: string[];
  isActive: boolean;
}

export function LiveTranscript({ transcript, isActive }: LiveTranscriptProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive || transcript.length === 0) {
      setDisplayedLines(transcript);
      return;
    }

    setDisplayedLines([]);
    setCurrentIndex(0);

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < transcript.length) {
          setDisplayedLines(current => [...current, transcript[prev]]);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [transcript, isActive]);

  return (
    <div className="bg-muted rounded-lg p-3 max-h-32 overflow-y-auto">
      <div className="space-y-1">
        {displayedLines.map((line, index) => (
          <p
            key={index}
            className={`text-xs transition-opacity duration-300 ${
              index === displayedLines.length - 1 && isActive
                ? "text-foreground animate-pulse"
                : "text-muted-foreground"
            }`}
          >
            {line}
          </p>
        ))}
        {isActive && currentIndex < transcript.length && (
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-primary animate-pulse rounded-sm"></div>
            <span className="text-xs text-muted-foreground">Transcribing...</span>
          </div>
        )}
      </div>
    </div>
  );
}