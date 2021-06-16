import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import { fontSizes, spacing } from '../utils/sizes';

const minsToMilliseconds = (mins) => mins * 1000 * 60;
const formatTime = (time) => time < 10 ? `0${time}` : time;

export const Countdown = ({
    minutes = 1,
    isPaused,
    onProgress,
    onEnd
}) => {
    const interval = React.useRef(null);
    const [milliSeconds, setMilliSeconds] = useState(null);

    const minutesLeft = Math.floor(milliSeconds / 1000 / 60) % 60;
    const secondsLeft = Math.floor(milliSeconds / 1000) % 60;

    const countDown = () => {
        setMilliSeconds((time) => {
            if (time === 0) {
                clearInterval(interval.current);
                return time;
            }
            return time - 1000;
        });
    }

    useEffect(() => {
        setMilliSeconds(minsToMilliseconds(minutes));
    }, [minutes]);

    useEffect(() => {
        if (isPaused) {
            if (interval.current) clearInterval(interval.current);
            return;
        }
        interval.current = setInterval(countDown, 1000);
        onProgress(milliSeconds / minsToMilliseconds(minutes));
        if (milliSeconds === 0) {
            onEnd();
        }
        return () => clearInterval(interval.current);
    }, [isPaused, milliSeconds]);


    return (
        <Text style={styles.text}>{formatTime(minutesLeft)} : {formatTime(secondsLeft)}</Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: fontSizes.xxxl,
        fontWeight: 'bold',
        color: colors.white,
        padding: spacing.lg,
        backgroundColor: 'rgba(94,132,226,0.3)'
    }
});