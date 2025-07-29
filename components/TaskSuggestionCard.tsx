import React, { useState } from 'react';
import { MotiView, MotiText } from 'moti';
import { Card, Button } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TaskSuggestionCard({ task, onAdd, animationDelay }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isPressed, setIsPressed] = useState(false);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: isPressed ? 0.98 : 1 }}
      transition={{ type: 'spring', damping: 15, delay: animationDelay }}
      style={{
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: isDark ? 'rgba(40, 40, 60, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 204, 0.2)',
        shadowColor: '#00ccff',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Card
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={{ backgroundColor: 'transparent', borderRadius: 12 }}
      >
        <Card.Content>
          <MotiText
            style={{
              fontSize: 14,
              color: '#00ccff',
              marginBottom: 8,
            }}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300, delay: animationDelay + 50 }}
          >
            {task}
          </MotiText>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            buttonColor="#00ccff"
            textColor="#1a1f3a"
            onPress={onAdd}
            rippleColor="rgba(0, 204, 255, 0.2)"
          >
            Add Task
          </Button>
        </Card.Actions>
      </Card>
    </MotiView>
  );
}