import { useEffect, useState } from "react";

export function AudioWaveform() {
  const [waveData, setWaveData] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveData(prev => {
        const newData = [...prev];
        // Simulate audio waveform data
        for (let i = 0; i < newData.length; i++) {
          newData[i] = Math.random() * 40 + 5; // Random height between 5-45px
        }
        return newData;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-muted rounded-lg p-3">
      
      <div className="flex items-end justify-center gap-1 h-12">
        {waveData.map((height, index) => (
          <div
            key={index}
            className="bg-primary rounded-sm transition-all duration-150 ease-out"
            style={{
              height: `${height}px`,
              width: '3px',
              opacity: 0.7 + (height / 60) * 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
}