const { Token, sessionId } = require("../utilities/constants");
const jwt = require("jsonwebtoken");

class authMiddleware {
  constructor({ encryption, redisClient, roleRepository }) {
    this.encryption = encryption;
    this.redisClient = redisClient;
    this.roleRepository = roleRepository;
  }

  verifyToken = async (req, res, next) => {
    try {
      console.log("Verifying Auth...");
      const encryptedSessId = req.cookies[sessionId];
      const encryptedToken = req.cookies[Token];
      if (!encryptedSessId || !encryptedToken) {
        return res.status(401).json({ error: "Unauthorized access" });
      }
      console.log("Decrypting sessionId");
      const decryptedSessId = await this.encryption.decryptWithMasterKey(
        encryptedSessId
      );

      if (!decryptedSessId) {
        return res.status(401).json({ error: "Unauthorized access" });
      }
      console.log("fetching details from redis");
      // fetching keys from redis based on sessionId
      const encryptedData = await this.redisClient.get(decryptedSessId);
      if (!encryptedData) {
        return res.status(401).json({ error: "Unauthorized access" });
      }
      console.log("Encrypted Data:", encryptedData);
      const decryptedData = await this.encryption.decryptWithMasterKey(
        encryptedData
      );
      const JsonObject = JSON.parse(decryptedData);
      console.log("Decrypting Token");
      const { key, iv} = await this.encryption.convertKeyIvFromBase64(
        JsonObject.key,
        JsonObject.iv);

      // decrypting the token
      const decryptedToken = await this.encryption.decrypt(
        key,
        iv,
        encryptedToken
      );
      // Verify the JWT token
      console.log("verifying JWT token");
      const decoded = jwt.verify(decryptedToken, JsonObject.secret);
      req.user = decoded;
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ error: "Unauthorized access" });
    }

    next();
  };

  requireRole = (role) => {
    return async (req, res, next) => {
      console.log("Checking user role...");
      if (!req.user || !req.user.role) {
        return res.status(403).json({ error: "Forbidden: Insufficient role" });
      }
      console.log("Fetching user role from repository...");
      const userRole = await this.roleRepository.getRoleById(req.user.role);
      if (!userRole || !role.includes(userRole.name)) {
        console.log("Insufficient role:", userRole ? userRole.name : "undefined");
        return res.status(403).json({ error: "Forbidden: Insufficient role" });
      }
      next();
    };
  };
}

module.exports = authMiddleware;
