import {useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '@utils/logger';

type UseAsyncStorageHook = {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
    clearAll: () => Promise<void>;
};

const useAsyncStorage = (): UseAsyncStorageHook => {
    const setItem = useCallback(async (key: string, value: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e: any) {
            logger.log({
                level: 'error',
                message: e.message || 'Failed to set item in AsyncStorage',
                file: 'useAsyncStorage.ts',
                method: 'setItem',
                data: {key, value, error: e},
            });
        }
    }, []);

    const getItem = useCallback(async (key: string): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (e: any) {
            logger.log({
                level: 'error',
                message: e.message || 'Failed to get item from AsyncStorage',
                file: 'useAsyncStorage.ts',
                method: 'getItem',
                data: {key, error: e},
            });
            return null;
        }
    }, []);

    const removeItem = useCallback(async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e: any) {
            logger.log({
                level: 'error',
                message: e.message || 'Failed to remove item from AsyncStorage',
                file: 'useAsyncStorage.ts',
                method: 'removeItem',
                data: {key, error: e},
            });
        }
    }, []);

    const clearAll = useCallback(async (): Promise<void> => {
        try {
            await AsyncStorage.clear();
        } catch (e: any) {
            logger.log({
                level: 'error',
                message: e.message || 'Failed to clear AsyncStorage',
                file: 'useAsyncStorage.ts',
                method: 'clearAll',
                data: {error: e},
            });
        }
    }, []);

    return {setItem, getItem, removeItem, clearAll};
};

export default useAsyncStorage;
