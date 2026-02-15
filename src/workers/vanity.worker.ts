import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';

interface GenerateMessage {
  type: 'generate';
  characters: string;
  position: 'prefix' | 'suffix';
  workerId?: number;
  progressInterval?: number;
  yieldInterval?: number;
}

interface PauseMessage {
  type: 'pause';
}

interface ResumeMessage {
  type: 'resume';
}

interface CancelMessage {
  type: 'cancel';
}

type WorkerMessage = GenerateMessage | PauseMessage | ResumeMessage | CancelMessage;

let isPaused = false;
let isCancelled = false;
let pausedTime = 0; // Track total time spent paused
let lastPauseStart = 0; // Track when last pause started

function base58Encode(buffer: Uint8Array): string {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const base = BigInt(58);
  
  let num = BigInt('0x' + Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join(''));
  let encoded = '';
  
  while (num > 0n) {
    const remainder = num % base;
    num = num / base;
    encoded = ALPHABET[Number(remainder)] + encoded;
  }
  
  for (const byte of buffer) {
    if (byte !== 0) break;
    encoded = '1' + encoded;
  }
  
  return encoded;
}

async function generateVanityAddress(
  characters: string, 
  position: 'prefix' | 'suffix',
  workerId: number = 0,
  progressInterval: number = 200,
  yieldInterval: number = 10000
): Promise<{ publicKey: string; secretKey: Uint8Array } | null> {
  const targetChars = characters;
  let attempts = 0;
  const startTime = Date.now();
  let lastProgressUpdate = startTime;
  
  while (!isCancelled) {
    if (isPaused) {
      await new Promise(resolve => setTimeout(resolve, 100));
      continue;
    }
    
    const keypair = nacl.sign.keyPair();
    const publicKeyBytes = keypair.publicKey;
    const publicKeyBase58 = base58Encode(publicKeyBytes);
    
    attempts++;
    
    const matches = position === 'prefix'
      ? publicKeyBase58.startsWith(targetChars)
      : publicKeyBase58.endsWith(targetChars);
    
    if (matches) {
      self.postMessage({
        type: 'success',
        publicKey: publicKeyBase58,
        secretKey: Array.from(keypair.secretKey),
        attempts,
        duration: Date.now() - startTime - pausedTime,
        workerId,
      });
      return {
        publicKey: publicKeyBase58,
        secretKey: keypair.secretKey,
      };
    }
    
    // Time-based progress updates instead of per-attempt frequency
    const now = Date.now();
    if (now - lastProgressUpdate >= progressInterval) {
      const elapsed = now - startTime - pausedTime;
      const rate = attempts / (elapsed / 1000);
      self.postMessage({
        type: 'progress',
        attempts,
        rate: Math.round(rate),
        elapsed,
        workerId,
      });
      lastProgressUpdate = now;
    }
    
    // Adaptive yielding based on performance mode
    if (attempts % yieldInterval === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return null;
}

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data;
  
  switch (type) {
    case 'generate':
      isCancelled = false;
      isPaused = false;
      pausedTime = 0;
      lastPauseStart = 0;
      const { characters, position, workerId = 0, progressInterval = 200, yieldInterval = 10000 } = event.data;
      await generateVanityAddress(characters, position, workerId, progressInterval, yieldInterval);
      break;
      
    case 'pause':
      isPaused = true;
      lastPauseStart = Date.now();
      self.postMessage({ type: 'paused' });
      break;
      
    case 'resume':
      if (isPaused && lastPauseStart > 0) {
        pausedTime += Date.now() - lastPauseStart;
        lastPauseStart = 0;
      }
      isPaused = false;
      self.postMessage({ type: 'resumed' });
      break;
      
    case 'cancel':
      isCancelled = true;
      self.postMessage({ type: 'cancelled' });
      break;
  }
});

export {};
