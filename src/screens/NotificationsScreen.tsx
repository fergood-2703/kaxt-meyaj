import {
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  Bell,
  BellSimpleSlash,
  Briefcase,
  CaretRight,
  ChatCircle,
  ChatCircleText,
  CheckCircle,
  Phone,
  UserCircle,
  Warning,
  WhatsappLogo,
  X,
} from 'phosphor-react-native';
import { useState } from 'react';

import ScreenContainer from '../components/ScreenContainer';
import { useUser } from '../context/UserContext';
import { mockMessages } from '../data/notifications';
import { COLORS } from '../styles/colors';
import { MessageThread, Notification, NotificationType } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(timestamp: string): string {
  const diff  = Date.now() - new Date(timestamp).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'ahora';
  if (mins < 60)  return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function notificationIcon(type: NotificationType) {
  const size = 20;
  switch (type) {
    case 'empresa_interesada':
    case 'mensaje':
      return <ChatCircleText size={size} color={COLORS.primary} weight="fill" />;
    case 'postulacion_enviada':
      return <CheckCircle size={size} color={COLORS.success} weight="fill" />;
    case 'postulacion_revisando':
      return <Briefcase size={size} color={COLORS.secondary} weight="fill" />;
    case 'postulacion_aceptada':
      return <CheckCircle size={size} color={COLORS.success} weight="fill" />;
    case 'postulacion_rechazada':
      return <Warning size={size} color={COLORS.accent} weight="fill" />;
    case 'vacante_nueva':
    case 'vacante_guardada':
      return <Briefcase size={size} color={COLORS.primary} weight="fill" />;
    case 'cv_subido':
    case 'cv_faltante':
    case 'perfil_incompleto':
    case 'bienvenida':
      return <UserCircle size={size} color={COLORS.secondary} weight="fill" />;
    default:
      return <Bell size={size} color={COLORS.textSecondary} weight="fill" />;
  }
}

function notificationColor(type: NotificationType): string {
  switch (type) {
    case 'empresa_interesada':
    case 'mensaje':               return '#EFF6FF';
    case 'postulacion_enviada':
    case 'postulacion_aceptada':  return '#DCFCE7';
    case 'postulacion_revisando': return '#FEF3C7';
    case 'postulacion_rechazada': return '#FDE8F0';
    case 'vacante_nueva':
    case 'vacante_guardada':      return '#EFF6FF';
    case 'cv_subido':
    case 'bienvenida':            return '#DCFCE7';
    case 'cv_faltante':
    case 'perfil_incompleto':     return '#FEF3C7';
    default:                      return COLORS.background;
  }
}

type Tab = 'notificaciones' | 'mensajes';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  // Notificaciones vienen del contexto global (no más mock)
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useUser();

  const [activeTab, setActiveTab]             = useState<Tab>('notificaciones');
  const [messages]                            = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<MessageThread | null>(null);

  const unreadMessages = messages.filter((m) => !m.read).length;

  // ── Render notificación ───────────────────────────────────────────────────

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.read && styles.notifCardUnread]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.75}
    >
      <View style={[styles.notifIconBox, { backgroundColor: notificationColor(item.type) }]}>
        {notificationIcon(item.type)}
      </View>

      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.notifTime}>{timeAgo(item.timestamp)}</Text>
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>
          {item.body}
        </Text>
      </View>

      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  // ── Render mensaje ────────────────────────────────────────────────────────

  const renderMessage = ({ item }: { item: MessageThread }) => (
    <TouchableOpacity
      style={[styles.messageCard, !item.read && styles.notifCardUnread]}
      onPress={() => setSelectedMessage(item)}
      activeOpacity={0.75}
    >
      <View style={styles.companyAvatar}>
        <Text style={styles.companyAvatarText}>
          {item.companyName.charAt(0)}
        </Text>
      </View>

      <View style={styles.messageContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.messageCompany} numberOfLines={1}>
            {item.companyName}
          </Text>
          <Text style={styles.notifTime}>{timeAgo(item.timestamp)}</Text>
        </View>
        <Text style={styles.messageJob}>{item.jobTitle}</Text>
        <Text style={styles.messagePreview} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {!item.read && <View style={styles.unreadDot} />}
      <CaretRight size={16} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  // ── Empty states ──────────────────────────────────────────────────────────

  const EmptyNotifications = (
    <View style={styles.emptyState}>
      <BellSimpleSlash size={52} color={COLORS.border} weight="thin" />
      <Text style={styles.emptyTitle}>Sin notificaciones</Text>
      <Text style={styles.emptySubtitle}>
        Aquí aparecerá la actividad de tus postulaciones
      </Text>
    </View>
  );

  const EmptyMessages = (
    <View style={styles.emptyState}>
      <ChatCircle size={52} color={COLORS.border} weight="thin" />
      <Text style={styles.emptyTitle}>Sin mensajes</Text>
      <Text style={styles.emptySubtitle}>
        Cuando una empresa se interese en ti, aparecerá aquí
      </Text>
    </View>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {activeTab === 'notificaciones' ? 'Notificaciones' : 'Mensajes'}
          </Text>
          <Text style={styles.subtitle}>
            {activeTab === 'notificaciones'
              ? 'Actividad de tus postulaciones'
              : 'Empresas que te contactaron'}
          </Text>
        </View>

        {activeTab === 'notificaciones' && unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <CheckCircle size={16} color={COLORS.primary} weight="bold" />
            <Text style={styles.markAllText}>Leer todo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notificaciones' && styles.tabActive]}
          onPress={() => setActiveTab('notificaciones')}
        >
          <Bell
            size={16}
            color={activeTab === 'notificaciones' ? COLORS.white : COLORS.textSecondary}
            weight="bold"
          />
          <Text style={[styles.tabText, activeTab === 'notificaciones' && styles.tabTextActive]}>
            Actividad
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'mensajes' && styles.tabActive]}
          onPress={() => setActiveTab('mensajes')}
        >
          <ChatCircleText
            size={16}
            color={activeTab === 'mensajes' ? COLORS.white : COLORS.textSecondary}
            weight="bold"
          />
          <Text style={[styles.tabText, activeTab === 'mensajes' && styles.tabTextActive]}>
            Mensajes
          </Text>
          {unreadMessages > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Listas */}
      {activeTab === 'notificaciones' ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyNotifications}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: tabBarHeight + 20 }}
        />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyMessages}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: tabBarHeight + 20 }}
        />
      )}

      {/* Modal contacto */}
      <Modal
        visible={!!selectedMessage}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMessage(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedMessage(null)}
            >
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <View style={styles.modalAvatar}>
              <Text style={styles.modalAvatarText}>
                {selectedMessage?.companyName.charAt(0)}
              </Text>
            </View>

            <Text style={styles.modalCompany}>{selectedMessage?.companyName}</Text>
            <Text style={styles.modalJob}>
              Vacante: {selectedMessage?.jobTitle}
            </Text>

            <View style={styles.modalDivider} />

            {/* Fix: comillas rectas, sin tipográficas */}
            <Text style={styles.modalMessage}>
              {'"'}{selectedMessage?.lastMessage}{'"'}
            </Text>

            <Text style={styles.modalLabel}>Contactar a la empresa</Text>

            <View style={styles.modalActions}>
              {selectedMessage?.whatsapp && (
                <TouchableOpacity
                  style={[styles.contactButton, styles.whatsappButton]}
                  onPress={() => {
                    const msg = `Hola, soy candidato de Kaxt Meyaj. Me contactaron por la vacante de ${selectedMessage.jobTitle}.`;
                    Linking.openURL(
                      `https://wa.me/52${selectedMessage.whatsapp}?text=${encodeURIComponent(msg)}`
                    );
                  }}
                  activeOpacity={0.85}
                >
                  <WhatsappLogo size={20} color={COLORS.white} weight="fill" />
                  <Text style={styles.contactButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              )}

              {selectedMessage?.contactPhone && (
                <TouchableOpacity
                  style={[styles.contactButton, styles.callButton]}
                  onPress={() =>
                    Linking.openURL(`tel:${selectedMessage.contactPhone}`)
                  }
                  activeOpacity={0.85}
                >
                  <Phone size={20} color={COLORS.primary} weight="bold" />
                  <Text style={[styles.contactButtonText, { color: COLORS.primary }]}>
                    Llamar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  markAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  badge: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notifIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  notifTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  notifBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  companyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  messageContent: {
    flex: 1,
  },
  messageCompany: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  messageJob: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 1,
  },
  messagePreview: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 44,
  },
  modalClose: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 8,
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalAvatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalCompany: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  modalJob: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  modalMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  modalActions: {
    gap: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  callButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});