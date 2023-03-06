import RNFS from 'react-native-fs';

// list file names in dirPath - dirPath is absolute path
export const listFileNames = async (
  dirPath: string,
): Promise<string[]> => {
  return RNFS.readdir(dirPath);
};

export const createDir = async (dirPath: string) => {
  await RNFS.mkdir(dirPath);
};

export const isPathExists = async (
  dirPath: string,
): Promise<boolean> => {
  return RNFS.exists(dirPath);
};

export const createFile = async (path: string, content: string) => {
  if (await isPathExists(path)) {
    await deleteFile(path);
  }
  await RNFS.writeFile(path, content);
};

export const readFile = async (path: string) =>
  await RNFS.readFile(path);

export const deleteFile = async (path: string) =>
  await RNFS.unlink(path);
