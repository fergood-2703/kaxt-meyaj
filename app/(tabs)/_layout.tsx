import { Redirect, Tabs, useRootNavigationState, useRouter } from 'expo-router';
import { Bell, Heart, House, MagnifyingGlass, User } from 'phosphor-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../src/context/UserContext';
import { COLORS } from '../../src/styles/colors';

const ACTIVE_COLORS = {
  search:        COLORS.secondary,
  favorites:     COLORS.accent,
  notifications: COLORS.success,
  profile:       COLORS.primary,
};

// ─── Badge de notificaciones ──────────────────────────────────────────────────
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

// ─── Layout principal ─────────────────────────────────────────────────────────
export default function TabsLayout() {
  const { isLoggedIn, isGuest } = useUser();
  const router                  = useRouter();
  const navigationState         = useRootNavigationState();

  // Esperar a que el navigator esté listo antes de evaluar redirects.
  // Sin este guard el primer render ve segments vacíos y redirige mal.
  if (!navigationState?.key) return null;

  // Si no hay sesión ni modo invitado → mandar al login
  if (!isLoggedIn && !isGuest) {
    return <Redirect href="/login" />;
  }

  // ── Protección de tabs para invitados ────────────────────────────────────
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
      {/* Búsqueda — accesible como invitado */}
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

      {/* Home — accesible como invitado */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => (
            <View style={styles.homeButton}>
              <House size={34} color={COLORS.white} weight="fill" />
            </View>
          ),
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
  homeButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
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