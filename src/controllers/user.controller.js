class UserController{
    constructor({userService}){
        this.userService = userService;
    }

    getAllUsers = async (req, res) => {
        return res.json(await this.userService.getAllUsers());
    }
}

module.exports = { UserController };