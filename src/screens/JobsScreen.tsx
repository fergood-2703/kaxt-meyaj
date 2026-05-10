import {
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';

import JobCard from '../components/JobCard';
import ScreenContainer from '../components/ScreenContainer';

import { jobs } from '../data/jobs';

export default function JobsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>
        Vacantes disponibles
      </Text>

      <Text style={styles.subtitle}>
        Encuentra oportunidades cerca de ti
      </Text>

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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 10,
  },

  list: {
    paddingTop: 24,
    paddingBottom: 40,
  },
});