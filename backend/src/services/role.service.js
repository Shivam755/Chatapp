class RoleService {
  constructor({ roleRepository }) {
    this.roleRepository = roleRepository;
  }

  getAllRole = async () => {
    return await this.roleRepository.getAllRole();
  };

  addRole = async (roleName) => {
    return await this.roleRepository.addRole({
      name: roleName,
    });
  };
}

module.exports = { RoleService };
