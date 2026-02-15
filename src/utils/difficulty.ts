/**
 * Analyzes the difficulty of generating a vanity address based on character patterns
 * and provides helpful tips to the user
 */

interface DifficultyAnalysis {
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'very-hard';
  estimatedAttempts: number;
  tips: string[];
  suggestions: string[];
}

/**
 * Calculates the difficulty of finding a vanity address with the given characters
 */
export function analyzeDifficulty(
  characters: string,
  position: 'prefix' | 'suffix',
  length: number
): DifficultyAnalysis {
  const BASE58_CHARSET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  
  // Calculate base probability
  const baseAttempts = Math.pow(58, length);
  
  // Analyze character difficulty
  const tips: string[] = [];
  const suggestions: string[] = [];
  
  // Check for impossible/invalid characters
  const invalidChars = characters.split('').filter(c => !BASE58_CHARSET.includes(c));
  if (invalidChars.length > 0) {
    tips.push(`⚠️ Invalid characters detected: ${invalidChars.join(', ')}. Base58 excludes 0, O, I, and l.`);
  }
  
  // Check for commonly confused characters
  if (characters.includes('0') || characters.includes('O') || 
      characters.includes('I') || characters.includes('l')) {
    tips.push('💡 Base58 encoding excludes 0 (zero), O (capital o), I (capital i), and l (lowercase L) to avoid confusion.');
    suggestions.push('Try using similar-looking alternatives like 1, o, i, or L instead.');
  }
  
  // Check for uppercase vs lowercase
  const hasUppercase = /[A-Z]/.test(characters);
  const hasLowercase = /[a-z]/.test(characters);
  const hasNumbers = /[0-9]/.test(characters);
  
  if (hasUppercase && !hasLowercase && !hasNumbers) {
    tips.push('🎯 All uppercase letters reduce your search space significantly.');
    suggestions.push('Consider mixing uppercase and lowercase for faster results.');
  }
  
  if (hasLowercase && !hasUppercase && !hasNumbers) {
    tips.push('🎯 All lowercase letters reduce your search space significantly.');
    suggestions.push('Consider mixing uppercase and lowercase for faster results.');
  }
  
  // Length-based tips
  if (length >= 5) {
    tips.push('⏱️ Generating 5+ character vanity addresses can take hours or even days.');
    suggestions.push('Start with shorter patterns (3-4 characters) for quicker results.');
  } else if (length >= 4) {
    tips.push('⏱️ 4-character vanity addresses typically take several minutes to hours.');
    suggestions.push('Be patient or try a 3-character pattern for faster generation.');
  } else if (length === 3) {
    tips.push('✨ 3-character patterns usually generate within seconds to minutes.');
  }
  
  // Position-based tips
  if (position === 'suffix') {
    tips.push('📍 Suffix patterns typically take the same time as prefix patterns.');
  }
  
  // Character frequency analysis
  const commonChars = '123456789abcdefghijkmnopqrstuvwxyz';
  const uncommonCount = characters.split('').filter(c => !commonChars.includes(c.toLowerCase())).length;
  
  if (uncommonCount > length / 2) {
    tips.push('🔤 Using many uppercase letters or uncommon characters increases difficulty.');
    suggestions.push('Mix in more common characters (lowercase letters and numbers) for faster results.');
  }
  
  // Repetitive patterns
  const isRepetitive = characters.length >= 2 && characters.split('').every(c => c === characters[0]);
  if (isRepetitive) {
    tips.push('🔁 Repetitive patterns (like "aaa" or "111") are just as hard as random patterns.');
    suggestions.push('Any valid base58 pattern has the same probability, so feel free to be creative!');
  }
  
  // Determine difficulty level
  let difficultyLevel: 'easy' | 'medium' | 'hard' | 'very-hard';
  if (length <= 3) {
    difficultyLevel = 'easy';
  } else if (length === 4) {
    difficultyLevel = 'medium';
  } else if (length === 5) {
    difficultyLevel = 'hard';
  } else {
    difficultyLevel = 'very-hard';
  }
  
  // Add general tips if we don't have many specific ones
  if (tips.length === 0) {
    tips.push('💪 Your pattern looks good! Generation time depends on your device performance.');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('You can try again with the same pattern or modify it to make it easier to find.');
  }
  
  return {
    difficultyLevel,
    estimatedAttempts: Math.min(Math.floor(baseAttempts / 2), 999999999999), // Cap at ~1 trillion for display
    tips,
    suggestions,
  };
}

/**
 * Get a human-readable difficulty description
 */
export function getDifficultyDescription(level: 'easy' | 'medium' | 'hard' | 'very-hard'): string {
  switch (level) {
    case 'easy':
      return 'Quick generation (seconds to minutes)';
    case 'medium':
      return 'Moderate generation time (minutes to hours)';
    case 'hard':
      return 'Long generation time (hours to days)';
    case 'very-hard':
      return 'Very long generation time (days to weeks)';
  }
}
