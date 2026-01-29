import { useEffect, useRef, useState } from 'react';
import { AudioSystem } from '../game/AudioSystem';

export function useAudio() {
  const audioSystemRef = useRef<AudioSystem | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    audioSystemRef.current = new AudioSystem();

    return () => {
      audioSystemRef.current?.dispose();
    };
  }, []);

  const playSound = (name: string) => {
    audioSystemRef.current?.playSound(name);
  };

  const playBGM = async (url: string) => {
    await audioSystemRef.current?.playBGM(url);
  };

  const stopBGM = () => {
    audioSystemRef.current?.stopBGM();
  };

  const pauseBGM = () => {
    audioSystemRef.current?.pauseBGM();
  };

  const resumeBGM = () => {
    audioSystemRef.current?.resumeBGM();
  };

  const setAudioVolume = (newVolume: number) => {
    audioSystemRef.current?.setVolume(newVolume);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    audioSystemRef.current?.toggleMute();
    setIsMuted(audioSystemRef.current?.isMutedState() ?? false);
  };

  const loadSound = async (name: string, url: string) => {
    await audioSystemRef.current?.loadSound(name, url);
  };

  return {
    playSound,
    playBGM,
    stopBGM,
    pauseBGM,
    resumeBGM,
    volume,
    isMuted,
    setVolume: setAudioVolume,
    toggleMute,
    loadSound,
  };
}
