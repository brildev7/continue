import { BaseContextProvider } from "../../core/context";
import {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
} from "../../core/index";

/**
 * Simple custom context provider that generates random information
 */
class RandomProvider extends BaseContextProvider {
  static description: ContextProviderDescription = {
    title: "random",
    displayTitle: "Random Generator",
    description: "Generate random numbers, quotes, and fun facts",
    type: "normal",
    renderInlineAs: "Random information",
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    // Generate random numbers
    const randomInt = Math.floor(Math.random() * 1000);
    const randomFloat = Math.random();
    const randomPercent = Math.floor(Math.random() * 100);
    
    // Random quotes
    const quotes = [
      "The only way to do great work is to love what you do. - Steve Jobs",
      "Life is what happens to you while you're busy making other plans. - John Lennon",
      "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
      "It is during our darkest moments that we must focus to see the light. - Aristotle",
      "The way to get started is to quit talking and begin doing. - Walt Disney",
      "Don't let yesterday take up too much of today. - Will Rogers",
      "You learn more from failure than from success. Don't let it stop you. - Unknown",
      "If you are working on something that you really care about, you don't have to be pushed. - Steve Jobs",
    ];
    
    // Random facts
    const facts = [
      "A group of flamingos is called a flamboyance.",
      "Bananas are berries, but strawberries aren't.",
      "The shortest war in history lasted only 38-45 minutes.",
      "A octopus has three hearts and blue blood.",
      "The Great Wall of China isn't visible from space without aid.",
      "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.",
      "A shrimp's heart is in its head.",
      "The human brain uses about 20% of the body's total energy.",
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    
    // Format the content
    const content = `Random Information Generated:

🎲 Random Numbers:
- Random Integer (0-999): ${randomInt}
- Random Float (0-1): ${randomFloat.toFixed(6)}
- Random Percentage: ${randomPercent}%

💭 Random Quote:
"${randomQuote}"

🧠 Random Fact:
${randomFact}

🎯 Fun Challenge:
Try to use the number ${randomInt} in your next coding problem!

Generated at: ${new Date().toLocaleString()}`;

    return [
      {
        description: "Random numbers, quotes, and facts",
        content,
        name: "Random Info",
      },
    ];
  }
}

export default RandomProvider; 