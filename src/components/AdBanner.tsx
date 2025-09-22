'use client';

interface AdBannerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  type?: 'banner' | 'card' | 'sidebar';
}

export default function AdBanner({ size = 'medium', className = '', type = 'banner' }: AdBannerProps) {
  const sizeClasses = {
    small: 'h-20',
    medium: 'h-32',
    large: 'h-48'
  };

  const typeClasses = {
    banner: 'w-full',
    card: 'w-full max-w-sm',
    sidebar: 'w-64'
  };

  return (
    <div className={`${sizeClasses[size]} ${typeClasses[type]} ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-500">
        <div className="text-sm font-medium mb-1">광고 영역</div>
        <div className="text-xs text-gray-400">
          {size === 'small' && '728 x 90'}
          {size === 'medium' && '728 x 180'}
          {size === 'large' && '728 x 280'}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {type === 'banner' && '배너형 광고'}
          {type === 'card' && '카드형 광고'}
          {type === 'sidebar' && '사이드바 광고'}
        </div>
      </div>
    </div>
  );
}