export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private bgmNode: AudioBufferSourceNode | null = null;
  private bgmGainNode: GainNode | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;
  private soundEffects: Map<string, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new AudioContext();
    }
  }

  // 生成合成音效
  private playSynthesizedSound(type: string): void {
    if (!this.audioContext || this.isMuted) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'eat':
      case 'eat-normal':
        // 普通食物：短促的高音
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.exponentialRampToValueAtTime(1100, now + 0.05);
        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case 'eat-gold':
        // 金色食物：两段上升音调
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, now);
        oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.15);
        gainNode.gain.setValueAtTime(this.volume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'eat-rainbow':
        // 彩虹食物：三段上升音调
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, now);
        oscillator.frequency.exponentialRampToValueAtTime(1047, now + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(1568, now + 0.2);
        gainNode.gain.setValueAtTime(this.volume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'invincible':
        // 无敌状态：连续的上升音调
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.linearRampToValueAtTime(880, now + 0.1);
        oscillator.frequency.linearRampToValueAtTime(1320, now + 0.2);
        gainNode.gain.setValueAtTime(this.volume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'trap-blue':
        // 蓝色陷阱：低沉的警告声
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        oscillator.start(now);
        oscillator.stop(now + 0.25);
        break;

      case 'trap-purple':
        // 紫色陷阱：尖锐的警报声
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.linearRampToValueAtTime(400, now + 0.15);
        oscillator.frequency.linearRampToValueAtTime(800, now + 0.3);
        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        oscillator.start(now);
        oscillator.stop(now + 0.35);
        break;

      case 'gameover':
        // 游戏结束：下降的悲伤音调
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, now);
        oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.3);
        gainNode.gain.setValueAtTime(this.volume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;
    }
  }

  async loadSound(name: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.soundEffects.set(name, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sound ${name}:`, error);
    }
  }

  playSound(name: string): void {
    if (!this.audioContext || this.isMuted) return;

    const buffer = this.soundEffects.get(name);
    if (buffer) {
      // 使用预加载的音频
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = this.volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0);
    } else {
      // 使用合成音效作为降级处理
      this.playSynthesizedSound(name);
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.value = this.isMuted ? 0 : this.volume * 0.3;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.value = this.isMuted ? 0 : this.volume * 0.3;
    }
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  async playBGM(url: string, loop: boolean = true): Promise<void> {
    if (!this.audioContext || this.isMuted) return;

    if (this.bgmNode) {
      this.bgmNode.stop();
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.bgmNode = this.audioContext.createBufferSource();
      this.bgmNode.buffer = audioBuffer;
      this.bgmNode.loop = loop;

      this.bgmGainNode = this.audioContext.createGain();
      this.bgmGainNode.gain.value = this.volume * 0.3;

      this.bgmNode.connect(this.bgmGainNode);
      this.bgmGainNode.connect(this.audioContext.destination);

      this.bgmNode.start(0);
    } catch (error) {
      console.error('Failed to play BGM:', error);
    }
  }

  stopBGM(): void {
    if (this.bgmNode) {
      try {
        this.bgmNode.stop();
      } catch (error) {
        // Ignore if already stopped
      }
      this.bgmNode = null;
    }
  }

  pauseBGM(): void {
    if (this.audioContext) {
      this.audioContext.suspend();
    }
  }

  resumeBGM(): void {
    if (this.audioContext) {
      this.audioContext.resume();
    }
  }

  dispose(): void {
    this.stopBGM();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
