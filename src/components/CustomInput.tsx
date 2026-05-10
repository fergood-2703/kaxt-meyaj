import {
    StyleSheet,
    TextInput,
    TextInputProps,
} from 'react-native';

export default function CustomInput(
    props: TextInputProps
) {
    return (
        <TextInput
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
});