class PermissionController {
  constructor({ permissionService }) {
    this.permissionService = permissionService;
  }

  getAllPermission = async (req, res) => {
    const permissions = await this.permissionService.getAllPermission();
    return res.status(200).json(permissions);
  };

  addPermission = async (req, res) => {
    if (!req.body.name || req.body.name === "") {
      return res.status(400).json({ error: "Empty request body" });
    }
    try {
      let response = await this.permissionService.addPermission(req.body.name);
      if (response.startsWith("Validation")){
        return res.status(400).json({error: response});
      }
    } catch (err) {
      return res.status(500).json({ error: "Some error occured" });
    }
    return res.status(201);
  };
}

module.exports = { PermissionController };
