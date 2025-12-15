import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CardScreen } from '../src/screens/CardScreen';
import { DrawScreen } from '../src/screens/DrawScreen';
import { HomeScreen } from '../src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Lavirant Cards' }}
        />
        <Stack.Screen
          name="Draw"
          component={DrawScreen}
          options={{ title: 'Draw Card' }}
        />
        <Stack.Screen
          name="Card"
          component={CardScreen}
          options={{ title: 'Card' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
