const bcrypt = require('bcrypt');

class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  getAllUsers = async () => {
    return await this.userRepository.getAllUsers();
  };

  registerUser = async (user) => {
    let userRow = {};
    userRow.name = user.name;
    userRow.email = user.email;
    userRow.role = user.role;

    const saltRounds = 10; // The higher, the more secure but slower
    userRow.passwordHash = await bcrypt.hash(user.password, saltRounds);

    const message = await this.userRepository.registerUser(userRow);
    return message;
  }
}

module.exports = { UserService };
