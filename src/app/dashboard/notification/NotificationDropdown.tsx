'use client';

import { useEffect } from 'react';

import {
  CheckCheck,
  Clock3,
} from 'lucide-react';

import {
  getNotifications,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
} from "./notification.service";

import {
  useNotificationStore,
} from './notification.store';

interface Props {
  open: boolean;
}

export default function NotificationDropdown({
  open,
}: Props) {
  const {
    notifications,
    setNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    if (!open) return;

    async function loadNotifications() {
      try {
        const data = await getNotifications();

        setNotifications(data);
      } catch (e) {
        console.error(e);
      }
    }

    loadNotifications();
  }, [open, setNotifications]);

  async function handleRead(id: number) {
    try {
      await apiMarkAsRead(id);

      markAsRead(id);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleReadAll() {
    try {
      await apiMarkAllAsRead();

      markAllAsRead();
    } catch (e) {
      console.error(e);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed left-4 right-4 top-16 z-50 max-w-[380px] overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[380px]">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">

        <div>
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            Notifications
          </h3>

          <p className="text-xs text-gray-500">
            Latest activity
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleReadAll}
            className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
          >
            <CheckCheck size={16} />

            Mark all
          </button>
        )}
      </div>

      {/* List */}

      <div className="max-h-[50vh] sm:max-h-[450px] overflow-y-auto">

        {notifications.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No notifications yet.
          </div>
        )}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => {
              if (!notification.read) {
                handleRead(notification.id);
              }
            }}
            className={`cursor-pointer border-b border-gray-100 p-4 transition hover:bg-gray-50 ${!notification.read
              ? 'bg-orange-50'
              : 'bg-white'
              }`}
          >
            <div className="flex items-start justify-between">

              <div className="pr-3">

                <h4 className="font-semibold text-[var(--heading)]">
                  {notification.title}
                </h4>

                <p className="mt-1 text-sm text-gray-600">
                  {notification.message}
                </p>

                <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                  <Clock3 size={13} />

                  {new Date(
                    notification.createdAt,
                  ).toLocaleString()}
                </div>
              </div>

              {!notification.read && (
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--primary)]"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}