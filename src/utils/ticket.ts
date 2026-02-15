import { VanityLength, VanityPosition } from '../config/constants';

const TICKET_STORAGE_KEY = 'solgen_ticket';

export interface Ticket {
  walletAddress: string;
  vanityLength: VanityLength;
  vanityCharacters: string;
  vanityPosition: VanityPosition;
  createdAt: number;
  transactionSignature?: string; // Optional: store the payment transaction signature
}

/**
 * Create a new ticket for a wallet address after successful payment
 */
export function createTicket(
  walletAddress: string,
  vanityLength: VanityLength,
  vanityCharacters: string,
  vanityPosition: VanityPosition,
  transactionSignature?: string
): Ticket {
  const ticket: Ticket = {
    walletAddress,
    vanityLength,
    vanityCharacters,
    vanityPosition,
    createdAt: Date.now(),
    transactionSignature,
  };

  try {
    localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(ticket));
  } catch (error) {
    console.error('Failed to save ticket:', error);
  }

  return ticket;
}

/**
 * Get the active ticket for a wallet address
 * Returns null if no ticket exists or if the ticket is for a different wallet
 */
export function getTicket(walletAddress: string): Ticket | null {
  try {
    const storedTicket = localStorage.getItem(TICKET_STORAGE_KEY);
    if (!storedTicket) {
      return null;
    }

    const ticket: Ticket = JSON.parse(storedTicket);
    
    // Verify the ticket belongs to this wallet
    if (ticket.walletAddress !== walletAddress) {
      return null;
    }

    return ticket;
  } catch (error) {
    console.error('Failed to retrieve ticket:', error);
    return null;
  }
}

/**
 * Check if a wallet has a valid active ticket
 */
export function hasValidTicket(walletAddress: string): boolean {
  const ticket = getTicket(walletAddress);
  return ticket !== null;
}

/**
 * Consume/invalidate a ticket after successful generation
 */
export function consumeTicket(walletAddress: string): void {
  try {
    const ticket = getTicket(walletAddress);
    if (ticket && ticket.walletAddress === walletAddress) {
      localStorage.removeItem(TICKET_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to consume ticket:', error);
  }
}

/**
 * Clear all tickets (for testing/debugging)
 */
export function clearAllTickets(): void {
  try {
    localStorage.removeItem(TICKET_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear tickets:', error);
  }
}
