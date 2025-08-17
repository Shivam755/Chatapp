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

  getRoleIdByName = async (name) => {
    try {
      const role = await this.Role.find({ name }).lean();
      if (!role || role.length === 0) {
        console.log(`Role with name "${name}" not found.`);
        return null;
      }
      return role[0]._id; // Return the first role found
    } catch (err) {
      console.error("Error fetching Role ID by name: ", err);
      return null;
    }
  }

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

  addMultipleRolesIfNotExists = async (roles) => {
    try {
      const result = await this.Role.bulkWrite(
        roles.map((role) => ({
          updateOne: {
            filter: { name: role.name },
            update: { $set: role },
            upsert: true,
          },
        }))
      );
      console.log("Roles created: ", result);
    } catch (err) {
      console.error("Error creating permissions: ", err);
      return "" + err;
    }
    return "success";
  };
}

module.exports = { RoleRepository };
