import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLOR_SCHEME } from '../../utils/Constants';
import { toClockView } from '../../utils/utils';

type ClockViewerProps = {
  seconds: number;
};

const ClockViewer: React.FC<ClockViewerProps> = ({ seconds }) => {
  return <Text style={styles.clockText}>{toClockView(seconds)}</Text>;
};

const styles = StyleSheet.create({
  clockText: {
    fontSize: 40,
    color: COLOR_SCHEME.white,
  },
});

export default ClockViewer;
