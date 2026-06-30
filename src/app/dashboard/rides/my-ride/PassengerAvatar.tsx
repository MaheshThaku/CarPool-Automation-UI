'use client';

import { memo, useMemo, useState } from 'react';

interface Props {
  name: string;
  photoUrl?: string | null;
  size?: number;
}

function PassengerAvatarComponent({ name, photoUrl, size = 48 }: Props) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = useMemo(() => {
    if (!photoUrl) return null;

    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }

    return `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${photoUrl}`;
  }, [photoUrl]);

  const initial = name?.charAt(0)?.toUpperCase() || 'U';
  console.log(imageUrl);
  return (
    <div
      className="relative overflow-hidden rounded-full border border-[var(--border)]"
      style={{
        width: size,
        height: size,
      }}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--primary)] font-semibold text-white">
          {initial}
        </div>
      )}
    </div>
  );
}

const PassengerAvatar = memo(PassengerAvatarComponent);

export default PassengerAvatar;
