import React, {createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import axios, {AxiosInstance} from "axios";
import API_CONFIG from "@config/apiConfig";
import toTitleCase from "@utils/stringFormatter";
import logger from "@utils/logger";
import Toast from "@components/Toast";
import {SafeAreaView} from "react-native-safe-area-context";
import useAsyncStorage from "@utils/useAsyncStorage";
import {STORAGE_KEYS} from "@utils/asyncStorageKeys";

export type AppStateContextProps = {
    socialAppInstance: AxiosInstance;
    i2AuthInstance: AxiosInstance;
    isLoggedIn: boolean | null;
    isLoading: boolean;
    token: string | null;
    userRole: string | null;
    isDeviceTokenChanged: boolean | null;
    userId: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    getIsLoggedIn: () => boolean | null;
    showLoading: () => boolean;
    hideLoading: () => boolean;
    getIsLoading: () => boolean | null;
    showToast: (type: string, message: string) => void;
    hideToast: () => void;
    appIsReady: boolean;
    scrollDirection: ScrollDirection;
    setScrollDirection: (direction: ScrollDirection) => void;
};

export type AppStateProviderProps = {
    children: ReactNode;
}

export enum ScrollDirection {
    Up = 'up',
    Down = 'down',
    Idle = 'idle',
    Top = 'top',
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: FC<AppStateProviderProps> = ({children}) => {
    const [toastMessage, setToastMessage] = useState<{ type: string; message: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isDeviceTokenChanged, setIsDeviceTokenChanged] = useState<boolean | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [appIsReady, setAppIsReady] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(ScrollDirection.Idle);
    const {setItem, getItem, removeItem} = useAsyncStorage();


    const socialAppInstance = useMemo(() => axios.create({
        baseURL: API_CONFIG.SOCIAL_APP_BASE_URL,
        headers: {'Content-Type': 'application/json'},
    }), []);


    const i2AuthInstance = useMemo(() => axios.create({
        baseURL: API_CONFIG.I2_AUTH_BASE_URL,
    }), []);


    useEffect(() => {
        const reqInterceptorSocial = socialAppInstance.interceptors.request.use(
            (config) => {
                config.headers['token'] = `${token}`;

                showLoading();
                return config;
            },
            (error) => {
                hideLoading();
                showToast('error', toTitleCase(error.message));
                logger.log({
                    level: 'error',
                    message: 'Axios request failed',
                    file: 'AxiosContext.tsx',
                    method: 'socialAppInstance.interceptors.request.use',
                    data: error.message,
                });
                return Promise.reject(error);
            }
        );

        const resInterceptorSocial = socialAppInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                if (error.response && error.response.status === 401) {
                    showToast('error', 'Unauthorized access. Please login again.');
                    await logout();
                }

                return Promise.reject(error);
            }
        );

        const reqInterceptorAuth = i2AuthInstance.interceptors.request.use(
            (config) => {
                showLoading();
                return config;
            },
            (error) => {
                hideLoading();
                showToast('error', toTitleCase(error.message));
                logger.log({
                    level: 'error',
                    message: 'Axios request failed',
                    file: 'AxiosContext.tsx',
                    method: 'i2AuthInstance.interceptors.request.use',
                    data: error.message,
                });
                return Promise.reject(error);
            }
        );

        const resInterceptorAuth = i2AuthInstance.interceptors.response.use(
            (response) => {
                console.log('i2Auth response', response.data);
                if (response && response.data && response.data.data && response.data.data.state === false) {
                    showToast('error', toTitleCase(response.data.data.response));
                    hideLoading();
                }

                return response;
            },
            (error) => {
                hideLoading();
                showToast('error', toTitleCase(error.message));
                logger.log({
                    level: 'error',
                    message: 'Axios request failed',
                    file: 'AxiosContext.tsx',
                    method: 'i2AuthInstance.interceptors.response.use',
                    data: error.message,
                });

                return Promise.reject(error);
            }
        );

        return () => {
            socialAppInstance.interceptors.request.eject(reqInterceptorSocial);
            socialAppInstance.interceptors.response.eject(resInterceptorSocial);
            i2AuthInstance.interceptors.request.eject(reqInterceptorAuth);
            i2AuthInstance.interceptors.response.eject(resInterceptorAuth);
        }

    }, [socialAppInstance, i2AuthInstance]);


    const login = useCallback(async (email: string, password: string) => {
        try {
            const data = {
                email: email,
                password: password,
                project_code: API_CONFIG.PROJECT_CODE,
                device_token: "",
            }

            const response = await i2AuthInstance.post('userLogin', data);

            if (response && response.data && response.data.data && response.data.data.state) {
                console.log('response', response.data.data);

                const token = response && response.data && response.data.data && response.data.data.token;
                const userRole = response && response.data && response.data.data && response.data.data.type;
                const deviceToken = response && response.data && response.data.data && response.data.data.device_token;
                const userId = response && response.data && response.data.data && response.data.data.id;

                await Promise.all(
                    [
                        setItem(STORAGE_KEYS.TOKEN, token),
                        setItem(STORAGE_KEYS.USER_ROLE, userRole),
                        setItem(STORAGE_KEYS.IS_DEVICE_TOKEN, deviceToken ? 'true' : 'false'),
                        setItem(STORAGE_KEYS.USER_ID, userId),
                        setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
                    ]
                );

                showToast('success', 'Login successful');

                setIsLoggedIn(true);
                setToken(token);
                setUserRole(userRole);
                setIsDeviceTokenChanged(!!deviceToken);
                setUserId(userId);

                return true;
            }

            return false;

        } catch (error: any) {
            logger.log({
                level: 'error',
                message: 'Failed to login',
                file: 'useAuthHook.tsx',
                method: 'loginService',
                data: error.message,
            });

            return false;
        }

    }, [i2AuthInstance, setItem]);

    const logout = useCallback(async () => {
        try {
            await Promise.all([
                removeItem(STORAGE_KEYS.TOKEN),
                removeItem(STORAGE_KEYS.USER_ROLE),
                removeItem(STORAGE_KEYS.IS_DEVICE_TOKEN),
                removeItem(STORAGE_KEYS.USER_ID),
                removeItem(STORAGE_KEYS.IS_LOGGED_IN)
            ]);

            setIsLoggedIn(false);
            setToken(null);
            setUserRole(null);
            setIsDeviceTokenChanged(false);
            setUserId(null);

            showToast('success', 'Logout successful');

            return true;
        } catch (error: any) {
            logger.log({
                level: 'error',
                message: error.message || 'Failed to logout',
                file: "AuthContext.tsx",
                method: "logout",
                data: {error},
            });

            showToast('error', 'Failed to logout');
            return false;
        }
    }, [removeItem]);

    const showLoading = () => {
        setIsLoading(true);
        return true;
    };

    const hideLoading = () => {
        console.log('hideLoading');
        setIsLoading(false);
        return false;
    };

    const getIsLoading = () => {
        return isLoading;
    }

    const showToast = (type: string, message: string) => {
        setToastMessage({type, message});
    };

    const hideToast = () => {
        setToastMessage(null);
    };

    const getIsLoggedIn = () => {
        return isLoggedIn;
    }


    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                hideToast();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [toastMessage]);


    useEffect(() => {
        const checkLoggedIn = async () => {
            const [tokenStore, userRoleStore, isDeviceTokenStore, userIdStore, isLoggedInStore] = await Promise.all([
                getItem(STORAGE_KEYS.TOKEN),
                getItem(STORAGE_KEYS.USER_ROLE),
                getItem(STORAGE_KEYS.IS_DEVICE_TOKEN),
                getItem(STORAGE_KEYS.USER_ID),
                getItem(STORAGE_KEYS.IS_LOGGED_IN),
            ]);

            setIsLoggedIn(prevState => prevState !== !!isLoggedInStore ? !!isLoggedInStore : prevState);
            setToken(prevState => prevState !== tokenStore ? tokenStore : prevState);
            setUserRole(prevState => prevState !== userRoleStore ? userRoleStore : prevState);
            setIsDeviceTokenChanged(prevState => prevState !== !!isDeviceTokenStore ? !!isDeviceTokenStore : prevState);
            setUserId(prevState => prevState !== userIdStore ? userIdStore : prevState);
        };

        checkLoggedIn().catch(e => logger.log({
            level: 'error',
            message: e.message || 'Failed to check logged in status',
            file: "AuthContext.tsx",
            method: "useEffect",
            data: {error: e},
        }));

    }, []);


    useEffect(() => {
        if (isLoggedIn != null) {
            setAppIsReady(true);
        }
    }, [isLoggedIn]);

    const contextValue = useMemo(() => ({
        socialAppInstance,
        i2AuthInstance,
        isLoggedIn,
        isLoading,
        token,
        userRole,
        isDeviceTokenChanged,
        userId,
        login,
        appIsReady,
        logout,
        scrollDirection,
        setScrollDirection,
        getIsLoggedIn,
        showLoading,
        hideLoading,
        getIsLoading,
        showToast,
        hideToast,
    }), [socialAppInstance, i2AuthInstance, isLoggedIn, isLoading, token, userRole, isDeviceTokenChanged, userId, login, appIsReady, logout, scrollDirection]);


    return (
        <AppStateContext.Provider
            value={contextValue}>
            <SafeAreaView style={{flex: 1}}>
                {children}
            </SafeAreaView>
            {toastMessage && <Toast {...toastMessage} hideToast={hideToast}/>}
        </AppStateContext.Provider>
    );
}

export const useAppStateContext = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppStateContext must be used within a AppStateProvider');
    }
    return context;
};

