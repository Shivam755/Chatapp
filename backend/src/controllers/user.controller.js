const jwt = require("jsonwebtoken");
const { Token, sessionId } = require("../utilities/constants");

class UserController {
  constructor({ userService, encryption, redisClient }) {
    this.userService = userService;
    this.encryption = encryption;
    this.redisClient = redisClient;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
      const genSessionId = this.encryption.generateSessionId();

      // Encrypt the token and genSessionId
      const encryptedToken = await this.encryption.encrypt(key, iv, token);
      const encryptedSessionid = await this.encryption.encryptWithMasterKey(
        genSessionId
      );
      const encryptedLoginId = await this.encryption.encrypt(
        key,
        iv,
        response.data._id
      );

      // creating object to store in redis
      const { keyB64, ivB64 } = await this.encryption.convertKeyIvToBase64(
        key,
        iv
      );
      const redisObject = {
        key: keyB64,
        iv: ivB64,
        secret: secret,
      };

      //encrypting redis object
      const redisString = JSON.stringify(redisObject);
      const redisValue = await this.encryption.encryptWithMasterKey(
        redisString
      );

      // storing in redis
      await this.redisClient.set(genSessionId, redisValue, {
        EX: 4 * 60 * 60,
      }); // 4 hours

      // setting cookies
      const secureCookieOption = {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 4 * 60 * 60 * 1000,
        path: "/",
      };
      // await this.sleep(5000); // Simulating some delay
      return res
        .cookie(
          Token,
          encryptedToken,
          secureCookieOption // 4 hours
        )
        .cookie(sessionId, encryptedSessionid, secureCookieOption)
        .json({ success: true, loginid: encryptedLoginId });
    } catch (err) {
      console.error("Error during user login:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  logout = async (req, res) => {
    let sessionId = req.sessionId;
    try {
      console.log("deleting redis entry");
      // deleting the redis entry
      const delRes = await this.redisClient.del(sessionId);
      if (delRes != 1) {
        return res
          .status(500)
          .json({
            error: "There was some issue in logout. Please try again later!",
          });
      }
      console.log("Redis entry deleted successfully!");
      // clearing cookies
      res.clearCookie(Token);
      console.log("Token cleared");
      res.clearCookie(sessionId);
      console.log("sessionId cleared");
      return res.status(200).json({ "response": "Logout successful!"});
    } catch (err) {
      console.log("Error during user registration: " + err);
      req.status(500).json({ error: err });
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

module.exports = UserController;
