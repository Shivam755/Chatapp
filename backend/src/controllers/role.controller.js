class RoleController {
  constructor({ roleService }) {
    this.roleService = roleService;
  }

  getAllRole = async (req, res) => {
    const roles = await this.roleService.getAllRole();
    return res.status(200).json(roles);
  };

  addRole = async (req, res) => {
    if (!req.body.name || req.body.name === "") {
      return res.status(400).json({ error: "Empty request body" });
    }
    try {
      let response = await this.roleService.addRole(req.body);
      if (response.startsWith("Validation")) {
        return res.status(400).json({ error: response });
      }
    } catch (err) {
      return res.status(500).json({ error: "Some error occured" });
    }
    return res.status(201);
  };
}

module.exports = { RoleController };
