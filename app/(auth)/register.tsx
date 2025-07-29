import React, { useState } from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { registerUser } from '@/services/RegisterUser';

type FormData = {
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await registerUser(data.email, data.password);
      router.push('/(tabs)');
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/microtasker_bg.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <LinearGradient
        colors={
          isDark ? ['#1a1f3a80', '#2a3a5a80'] : ['#f1f5f980', '#e2e8f080']
        }
        className="flex-1 justify-center items-center px-6"
      >
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="w-full max-w-md p-6 bg-white/10 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20"
        >
          <MotiText
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, type: 'timing', duration: 800 }}
            className="text-4xl mb-8 font-serif font-bold text-center text-cyan-400 drop-shadow-lg"
          >
            Join MicroTasker
          </MotiText>
          <MotiText
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 0.9, translateY: 0 }}
            transition={{ delay: 400, type: 'timing', duration: 700 }}
            className="text-center text-gray-200 dark:text-gray-400 mb-6 text-lg italic"
          >
            Unlock a futuristic workflow for your freelance tasks.
          </MotiText>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600, type: 'timing', duration: 700 }}
            className="space-y-4 flex flex-col gap-10"
          >
            <Controller
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  outlineColor={isDark ? '#4b5563' : '#d1d5db'}
                  activeOutlineColor="#00ffcc"
                  textColor={isDark ? '#ffffff' : '#000000'}
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  }}
                  className="rounded-xl"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  left={<TextInput.Icon icon="email" color="#00ffcc" />}
                />
              )}
              name="email"
            />
            {errors.email && (
              <HelperText type="error">{errors.email.message}</HelperText>
            )}

            <Controller
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  secureTextEntry
                  outlineColor={isDark ? '#4b5563' : '#d1d5db'}
                  activeOutlineColor="#00ffcc"
                  textColor={isDark ? '#ffffff' : '#000000'}
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  }}
                  className="rounded-xl"
                  left={<TextInput.Icon icon="lock" color="#00ffcc" />}
                />
              )}
              name="password"
            />
            {errors.password && (
              <HelperText type="error">{errors.password.message}</HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              buttonColor="#00ffcc"
              disabled={loading}
              textColor="#1a1f3a"
              labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
              style={{ borderRadius: 12, paddingVertical: 8 }}
              contentStyle={{ height: 55 }}
            >
              {loading ? 'Registering User' : '🚀 Register Now'}
            </Button>
          </MotiView>

          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 0.8, translateY: 0 }}
            transition={{ delay: 800, type: 'timing', duration: 700 }}
            className="text-center text-gray-400 mt-6 text-sm mb-8"
          >
            Already a member?{' '}
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-cyan-400 font-semibold">Log in</Text>
            </TouchableOpacity>
          </MotiText>
        </MotiView>
      </LinearGradient>
    </ImageBackground>
  );
}
