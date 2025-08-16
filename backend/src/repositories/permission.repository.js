class PermissionRepository {
  constructor({ Permission }) {
    this.Permission = Permission;
  }

  getAllPermission = async () => {
    try {
      const permissions = await this.Permission.find().lean();
      return permissions;
    } catch (err) {
      console.error("Error fetching Permissions: ", err);
    }
  };

  addPermission = async (permission) => {
    try {
      const newPermission = new this.Permission(permission);
      const savedPermission = await newPermission.save();
      console.log("Permission created: " + savedPermission.name);
    } catch (err) {
      console.log(""+err);
      return ""+err;
    }
    return "success";
  };


}

module.exports = { PermissionRepository };
