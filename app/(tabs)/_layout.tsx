import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, Tabs, useRootNavigationState, useRouter } from 'expo-router';
import { Bell, Heart, House, MagnifyingGlass, User } from 'phosphor-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../src/context/UserContext';
import { COLORS } from '../../src/styles/colors';

const ACTIVE_COLORS = {
  search:        COLORS.secondary,
  favorites:     COLORS.accent,
  notifications: COLORS.success,
  profile:       COLORS.primary,
};

// ─── Badge notificaciones ─────────────────────────────────────────────────────
function NotificationIcon({ focused }: { focused: boolean }) {
  const { unreadCount } = useUser();
  return (
    <View style={{ position: 'relative' }}>
      <Bell
        size={28}
        color={focused ? ACTIVE_COLORS.notifications : '#9CA3AF'}
        weight={focused ? 'fill' : 'regular'}
      />
      {unreadCount > 0 && (
        <View style={styles.dotWrapper}>
          <View style={styles.dot} />
        </View>
      )}
    </View>
  );
}

// ─── Botón Home ───────────────────────────────────────────────────────────────
// Activo   → degradado naranja→fucsia, sobresale con marginBottom, sombra rosa
// Inactivo → ícono gris igual que los demás tabs, sin elevación ni marginBottom
function HomeButton({ focused }: { focused: boolean }) {
  // Anima el marginBottom: sube cuando activo, vuelve al nivel de los demás cuando no
  const lift = useRef(new Animated.Value(focused ? 26 : 0)).current;

  useEffect(() => {
    Animated.spring(lift, {
      toValue: focused ? 26 : 0,
      useNativeDriver: false, // marginBottom no soporta native driver
      tension: 120,
      friction: 8,
    }).start();
  }, [focused]);

  if (!focused) {
    // Inactivo — exactamente igual que los demás íconos
    return (
      <House
        size={28}
        color="#9CA3AF"
        weight="regular"
      />
    );
  }

  // Activo — degradado elevado
  return (
    <Animated.View style={[styles.homeButtonWrapper, { marginBottom: lift }]}>
      <LinearGradient
        colors={['#FF7A1A', '#E91E8F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.homeButtonGradient}
      >
        <House size={32} color={COLORS.white} weight="fill" />
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabsLayout() {
  const { isLoggedIn, isGuest } = useUser();
  const router                  = useRouter();
  const navigationState         = useRootNavigationState();

  if (!navigationState?.key) return null;

  if (!isLoggedIn && !isGuest) {
    return <Redirect href="/login" />;
  }

  const handleProtectedPress = (href: string) => {
    if (!isLoggedIn) {
      router.push('/login?prompt=true');
    } else {
      router.push(href as any);
    }
  };

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
          <View style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 32 }} />
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
          shadowColor: COLORS.primary,
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          paddingTop: 10,
          paddingBottom: 10,
        },
      }}
    >
      {/* Búsqueda */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <MagnifyingGlass
              size={28}
              color={focused ? ACTIVE_COLORS.search : '#9CA3AF'}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />

      {/* Favoritos — requiere sesión */}
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <Heart
              size={28}
              color={focused ? ACTIVE_COLORS.favorites : '#9CA3AF'}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              onPress={() => handleProtectedPress('/favorites')}
              style={props.style}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />

      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <HomeButton focused={focused} />,
        }}
      />

      {/* Notificaciones — requiere sesión */}
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => <NotificationIcon focused={focused} />,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              onPress={() => handleProtectedPress('/notifications')}
              style={props.style}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />

      {/* Perfil — requiere sesión */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <User
              size={28}
              color={focused ? ACTIVE_COLORS.profile : '#9CA3AF'}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              onPress={() => handleProtectedPress('/profile')}
              style={props.style}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Botón Home activo
  homeButtonWrapper: {
    shadowColor: '#E91E8F',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  homeButtonGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Badge notificaciones
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  dotWrapper: {
    position: 'absolute',
    top: -1,
    right: -3,
  },
});