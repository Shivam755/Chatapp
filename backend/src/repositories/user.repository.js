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

  registerUser = async (user) => {
    try {
      const newUser = new this.User(user);

      const savedUser = await newUser.save();
      console.log("user created:" + savedUser.name);
    } catch (err) {
      console.log(""+err);
      return ""+err;
    }
    return "success";
  };
}

module.exports = { UserRepository };
