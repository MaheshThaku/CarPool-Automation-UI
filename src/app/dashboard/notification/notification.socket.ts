import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import {
  useNotificationStore,
  type Notification,
} from "./notification.store";

let client: Client | null = null;

export function connectNotificationSocket() {
  if (client?.active) {
    return;
  }

  client = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8081/ws"),

    reconnectDelay: 5000,

    debug: (message) => {
      console.log("[STOMP]", message);
    },

    onConnect: () => {
      console.log("✅ Notification WebSocket Connected");

      useNotificationStore.getState().setConnected(true);

      client?.subscribe(
        "/user/queue/notifications",
        (message) => {
          console.log("========== NOTIFICATION RECEIVED ==========");
          console.log("Raw Message:", message.body);

          const notification: Notification = JSON.parse(message.body);

          console.log("Parsed Notification:", notification);

          useNotificationStore
            .getState()
            .addNotification(notification);

          console.log(
            "Unread Count:",
            useNotificationStore.getState().unreadCount
          );
        }
      );

      console.log("✅ Subscribed to /user/queue/notifications");
    },

    onStompError: (frame) => {
      console.error("❌ STOMP Error:", frame);
    },

    onWebSocketClose: () => {
      console.log("❌ Notification WebSocket Closed");

      useNotificationStore.getState().setConnected(false);
    },
  });

  client.activate();
}

export function disconnectNotificationSocket() {
  client?.deactivate();
}