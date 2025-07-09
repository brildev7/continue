import { BaseContextProvider } from "../../core/context";
import {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
} from "../../core/index";

/**
 * Simple custom context provider that provides current time and timezone information
 */
class TimeContextProvider extends BaseContextProvider {
  static description: ContextProviderDescription = {
    title: "time",
    displayTitle: "Current Time",
    description: "Get current time and timezone information",
    type: "normal",
    renderInlineAs: "Current time and timezone",
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    const now = new Date();
    
    // Get various time representations
    const localTime = now.toLocaleString();
    const utcTime = now.toUTCString();
    const iso8601 = now.toISOString();
    const timestamp = now.getTime();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Format the content
    const content = `Current Date and Time Information:

📅 Local Time: ${localTime}
🌍 UTC Time: ${utcTime}
⏰ ISO 8601: ${iso8601}
🕐 Timestamp: ${timestamp}
🌐 Timezone: ${timezone}

Additional Information:
- Day of week: ${now.toLocaleDateString('en-US', { weekday: 'long' })}
- Week of year: ${Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7)}
- Unix timestamp: ${Math.floor(timestamp / 1000)}

This information was generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}.`;

    return [
      {
        description: "Current date and time information",
        content,
        name: "Current Time",
      },
    ];
  }
}

export default TimeContextProvider; 