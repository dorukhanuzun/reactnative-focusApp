import React, { useState } from 'react';
import { Text, View, StyleSheet, Vibration, Platform } from 'react-native';
import { colors } from '../../utils/colors';
import { ProgressBar } from 'react-native-paper';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { spacing } from '../../utils/sizes';
import { Timing } from './Timing';
import { useKeepAwake } from 'expo-keep-awake';


export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
    useKeepAwake();
    const [minutes, setMinutes] = useState(0.2);
    const [isStarted, setIsStarted] = useState(false);
    const [progress, setProgress] = useState(1);

    const onProgress = (progress) => {
        setProgress(progress);
    };

    const changeTime = (min) => {
        setMinutes(min);
        setProgress(1);
        setIsStarted(false);
    };

    const vibrate = () => {
        if (Platform.OS === 'ios') {
            const interval = setInterval(() => Vibration.vibrate(), 1000);
            setTimeout(() => clearInterval(interval), 10000);
        } else {
            Vibration.vibrate(10000);
        }
    };

    const onEnd = () => {
        vibrate();
        setMinutes(0.2);
        setProgress(1);
        setIsStarted(false);
        setTimeout(() => onTimerEnd(), 10000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.countdown}>
                <Countdown minutes={minutes} isPaused={!isStarted} onProgress={onProgress} onEnd={onEnd} />
            </View>
            <View style={styles.buttonWrapper}>
                {isStarted
                    ? <RoundedButton title="Pause" onPress={() => { setIsStarted(false) }} />
                    : <RoundedButton title="Start" onPress={() => { setIsStarted(true) }} />
                }
            </View>
            <View style={styles.progressBarWrapper}>
                <ProgressBar
                    progress={progress}
                    color="#5E84E2"
                    style={{ height: 10 }}
                />
            </View>
            <Timing onChangeTime={changeTime} />
            <View>
                <Text style={styles.title}>Focusing on</Text>
                <Text style={styles.task}>{focusSubject}</Text>
            </View>
            <View style={styles.clearSubject}>
                <RoundedButton title="X" size={50} onPress={() => clearSubject()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    title: {
        color: colors.white,
        textAlign: 'center'
    },
    task: {
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    countdown: {
        alignItems: 'center'
    },
    buttonWrapper: {
        alignItems: 'center'
    },
    progressBarWrapper: {
        paddingHorizontal: spacing.lg
    },
    clearSubject: {
        paddingLeft: 15
    }
});