import React from 'react';
import { View, StyleSheet } from 'react-native';
import Particle from 'react-native-particle-background';

export default function ParticleBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Particle
        particleNumber={50}
        particleRadius={2}
        particleSpeed={0.5}
        particleColor="#00ffcc"
        style={styles.particle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  particle: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});