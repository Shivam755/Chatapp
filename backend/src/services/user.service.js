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
    if (!email || !password) {
      return "Validation error: Email and password are required";
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return "Validation error: User not found";
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return "Validation error: Invalid password";
    }
    return "success";
  };

  registerUser = async (user) => {
    let userRow = {};
    userRow.name = user.name;
    userRow.email = user.email;
    userRow.role = await this.roleRepository.getRoleIdByName("user"); // Default role for new users

    const saltRounds = 10; // The higher, the more secure but slower
    userRow.passwordHash = await bcrypt.hash(user.password, saltRounds);

    const message = await this.userRepository.registerUser(userRow);
    return message;
  }
}

module.exports = { UserService };
