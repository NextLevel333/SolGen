export function formatSolAmount(amount: number): string {
  return `${amount.toFixed(3)} SOL`;
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function estimateTime(charactersLength: number, rate: number): number {
  const base58Chars = 58;
  const avgAttempts = Math.pow(base58Chars, charactersLength) / 2;
  const estimatedSeconds = avgAttempts / rate;
  return estimatedSeconds * 1000; // Convert to milliseconds
}

export function validateVanityCharacters(characters: string): boolean {
  const validBase58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return validBase58.test(characters);
}

export function truncateAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
