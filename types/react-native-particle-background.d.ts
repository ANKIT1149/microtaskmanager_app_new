declare module 'react-native-particle-background' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';

  export interface ParticleProps {
    particleNumber?: number;
    particleRadius?: number;
    particleSpeed?: number;
    particleColor?: string;
    style?: ViewStyle;
  }

  const Particle: ComponentType<ParticleProps>;
  export default Particle;
}
