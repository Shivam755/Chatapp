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

  getUserByEmail = async (email) => {
    try {
      const user = await this.User.find({
        $or: [
          { email: email },
          { name: email } // Allow searching by name as well
        ]
      }).lean();
      if (!user || user.length === 0) {
        console.log(`User with email or username "${email}" not found.`);
        return null;
      }
      return user[0]; // Return the first user found
    } catch (err) {
      console.error("Error fetching user by email: ", err);
      return null;
    }
  }

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
