class UserRepository {
  constructor({ User }) {
    this.User = User;
  }

  getAllUsers = async () => {
    try {
      const users = await this.User.find().lean();
      return users;
    } catch (err) {
      console.error("Error fetching users: ", err);
    }
  };
}

module.exports = { UserRepository };
