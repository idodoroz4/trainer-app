import { Platform, PermissionsAndroid } from 'react-native';

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
