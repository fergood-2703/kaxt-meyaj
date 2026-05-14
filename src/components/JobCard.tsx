import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import CustomButton from './CustomButton';

type Props = {
    title: string;
    company: string;
    salary: string;
    location: string;
};

import { COLORS } from '../styles/colors';

export default function JobCard({
    title,
    company,
    salary,
    location,
}: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                {title}
            </Text>

            <Text style={styles.company}>
                {company}
            </Text>

            <Text style={styles.info}>
                💰 {salary}
            </Text>

            <Text style={styles.info}>
                📍 {location}
            </Text>

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Aplicar"
                    small
                />
            </View>
        </View>
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
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 2,
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

    buttonContainer: {
        marginTop: 16,
    },


});