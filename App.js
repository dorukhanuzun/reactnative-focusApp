import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Focus } from './src/features/focus/Focus';
import { colors } from './src/utils/colors';
import { Timer } from './src/features/Timer/Timer';
import { spacing } from './src/utils/sizes';
import { FocusHistory } from './src/features/focus/FocusHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUSES = {
  COMPLETE: 1,
  CANCELLED: 2
}

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistorySubject = (subject, status) => {
    setFocusHistory([...focusHistory, { subject, status }]);
  };

  const onClear = () => {
    setFocusHistory([]);
  };

  const saveFocusHistory = async () => {
    try {
      await AsyncStorage.setItem('focusHistory', JSON.stringify(focusHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHistory');
      if (history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadFocusHistory();
  }, []);

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);



  return (
    <View style={styles.container}>
      {focusSubject
        ? <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubject(focusSubject, STATUSES.COMPLETE);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            addFocusHistorySubject(focusSubject, STATUSES.CANCELLED);
            setFocusSubject(null);
          }}
        />
        :
        <View style={{ flex: 1 }}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
    backgroundColor: colors.darkBlue
  },
});
