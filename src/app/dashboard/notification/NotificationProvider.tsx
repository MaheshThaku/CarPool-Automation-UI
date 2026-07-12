'use client';

import { useEffect } from 'react';

import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from './notification.socket';

import {
  getNotifications,
  getUnreadCount,
} from './notification.service';

import { useNotificationStore } from './notification.store';

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  const setUnreadCount = useNotificationStore(
    (state) => state.setUnreadCount,
  );

  useEffect(() => {
    async function initializeNotifications() {
      try {
        const [notifications, unreadCount] =
          await Promise.all([
            getNotifications(),
            getUnreadCount(),
          ]);

        setNotifications(notifications);

        setUnreadCount(unreadCount);
      } catch (error) {
        console.error(
          'Failed to load notifications',
          error,
        );
      }

      connectNotificationSocket();
    }

    initializeNotifications();

    return () => {
      disconnectNotificationSocket();
    };
  }, [setNotifications, setUnreadCount]);

  return <>{children}</>;
}