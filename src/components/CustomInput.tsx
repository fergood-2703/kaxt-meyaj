import {
    StyleSheet,
    TextInput,
    TextInputProps,
} from 'react-native';

import { COLORS } from '../styles/colors';


export default function CustomInput(
    props: TextInputProps
) {
    return (
        <TextInput
            placeholderTextColor={COLORS.textSecondary}
            style={styles.input}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
});