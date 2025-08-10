class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  getAllUsers = async () => {
    return await this.userRepository.getAllUsers();
  };
}

module.exports = { UserService };
