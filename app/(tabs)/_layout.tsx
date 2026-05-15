import { Tabs } from 'expo-router';
import { Bell, Heart, House, MagnifyingGlass, User } from 'phosphor-react-native';
import { View } from 'react-native';
import { COLORS } from '../../src/styles/colors';

// Color activo por tab usando los colores de la marca
const ACTIVE_COLORS = {
  search: COLORS.secondary,       // naranja
  favorites: COLORS.accent,       // rosa/fucsia
  notifications: COLORS.success,  // verde lima
  profile: COLORS.primary,        // azul
};

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
          shadowColor: COLORS.primary,  // 
          shadowOpacity: 0.12,
          shadowRadius: 16,
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
              size={28}
              color={focused ? ACTIVE_COLORS.search : '#9CA3AF'}
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
              size={28}
              color={focused ? ACTIVE_COLORS.favorites : '#9CA3AF'}
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
                // 👇 gradiente simulado con el naranja del logo
                backgroundColor: COLORS.secondary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 26,
                shadowColor: COLORS.secondary,
                shadowOpacity: 0.4,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 5 },
                elevation: 8,
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
              size={28}
              color={focused ? ACTIVE_COLORS.notifications : '#9CA3AF'}
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
              size={28}
              color={focused ? ACTIVE_COLORS.profile : '#9CA3AF'}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
    </Tabs>
  );
}