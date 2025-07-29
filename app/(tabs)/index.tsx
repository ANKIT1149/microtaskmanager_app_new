import React, { useEffect } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView, MotiText, MotiImage } from 'moti';
import '../../globals.css';
import { CheckUser } from '@/services/CheckUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");

      if (userId) {
        router.push('/client');
      }
    };

    checkUserId();
  }, []);
  return (
    <LinearGradient
      colors={['#0a0e1a', '#1a1f3a', '#2a3a5a']}
      className="flex-1"
    >
      <View className="flex-1 justify-between items-center px-6 py-12">
        {/* Futuristic Logo and Title */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 200, type: 'spring', damping: 10 }}
          className="items-center"
        >
          <MotiText
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300, type: 'timing', duration: 1000 }}
            className="text-5xl font-extrabold font-serif mt-20 text-neon-blue tracking-widest text-shadow"
            style={{
              textShadowColor: 'rgba(6, 182, 212, 0.7)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 15,
            }}
          >
            MicroTasker
          </MotiText>
          <MotiText
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 500, type: 'timing', duration: 800 }}
            className="text-sm text-neon-cyan font-semibold tracking-wide"
            style={{
              textShadowColor: 'rgba(34, 211, 238, 0.5)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            Empower Your Freelance Universe
          </MotiText>
        </MotiView>

        {/* Animated Description */}
        <MotiText
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 0.9, translateY: 0 }}
          transition={{ delay: 700, type: 'spring', stiffness: 100 }}
          className="text-neon-white text-center text-base leading-6 font-medium px-4 mt-2"
          style={{
            textShadowColor: 'rgba(255, 255, 255, 0.3)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 5,
          }}
        >
          Transform epic projects into micro-triumphs. Monitor time, craft
          invoices, and manage clients—all from your digital hub.
        </MotiText>

        {/* Dynamic Logo Animation */}
        <MotiImage
          from={{ opacity: 0, scale: 0.9, rotate: '-10deg' }}
          animate={{ opacity: 1, scale: 1, rotate: '10deg' }}
          transition={{
            delay: 900,
            type: 'timing',
            duration: 1200,
            loop: true,
            repeatReverse: true,
          }}
          source={require('../../assets/images/microtasker_logo.jpg')}
          className="w-72 h-72 rounded-3xl"
          resizeMode="contain"
        />

        {/* Interactive CTA Section */}
        <MotiView
          from={{ opacity: 0, translateY: 60 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1100, type: 'spring', damping: 15 }}
          className="items-center space-y-6 mb-12 w-full"
        >
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="rounded-full overflow-hidden shadow-neon"
          >
            <LinearGradient
              colors={['#00ffcc', '#00ccff', '#cc00ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-10 py-5 rounded-full"
            >
              <MotiText
                from={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                  loop: true,
                  repeatReverse: true,
                }}
                className="text-white font-bold text-lg tracking-wider text-center font-serif italic"
              >
                🌌 Join the Future
              </MotiText>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <MotiText
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 0.8, translateY: 0 }}
              transition={{ delay: 1300, type: 'timing', duration: 700 }}
              className="text-neon-purple underline font-medium mt-8"
              style={{
                textShadowColor: 'rgba(147, 51, 234, 0.4)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 5,
              }}
            >
              Already a Pioneer? Log In
            </MotiText>
          </TouchableOpacity>
        </MotiView>
      </View>
    </LinearGradient>
  );
}
