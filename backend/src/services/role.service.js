class RoleService {
  constructor({ roleRepository }) {
    this.roleRepository = roleRepository;
  }

  getAllrole = async () => {
    return await this.roleRepository.getAllRole();
  };

  addrole = async (roleName) => {
    return await this.roleRepository.addRole({
      name: roleName,
    });
  };
}

module.exports = { RoleService };
