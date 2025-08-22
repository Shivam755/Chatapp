class PermissionRepository {
  constructor({ Permission }) {
    this.Permission = Permission;
  }

  getPermissionIdByName = async (name) => {
    try {
      const permission = await this.Permission.findOne({ name }).lean();
      if (!permission) {
        console.log(`Permission with name "${name}" not found.`);
        return null;
      }
      return permission._id;
    } catch (err) {
      console.error("Error fetching Permission ID by name: ", err);
      return null;
    }
  };
  getPermissionById = async (permissionId) => {
    try {
      const permission = await this.Permission.findById(permissionId).lean();
      if (!permission) {
        console.log(`Permission with ID "${permissionId}" not found.`);
        return null;
      }
      return permission;
    }catch (err) {
      console.error("Error fetching Permission ID by name: ", err);
      return null;
    }

  }

  getPermissionIdsByNames = async (names) => {
    try {
      const permissions = await this.Permission.find({ name: { $in: names } }).lean();
      if (!permissions || permissions.length === 0) {
        console.log(`Permissions with names "${names.join(", ")}" not found.`);
        return [];
      }
      return permissions.map((permission) => permission._id);
    } catch (err) {
      console.error("Error fetching Permission IDs by names: ", err);
      return [];
    }
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
      console.log("" + err);
      return "" + err;
    }
    return "success";
  };

  addMultiplePermissions = async (permissions) => {
    try {
      const result = await this.Permission.insertMany(permissions);
      console.log("Permissions created: ", result);
    } catch (err) {
      console.error("Error creating permissions: ", err);
      return "" + err;
    }
    return "success";
  };

  addPermissionIfNotExists = async (permission) => {
    try {
      const result = await this.Permission.updateOne(
        permission,
        { $setOnInsert: permission },
        { upsert: true }
      );
      console.log("Permissions created: ", result);
    } catch (err) {
      console.error("Error creating permissions: ", err);
      return "" + err;
    }
    return "success";
  };

  addMultiplePermissionsIfNotExists = async (permissions) => {
    try {
      const result = await this.Permission.bulkWrite(
        permissions.map((permission) => ({
          updateOne: {
            filter: permission,
            update: { $setOnInsert: permission },
            upsert: true,
          },
        }))
      );
      console.log("Permissions created: ", result);
    } catch (err) {
      console.error("Error creating permissions: ", err);
      return "" + err;
    }
    return "success";
  };

  deletePermission = async (permissionId) => {
    try {
      const result = await this.Permission.deleteOne({ _id: permissionId });
      if (result.deletedCount === 0) {
        console.log("No permission found with the given ID.");
      } else {
        console.log("Permission deleted successfully.");
      }
    } catch (err) {
      console.error("Error deleting permission: ", err);
      return "" + err;
    }
    return "success";
  };
}

module.exports = PermissionRepository;
