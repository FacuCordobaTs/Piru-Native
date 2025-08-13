import { Text, TextProps } from 'react-native';

export function T({ className, style, ...props }: TextProps & { className?: string }) {
  const combinedClassName = ['font-cinzel', className].filter(Boolean).join(' ');
  
  return (
    <Text 
      className={combinedClassName}
      style={style}
      {...props} 
    />
  );
}
