class RoleRepository {
  constructor({ Role }) {
    this.Role = Role;
  }

  getAllRole = async () => {
    try {
      const roles = await this.Role.find().lean();
      return roles;
    } catch (err) {
      console.error("Error fetching Roles: ", err);
    }
  };

  addRole = async (role) => {
    try {
      const newRole = new this.Role(role);
      const savedRole = await newRole.save();
      console.log("Role created: " + savedRole.name);
    } catch (err) {
      console.log("" + err);
      return "" + err;
    }
    return "success";
  };
}

module.exports = { RoleRepository };
