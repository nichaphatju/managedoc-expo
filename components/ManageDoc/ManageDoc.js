import * as React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import SearchAssignDoc from './AssignDoc/SearchAssignDoc/SearchAssignDoc';
import SearchAcceptDoc from './AcceptDoc/SearchAcceptDoc/SearchAcceptDoc';

function AssignDocScreen() {
  return (
    <SearchAssignDoc />
  );
}

function AcceptDocScreen() {
  return (
    <SearchAcceptDoc />
  );
}

const Tab = createBottomTabNavigator();

export default function ManageDoc() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'AssignDoc') {
              iconName = focused ? 'send' : 'send';
            } else if (route.name === 'AcceptDoc') {
              iconName = focused ? 'assignment' : 'assignment';
            }

            // You can return any component that you like here!
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="AssignDoc" component={AssignDocScreen} />
        <Tab.Screen name="AcceptDoc" component={AcceptDocScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}