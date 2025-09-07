import { useEffect, useState } from "react";

interface AudioWaveformProps {
  audioData?: number[];
  isActive?: boolean;
}

export function AudioWaveform({ audioData, isActive = false }: AudioWaveformProps) {
  const [waveData, setWaveData] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    if (!isActive) {
      setWaveData(Array(20).fill(0));
      return;
    }

    if (audioData && audioData.length > 0) {
      // Convert audio data to waveform visualization
      const audioArray = new Int16Array(audioData);
      const amplitude = calculateAmplitude(audioArray);
      animateAudioBars(amplitude);
    } else {
      // Fallback to simulated data if no real audio data
      const interval = setInterval(() => {
        setWaveData(prev => {
          const newData = [...prev];
          for (let i = 0; i < newData.length; i++) {
            newData[i] = Math.random() * 40 + 5; // Random height between 5-45px
          }
          return newData;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [audioData, isActive]);

  const calculateAmplitude = (audioData: Int16Array) => {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += Math.abs(audioData[i]);
    }
    return sum / audioData.length / 32768; // Normalize to 0-1
  };

  const animateAudioBars = (amplitude: number) => {
    const newData = [...waveData];
    for (let i = 0; i < newData.length; i++) {
      const height = Math.max(5, amplitude * 40 * (0.5 + Math.random() * 0.5));
      newData[i] = height;
    }
    setWaveData(newData);
  };

  return (
    <div className="bg-muted rounded-lg p-3">
      <div className="flex items-end justify-center h-12">
        {waveData.map((height, index) => (
          <div
            key={index}
            className="bg-primary rounded-sm transition-all duration-150 ease-out flex-1 mx-px"
            style={{
              height: `${height}px`,
              opacity: 0.7 + (height / 60) * 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
}