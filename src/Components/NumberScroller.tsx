import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { COLOR_SCHEME } from '../utils/Constants';
import { getNumberText } from '../utils/utils';

const data = new Array(1200)
  .fill((v) => {})
  .map((value, index) => ({ id: index, value: index % 60 }));

type dataObject = {
  id: number;
  value: number;
};

type NumberScrollerProps = {
  fontSize?: number;
  rowHeight?: number;
  data?: dataObject[];
  startValue: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

const NumberScroller: React.FC<NumberScrollerProps> = (props) => {
  const {
    fontSize = 35,
    rowHeight = 60,
    startValue = 0,
    setValue,
  } = props;

  let flistRef;
  const viewableItems = 3;

  const [setupComp, setSetup] = React.useState(false);
  const [val, setVal] = React.useState(startValue);
  const [mydata, setMyData] = React.useState(data);
  const [refershing, setRefreshing] = React.useState(false);
  const [scrollEnded, setScrollEnded] = React.useState<boolean>(
    false,
  );

  React.useEffect(() => {
    if (flistRef && !setupComp) {
      flistRef.scrollToIndex({
        animated: false,
        index: startValue + 599,
      });
      setSetup(true);
    }
  }, [flistRef]);

  const expandDataFromEnd = () => {
    if (refershing) {
      return;
    }
    setRefreshing(true);
    const newData = [...mydata, ...data].map((item, index) => ({
      id: index,
      value: index % 60,
    }));
    setMyData(newData);
    setRefreshing(false);
  };

  const handleScroll = (yOffset: number) => {
    const idx = Math.round(yOffset / rowHeight);
    const new_value = (idx + 1) % 60;
    setVal(new_value);
    setValue(new_value);

    flistRef.scrollToIndex({ animated: true, index: idx });
  };

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          height: rowHeight * viewableItems,
          width: '100%',
        }}
      >
        <FlatList
          ref={(ref) => {
            flistRef = ref;
          }}
          onEndReached={expandDataFromEnd}
          onEndReachedThreshold={0.1}
          refreshing={refershing}
          showsVerticalScrollIndicator={false}
          data={mydata}
          onMomentumScrollBegin={() => setScrollEnded(false)}
          onMomentumScrollEnd={(event) => {
            if (!scrollEnded) {
              handleScroll(event.nativeEvent.contentOffset.y);
              setScrollEnded(true);
            }
          }}
          getItemLayout={(data, index) => ({
            length: rowHeight,
            offset: rowHeight * index,
            index,
          })}
          renderItem={({ item, index, separators }) => (
            <View
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: rowHeight,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize,
                  color:
                    item.value === val
                      ? COLOR_SCHEME.orange
                      : COLOR_SCHEME.white,
                }}
              >{`${getNumberText(item.value)}`}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default NumberScroller;
