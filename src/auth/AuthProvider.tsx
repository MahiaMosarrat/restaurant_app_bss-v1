import { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import axios, { type AxiosResponse } from "axios";
import type { IRefreshTokenResponse, SingInResponse } from "../models/api-models";
import { AuthContext, getAuthInfo } from "../state-context/auth-context";
import { routes } from "../App";


type AuthProviderProps = {
    children: React.ReactNode;
};
let refreshTokenIntervalRunning = false;

export function refreshToken(navigate: NavigateFunction) {
    if (refreshTokenIntervalRunning) return;
    refreshTokenIntervalRunning = true;

    setInterval(async () => {
        const authInfo = getAuthInfo();
        if (!authInfo) {
            navigate(routes.signIn);
            return;
        }
        const currentTime = new Date(Date.now());
        const remainingTimeInSeconds = (authInfo.refreshTokenExpiryTime.getTime() - currentTime.getTime()) / 1000;

        if (remainingTimeInSeconds < 0) {
            navigate(routes.signIn);
            return;
        }

        const REFRESH_TIME_LIMIT_IN_SECONDS = 60;
        if (remainingTimeInSeconds < REFRESH_TIME_LIMIT_IN_SECONDS) {

            const response: AxiosResponse<IRefreshTokenResponse> = await axios.post(
                "https://bssrms.runasp.net/api/Auth/refreshToken",
                { refreshToken: authInfo.refreshToken }
            );
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("expTime", response.data.refreshTokenExpiryTime);
        }
    }, 1000 * 10);
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigate = useNavigate();
    refreshToken(navigate);

    const [token, setToken] = useState(getAuthInfo());
    const value = {
        auth: token,
        onLogin: async (email: string, pass: string) => {
            const response: AxiosResponse<SingInResponse> = await axios.post(
                'https://bssrms.runasp.net/api/Auth/signIn',
                { userName: email, password: pass },
            );

            const data = response.data;
            if (data) {
                const userInfo = {
                    name: data.user.userName || '[empty]',
                    email: email,
                };
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('expTime', data.refreshTokenExpiryTime);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            } else {
                throw new Error('Login failed');
            }

            setToken({
                token: data.token,
                refreshToken: data.refreshToken,
                refreshTokenExpiryTime: new Date(data.refreshTokenExpiryTime),
                userInfo: JSON.stringify({
                    name: data.user.userName || '[empty]',
                    email: email,
                })
            });
            navigate('/dashboard/employees');
        },
        onLogout: () => {
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('expTime');
            localStorage.removeItem('userInfo');
            navigate('/');
        },
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};