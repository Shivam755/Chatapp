class UserController {
  constructor({ userService }) {
    this.userService = userService;
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
      if (response.startsWith("Validation")) {
        console.log("Validation error");
        return res.status(400).json({ error: response });
      } else if (response.includes("E11000 duplicate key error collection")) {
        console.log("Duplicate key error");
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
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
      console.log("Response from loginUser:", response);
      if (response.startsWith("Validation")) {
        return res.status(400).json({ error: response.replace("Validation error: ", "") });
      }
      return res.json(response);
    } catch (err) {
      console.error("Error during user login:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

module.exports = { UserController };
