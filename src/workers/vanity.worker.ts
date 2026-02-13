import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';

interface GenerateMessage {
  type: 'generate';
  characters: string;
  position: 'prefix' | 'suffix';
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

async function generateVanityAddress(characters: string, position: 'prefix' | 'suffix'): Promise<{ publicKey: string; secretKey: Uint8Array } | null> {
  const targetChars = characters.toLowerCase();
  let attempts = 0;
  const startTime = Date.now();
  
  while (!isCancelled) {
    if (isPaused) {
      await new Promise(resolve => setTimeout(resolve, 100));
      continue;
    }
    
    const keypair = nacl.sign.keyPair();
    const publicKeyBytes = keypair.publicKey;
    const publicKeyBase58 = base58Encode(publicKeyBytes);
    const publicKeyLower = publicKeyBase58.toLowerCase();
    
    attempts++;
    
    const matches = position === 'prefix'
      ? publicKeyLower.startsWith(targetChars)
      : publicKeyLower.endsWith(targetChars);
    
    if (matches) {
      self.postMessage({
        type: 'success',
        publicKey: publicKeyBase58,
        secretKey: Array.from(keypair.secretKey),
        attempts,
        duration: Date.now() - startTime,
      });
      return {
        publicKey: publicKeyBase58,
        secretKey: keypair.secretKey,
      };
    }
    
    if (attempts % 1000 === 0) {
      const elapsed = Date.now() - startTime;
      const rate = attempts / (elapsed / 1000);
      self.postMessage({
        type: 'progress',
        attempts,
        rate: Math.round(rate),
        elapsed,
      });
    }
    
    // Yield control every 10000 attempts to keep worker responsive
    if (attempts % 10000 === 0) {
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
      const { characters, position } = event.data;
      await generateVanityAddress(characters, position);
      break;
      
    case 'pause':
      isPaused = true;
      self.postMessage({ type: 'paused' });
      break;
      
    case 'resume':
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
