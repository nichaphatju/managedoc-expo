import * as React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import SearchAssignDoc from './AssignDoc/SearchAssignDoc/SearchAssignDoc';
import SearchAcceptDoc from './AcceptDoc/SearchAcceptDoc/SearchAcceptDoc';
import SearchStatusDoc from './StatusDoc/SearchStatusDoc';

// function HomeScreen() {
//   return (
//     <HomeScreen />
//   );
// }

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

function StatusDocScreen() {
  return (
    <SearchStatusDoc />
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
            } else if (route.name === 'StatusDoc') {
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
        {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
        <Tab.Screen name="AssignDoc" component={AssignDocScreen} />
        <Tab.Screen name="AcceptDoc" component={AcceptDocScreen} />
        <Tab.Screen name="StatusDoc" component={StatusDocScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}