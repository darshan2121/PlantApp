import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';

export const AnimatedPressable: React.FC<PressableProps & { style?: ViewStyle | ViewStyle[] | ((state: { pressed: boolean }) => ViewStyle | ViewStyle[]) }> = ({ children, style, ...props }) => (
  <Pressable
    {...props}
    android_ripple={{ color: 'transparent' }}
    style={style}
  >
    {children}
  </Pressable>
); 