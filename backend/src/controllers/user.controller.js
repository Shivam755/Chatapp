class UserController{
    constructor({userService}){
        this.userService = userService;
    }

    getAllUsers = async (req, res) => {
        return res.json(await this.userService.getAllUsers());
    }

    registerUser = async (req, res) => {
        // let user = req.body;
        console.log(req.body);
        if (!req.body){
            return res.status(400).json({"error": "Request Body not present or empty"});
        }

        let password = req.body.password || "";
        let confirmPassword = req.body.confirmPassword || "";

        if (password !== confirmPassword){
            return res.status(400).json({"error": "password and confirm Password are not matching!!"});
        }

        try {
            let response = await this.userService.registerUser(req.body);
            if (response.startsWith("Validation")){
                console.log("Validation error");
                return res.status(400).json({"error": response});
            }
        }
        catch(err){
            return res.status(500).json({"error": err});
        }
        return res.json({"message":"User Created Successfully"});
    }
}

module.exports = { UserController };