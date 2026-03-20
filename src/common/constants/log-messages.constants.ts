export const COMMON_LOG_MESSAGES = {
  REST_CLIENT: {
    REQUEST_OUTBOUND: (method: string, url: string) => `→ ${method} ${url}`,
    RESPONSE_SUCCESS: (method: string, url: string, status: number, duration: number) => `← ${method} ${url} ${status} (${duration}ms)`,
    RESPONSE_ERROR: (method: string, url: string, status: number | string, duration: number, message: string) => `← ${method} ${url} ${status ?? 'NETWORK_ERROR'} (${duration}ms): ${message}`,
    RESPONSE_UNKNOWN_ERROR: (method: string, url: string, duration: number) => `← ${method} ${url} ERROR (${duration}ms)`,
  },
  EVENT_BUS: {
    PUBLISHING: (eventName: string, source: string) => `Publishing event: ${eventName} from ${source}`,
    PUBLISHED: (eventName: string) => `Event published successfully: ${eventName}`,
    PUBLISH_ERROR: (eventName: string, message: string) => `Error publishing event ${eventName}: ${message}`,
    PUBLISHING_ASYNC: (eventName: string, source: string) => `Publishing async event: ${eventName} from ${source}`,
    HANDLER_ERROR: (eventName: string, message: string) => `Error in event handler for ${eventName}: ${message}`,
    SUBSCRIBED: (eventName: string) => `Subscribed to event: ${eventName}`,
    UNSUBSCRIBED: (eventName: string) => `Unsubscribed from event: ${eventName}`,
    SUBSCRIBED_ONCE: (eventName: string) => `Subscribed once to event: ${eventName}`,
    REMOVED_LISTENERS: (eventName: string) => `Removed all listeners for event: ${eventName}`,
    REMOVED_ALL_LISTENERS: 'Removed all event listeners',
  },
};
