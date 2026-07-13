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
import { useUserStore } from '@/store/user.store';

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const profile = useUserStore(
    (state) => state.profile
  );

  const hydrated = useUserStore(
    (state) => state.hydrated
  );

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );

  const setUnreadCount = useNotificationStore(
    (state) => state.setUnreadCount
  );

  useEffect(() => {

    // Wait until Zustand has loaded
    if (!hydrated || !profile) {
      return;
    }

    async function initializeNotifications() {
      try {
        const [notifications, unreadCount] =
          await Promise.all([
            getNotifications(),
            getUnreadCount(),
          ]);

        setNotifications(notifications);
        setUnreadCount(unreadCount);

        connectNotificationSocket();
      } catch (error) {
        console.error(error);
      }
    }

    initializeNotifications();

    return () => {
      disconnectNotificationSocket();
    };

  }, [
    hydrated,
    profile,
    setNotifications,
    setUnreadCount,
  ]);

  return <>{children}</>;
}