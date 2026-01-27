const { NODE_ENV } = require("../config/constants");
const isProd = NODE_ENV === "production";
const { accessTtlMin, refreshTtlDays } = require("./tokens");

const accessCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: accessTtlMin * 60 * 1000,
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/v1/auth/refresh",
    maxAge: refreshTtlDays * 24 * 60 * 60 * 1000,
};

function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("access_token", accessToken, accessCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);
}

function clearAuthCookies(res) {
    res.clearCookie("access_token", { path: accessCookieOptions.path });
    res.clearCookie("refresh_token", { path: refreshCookieOptions.path });
}

module.exports = { setAuthCookies, clearAuthCookies };
