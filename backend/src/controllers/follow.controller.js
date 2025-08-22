class FollowController {
  constructor({followService}) {
    this.followService = followService;
  }

  fetchAllFollowers = async(req, res) => {
    console.log(req.user.email);
    if (!req.user.email || req.user.email === "") {
      return res.status(400).json({ error: "Email is required" });
    }
    const response = await this.followService.fetchAllFollowers(req.user.email);

    if (!response.success) {
      return res.status(400).json({ error: response.error });
    }
    res.json({followers: response.data});
  }
  
  fetchAllFollowing = async(req, res) => {
    if (!req.user.email || req.user.email === "") {
      return res.status(400).json({ error: "Email is required" });
    }
    const response = await this.followService.fetchAllFollowing(req.user.email);

    if (!response.success) {
      return res.status(400).json({ error: response.error });
    }
    res.json({followers: response.data});
  }
}

module.exports = FollowController;
