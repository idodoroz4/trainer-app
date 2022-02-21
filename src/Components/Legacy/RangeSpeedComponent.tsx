import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLOR_SCHEME } from '../../utils/Constants';
import Card from '../Layout/Card';
import { ScrollContext } from '../Wrapper';
import { TextInput } from 'react-native';
import RangeSlider from 'rn-range-slider';

const { width } = Dimensions.get('screen');

type RangeSpeedComponentProps = {
  title: string;
  minValue: number; // Fastest value
  maxValue: number; // Slowest value
  currSlowSpeed?: number; // closer to max
  currFastSpeed: number; // closer to min - use also for single value mode
  onFastSpeedChange: (fastValue: number) => void;
  onSlowSpeedChange?: (slowValue: number) => void;
  rangeEnabled?: boolean;
};

enum RangeTypes {
  SLOW = 'SLOW',
  FAST = 'FAST',
}

const RangeSpeedComponent: React.FC<RangeSpeedComponentProps> = (
  props,
) => {
  const {
    title,
    currSlowSpeed,
    currFastSpeed,
    minValue,
    maxValue,
    onFastSpeedChange,
    onSlowSpeedChange,
    rangeEnabled = true,
  } = props;

  const [fastSpeed, setFastSpeed] = React.useState<number>(
    currFastSpeed,
  );
  const [slowSpeed, setSlowSpeed] = React.useState<
    number | undefined
  >(currSlowSpeed);

  const sliderRef = React.useRef(null);

  const setEnableScroll = React.useContext(ScrollContext);

  const NonRangeChange = (fastSpeed: number) => {
    onFastSpeedChange(fastSpeed);
    setFastSpeed(fastSpeed);
  };
  const rangeChanged = (low: number, high: number) => {
    if (low !== currFastSpeed) {
      onFastSpeedChange(low);
      setFastSpeed(low);
      return;
    }

    if (onSlowSpeedChange) {
      onSlowSpeedChange(high);
      setSlowSpeed(high);
    }
  };

  const validateValue = (rt: RangeTypes) => {
    if (rt === RangeTypes.FAST) {
      if (fastSpeed < minValue || !fastSpeed) {
        setFastSpeed(minValue);
        sliderRef?.current.setLowValue(minValue);
        return;
      }
      if (!slowSpeed && fastSpeed > maxValue) {
        setFastSpeed(maxValue);
        sliderRef?.current.setLowValue(maxValue);
        return;
      }
      if (slowSpeed && fastSpeed > slowSpeed) {
        setFastSpeed(slowSpeed);
        sliderRef?.current.setLowValue(slowSpeed);
        return;
      }

      setFastSpeed(fastSpeed);
      sliderRef?.current.setLowValue(fastSpeed);
      return;
    }

    if (rt === RangeTypes.SLOW) {
      if (!slowSpeed || (slowSpeed && slowSpeed < fastSpeed)) {
        setSlowSpeed(fastSpeed);
        sliderRef?.current.setHighValue(fastSpeed);
        return;
      }

      if (slowSpeed && slowSpeed > maxValue) {
        setSlowSpeed(maxValue);
        sliderRef?.current.setHighValue(maxValue);
        return;
      }

      setSlowSpeed(slowSpeed);
      sliderRef?.current.setHighValue(slowSpeed);
    }
  };

  return (
    <Card title={title} customHeight={180}>
      <View style={styles.labels}>
        <View style={rangeEnabled ? styles.labelLeft : styles.label}>
          <TextInput
            style={styles.labelStyle}
            onChangeText={(v) => setFastSpeed(parseInt(v))}
            onBlur={() => validateValue(RangeTypes.FAST)}
            onFocus={() => setFastSpeed(NaN)}
            value={
              fastSpeed ? `${fastSpeed}` : fastSpeed === 0 ? '0' : ''
            }
            keyboardType="numeric"
          />
        </View>
        {rangeEnabled && (
          <View style={styles.delimiterView}>
            <Text style={styles.delimiterText}>-</Text>
          </View>
        )}
        {rangeEnabled && (
          <View style={styles.labelRight}>
            <TextInput
              style={styles.labelStyle}
              onChangeText={(v) => setSlowSpeed(parseInt(v))}
              onBlur={() => validateValue(RangeTypes.SLOW)}
              onFocus={() => setSlowSpeed(NaN)}
              value={
                slowSpeed
                  ? `${slowSpeed}`
                  : slowSpeed === 0
                  ? '0'
                  : ''
              }
              keyboardType="numeric"
            />
          </View>
        )}
      </View>
      <View style={styles.mainView}>
        <RangeSlider
          style={{ width: '80%', height: '100%' }}
          ref={sliderRef}
          rangeEnabled={rangeEnabled}
          valueType="number"
          gravity="center"
          thumbRadius={15}
          labelStyle="none"
          labelBackgroundColor={COLOR_SCHEME.darkOrange}
          labelTextColor={COLOR_SCHEME.white}
          labelBorderColor={COLOR_SCHEME.darkOrange}
          labelFontSize={20}
          min={minValue}
          max={maxValue}
          initialLowValue={fastSpeed || minValue}
          initialHighValue={slowSpeed || maxValue}
          step={50}
          lineWidth={15}
          selectionColor={COLOR_SCHEME.orange}
          blankColor={COLOR_SCHEME.darkOrange}
          thumbColor={COLOR_SCHEME.white}
          onTouchStart={() =>
            setEnableScroll ? setEnableScroll(false) : null
          }
          onTouchEnd={() =>
            setEnableScroll ? setEnableScroll(true) : null
          }
          onValueChanged={(low: number, high: number) => {
            rangeEnabled
              ? rangeChanged(low, high)
              : NonRangeChange(low);
          }}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: width,
    backgroundColor: COLOR_SCHEME.black,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
  },
  label: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
  },
  labelRight: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '40%',
  },
  labelLeft: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '40%',
  },
  labelStyle: {
    flexDirection: 'row',
    marginBottom: 10,
    color: 'white',
    fontSize: 30,
  },
  delimiterText: {
    flexDirection: 'row',
    marginBottom: 10,
    color: 'white',
    fontSize: 30,
    paddingHorizontal: 20,
  },
  delimiterView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RangeSpeedComponent;
