const jwt = require("jsonwebtoken");

class UserController {
  constructor({ userService, encryption, redisClient }) {
    this.userService = userService;
    this.encryption = encryption;
    this.redisClient = redisClient;
  }

  getAllUsers = async (req, res) => {
    return res.json(await this.userService.getAllUsers());
  };

  registerUser = async (req, res) => {
    // let user = req.body;
    console.log(req.body);
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Request Body not present or empty" });
    }

    let password = req.body.password || "";
    let confirmPassword = req.body.confirmPassword || "";

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "password and confirm Password are not matching!!" });
    }

    try {
      let response = await this.userService.registerUser(req.body);
      if (!response.success) {
        if (response.error.startsWith("Validation")) {
          console.log("Validation error");
          return res.status(400).json({ error: response.error });
        } else if (
          response.error.includes("E11000 duplicate key error collection")
        ) {
          console.log("Duplicate key error");
          return res
            .status(400)
            .json({ error: "User with this email already exists" });
        }
      }
    } catch (err) {
      console.error("Error during user registration:", err);
      return res.status(500).json({ error: err });
    }
    return res.json({ message: "User Created Successfully" });
  };

  loginUser = async (req, res) => {
    if (!req.body || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ error: "Request Body not present or empty" });
    }

    try {
      let response = await this.userService.loginUser(
        req.body.email,
        req.body.password
      );

      // hndling errors
      if (!response.success) {
        if (response.error.startsWith("Validation")) {
          return res
            .status(400)
            .json({ error: response.error.replace("Validation error: ", "") });
        } else {
          return res.status(401).json({ error: response.error });
        }
      }

      // If login is successful, generate JWT token
      const { key, iv } = await this.encryption.generateKey();
      const secret = this.encryption.generateJwtSecret();
      const token = jwt.sign(
        { email: response.data.email, role: response.data.role },
        secret,
        { expiresIn: "4h" }
      );
      const sessionId = this.encryption.generateSessionId();

      // Encrypt the token and sessionId
      const encryptedToken = await this.encryption.encrypt(key, iv, token);
      const encryptedSessionid = await this.encryption.encrypt(
        key,
        iv,
        sessionId
      );

      // creating object to store in redis
      const { keyB64, ivB64 } = await this.encryption.convertKeyIvToBase64(
        key,
        iv
      );
      console.log(`Key: ${keyB64}, IV: ${ivB64},s`);
      const redisObject = {
        Key: keyB64,
        IV: ivB64,
        Secret: secret,
      };

      //encrypting redis object
      const redisString = JSON.stringify(redisObject);
      const redisValue = await this.encryption.encryptWithMasterKey(
        redisString
      );

      // storing in redis
      await this.redisClient.set(sessionId, redisValue, {
        EX: 4 * 60 * 60 * 100,
      }); // 4 hours

      // setting cookies
      const secureCookieOption = {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 4 * 60 * 60 * 1000,
      };
      return res
        .cookie(
          "token",
          encryptedToken,
          secureCookieOption // 4 hours
        )
        .cookie("sessionId", encryptedSessionid, secureCookieOption)
        .json({ success: true });
    } catch (err) {
      console.error("Error during user login:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // decrypt = async(req, res) => {
  //   if (!req.body || !req.body.encryptedData) {
  //     return res.status(400).json({ error: "Request Body not present or empty" });
  //   }

  //   try {
  //     const decryptedData = await this.encryption.decryptWithMasterKey(req.body.encryptedData);
  //     return res.json({ decryptedData });
  //   } catch (err) {
  //     console.error("Error during decryption:", err);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }
}

module.exports = { UserController };
