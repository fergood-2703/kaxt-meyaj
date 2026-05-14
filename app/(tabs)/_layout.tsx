import { Tabs } from 'expo-router';
import { Bell, Heart, House, MagnifyingGlass, User } from 'phosphor-react-native';
import { View } from 'react-native';
import { COLORS } from '../../src/styles/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 12,
        },

        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              borderRadius: 32,
            }}
          />
        ),

        tabBarStyle: {
          position: 'absolute',
          overflow: 'visible',
          height: 82,
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 32,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          paddingTop: 10,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ focused }) => (
            <MagnifyingGlass
              size={30}
              color={focused ? COLORS.primary : '#9CA3AF'}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <Heart
              size={30}
              color={focused ? COLORS.primary : '#9CA3AF'}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: () => (
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
                backgroundColor: COLORS.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 26,
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 5 },
                elevation: 6,
              }}
            >
              <House size={34} color={COLORS.white} weight="fill" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ focused }) => (
            <Bell
              size={30}
              color={focused ? COLORS.primary : '#9CA3AF'}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <User
              size={30}
              color={focused ? COLORS.primary : '#9CA3AF'}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
    </Tabs>
  );
}