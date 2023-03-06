import { Platform, PermissionsAndroid } from 'react-native';

import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const checkPrem = (prem: string) =>
  check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable. requesting permission...',
          );
          request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
            console.log(
              `result from asking for: ${PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE}: ${result}`,
            );
          });
          break;
        case RESULTS.LIMITED:
          console.log(
            'The permission is limited: some actions are possible',
          );
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log(
            'The permission is denied and not requestable anymore',
          );
          break;
      }
    })
    .catch((error) => {
      // …
    });

export const checkReadExternalStoragePrem = () =>
  checkPrem(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

export const checkWriteExternalStoragePrem = checkPrem(
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
);

export const askForPremissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const isExternalStoragePrem = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!isExternalStoragePrem) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('storage permission denied');
          return;
        }
      }
    } catch (err) {
      console.warn(err);
      return;
    }

    try {
      const isRecordAudioPrem = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (!isRecordAudioPrem) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the recording device now');
        } else {
          console.log('recording device permission denied');
          return;
        }
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  }
};
