const crypto = require("crypto");

// Store a hash of refresh token so DB leak doesn't leak tokens
function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = { hashToken };
