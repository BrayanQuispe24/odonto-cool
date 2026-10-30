import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';

export interface UserAvatarProps {
  src?: string | null;
  name?: string;
  email?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  indicator?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 text-base',
};

const iconSizes = {
  xs: 12,
  sm: 15,
  md: 17,
  lg: 22,
  xl: 30,
};

export const getFullAvatarUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${cleanPath}`;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  email,
  size = 'md',
  indicator = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const fullUrl = getFullAvatarUrl(src);

  const getInitials = (): string => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      return email.trim().slice(0, 2).toUpperCase();
    }
    return '';
  };

  const initials = getInitials();
  const showImage = Boolean(fullUrl) && !imageError;

  return (
    <div className={`relative shrink-0 inline-flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-sm border border-slate-200 dark:border-slate-700/80
          overflow-hidden flex items-center justify-center font-bold tracking-wider select-none
          bg-[#0077D4] text-white
        `}
      >
        {showImage ? (
          <img
            src={fullUrl!}
            alt={name || email || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-sm"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <UserIcon size={iconSizes[size]} className="text-white/90" />
        )}
      </div>

      {indicator && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00C2E0] border-2 border-white dark:border-[#0840A8] rounded-full"
          title="Activo"
        />
      )}
    </div>
  );
};
