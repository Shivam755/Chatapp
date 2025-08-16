class PermissionService {
  constructor({ permissionRepository }) {
    this.permissionRepository = permissionRepository;
  }

  getAllPermission = async () => {
    return await this.permissionRepository.getAllPermission();
  };

  addPermission = async (permissionName) => {
    return await this.permissionRepository.addPermission({"name": permissionName});
  };
}

module.exports = { PermissionService };
