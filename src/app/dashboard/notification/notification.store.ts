import { create } from "zustand";

export interface Notification {
    id: number;
    senderId: number | null;
    senderName: string | null;
    rideId: number | null;
    bookingId: number | null;
    type:
    | "RIDE_REQUEST"
    | "BOOKING_APPROVED"
    | "BOOKING_REJECTED"
    | "RIDE_STARTED"
    | "RIDE_COMPLETED"
    | "RIDE_CANCELLED";
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

interface NotificationState {
    connected: boolean;

    notifications: Notification[];

    unreadCount: number;

    setConnected: (connected: boolean) => void;

    setNotifications: (notifications: Notification[]) => void;

    addNotification: (notification: Notification) => void;

    markAsRead: (id: number) => void;

    markAllAsRead: () => void;

    setUnreadCount: (count: number) => void;

    clear: () => void;
}

export const useNotificationStore =
    create<NotificationState>((set) => ({
        connected: false,

        notifications: [],

        unreadCount: 0,

        setConnected: (connected) =>
            set({ connected }),

        setNotifications: (notifications) =>
            set({
                notifications,
                unreadCount: notifications.filter((n) => !n.read).length,
            }),

        addNotification: (notification) =>
            set((state) => ({
                notifications: [notification, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            })),

        markAsRead: (id) =>
            set((state) => {
                let unreadCount = state.unreadCount;

                const notifications = state.notifications.map((n) => {
                    if (n.id === id && !n.read) {
                        unreadCount--;
                        return { ...n, read: true };
                    }

                    return n;
                });

                return {
                    notifications,
                    unreadCount: Math.max(0, unreadCount),
                };
            }),

        markAllAsRead: () =>
            set((state) => ({
                notifications: state.notifications.map((n) => ({
                    ...n,
                    read: true,
                })),
                unreadCount: 0,
            })),

        setUnreadCount: (count) =>
            set({ unreadCount: count }),

        clear: () =>
            set({
                connected: false,
                notifications: [],
                unreadCount: 0,
            }),
    }));