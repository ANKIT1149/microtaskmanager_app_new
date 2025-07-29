import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const AuthLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="register" options={{ headerShown: false }} />
      <Tabs.Screen name="login" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default AuthLayout;
