import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { Job } from '../types';
import CustomButton from './CustomButton';

type Props = {
    job: Job;
};

export default function JobCard({ job }: Props) {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/job/${job.id}`);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>

            {/* Badge urgente */}
            {job.urgent && (
                <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>🔥 Urgente</Text>
                </View>
            )}

            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company.name}</Text>

            <Text style={styles.info}>💰 {job.salary}</Text>
            <Text style={styles.info}>📍 {job.location}</Text>
            <Text style={styles.info}>
                🕐 {job.workType === 'tiempo-completo'
                    ? 'Tiempo completo'
                    : job.workType === 'medio-tiempo'
                        ? 'Medio tiempo'
                        : 'Por horas'}
            </Text>

            {job.requiresCv && (
                <Text style={styles.cvBadge}>📄 Requiere CV</Text>
            )}

            <View style={styles.buttonContainer}>
                <CustomButton title="Ver detalle" onPress={handlePress} small />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    urgentBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF3CD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10,
    },
    urgentText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B45309',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    company: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    info: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginTop: 10,
    },
    cvBadge: {
        marginTop: 10,
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 16,
    },
});