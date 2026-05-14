import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import JobCard from '../components/JobCard';
import ScreenContainer from '../components/ScreenContainer';

import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';



export default function JobsScreen() {
  return (
    <ScreenContainer>

      <View style={styles.container}>
        <Text style={styles.title}>
          Vacantes disponibles
        </Text>

        <Text style={styles.subtitle}>
          Encuentra oportunidades cerca
          de ti
        </Text>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <JobCard
            title={item.title}
            company={item.company}
            salary={item.salary}
            location={item.location}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 10,
    lineHeight: 28,
  },

  list: {
    paddingTop: 24,
    paddingBottom: 40,
  },
});