const bcrypt = require('bcrypt');

class UserService {
  constructor({ userRepository, roleRepository }) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  getAllUsers = async () => {
    return await this.userRepository.getAllUsers();
  };

  loginUser = async (email, password) => {
    let response = { success: false, error: "", data: {}}
    if (!email || !password) {
      response.error = "Validation error: Email and password are required";
      return response;
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      response.error = "Validation error: User not found";
      return response;
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      response.error = "Invalid password"
      return response;
    }
    response.success = true;
    response.data = user;
    return response;
  };

  registerUser = async (user) => {
    let response = { success: false, error: "", data: {}}
    let userRow = {};
    userRow.name = user.name;
    userRow.email = user.email;
    userRow.role = await this.roleRepository.getRoleIdByName("user"); // Default role for new users

    const saltRounds = 10; // The higher, the more secure but slower
    userRow.passwordHash = await bcrypt.hash(user.password, saltRounds);

    const message = await this.userRepository.registerUser(userRow);
    if (message !== "success"){
      response.error = message;
    }
    else{
      response.success = true;
    }
    return response;
  }
}

module.exports = { UserService };
