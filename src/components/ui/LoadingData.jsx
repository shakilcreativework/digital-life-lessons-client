
import { FiLoader } from 'react-icons/fi';

export default function LoadingData({
  size = 32,
  color = 'text-primary',
  text = '',
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} {...props}>
      <FiLoader 
        className={`animate-spin ${color}`} 
        size={size} 
      />
      {text && (
        <p className="text-sm text-foreground font-medium">
          {text}
        </p>
      )}
    </div>
  );
}