import { api } from "@/lib/axios";
import { useUserStore } from "@/store/user.store";
import { Notification } from "./notification.store";

function getNotificationBaseUrl() {
  const role = useUserStore.getState().profile?.role;

  console.log("current role : "+role)
  return role === "ROLE_RIDER"
    ? "/v1/rider/notifications"
    : "/v1/passenger/notifications";
}

export async function getNotifications() {
  const response = await api.get<Notification[]>(
    getNotificationBaseUrl()
  );

  return response.data;
}

export async function getUnreadCount() {
  const response = await api.get<{
    unreadCount: number;
  }>(
    `${getNotificationBaseUrl()}/unread-count`
  );

  return response.data.unreadCount;
}

export async function markAsRead(notificationId: number) {
  await api.put(
    `${getNotificationBaseUrl()}/${notificationId}/read`
  );
}

export async function markAllAsRead() {
  await api.put(
    `${getNotificationBaseUrl()}/read-all`
  );
}