const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY, JWT_REFRESH_KEY, ACCESS_TOKEN_TTL_MIN, REFRESH_TOKEN_TTL_DAYS } = require('../config/constants');

const ISSUER = "devconnect";
const AUDIENCE = "devconnect-web";

const accessTtlMin = Number(ACCESS_TOKEN_TTL_MIN || 15);
const refreshTtlDays = Number(REFRESH_TOKEN_TTL_DAYS || 30);

function signAccessToken({ userId, sessionId }) {
    return jwt.sign(
        {
            sub: userId.toString(),
            sid: sessionId.toString(),
        },
        JWT_SECRET_KEY,
        {
            algorithm: "HS256",
            expiresIn: `${accessTtlMin}m`,
            issuer: ISSUER,
            audience: AUDIENCE,
        }
    )
}

function signRefreshToken({ userId, sessionId, jti }) {
    return jwt.sign(
        { sub: userId.toString(), sid: sessionId.toString(), jti },
        JWT_REFRESH_KEY,
        {
            algorithm: "HS256",
            expiresIn: `${refreshTtlDays}d`,
            issuer: ISSUER,
            audience: AUDIENCE,
        }
    )
}

function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET_KEY, { issuer: ISSUER, audience: AUDIENCE });
}

function verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_KEY, { issuer: ISSUER, audience: AUDIENCE });
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    accessTtlMin,
    refreshTtlDays,
};