class FollowRepository {
  constructor({ Follow, User }) {
    this.Follow = Follow;
    this.User = User;
  }

  fetchAllFollowers = async (email) => {
    const user = await this.User.findOne({ email: email });
    if (!user) {
      console.log("User not found");
      return undefined;
    }
    const followers = await this.Follow.find({ followingId: user._id })
      .select("followerId")
      .populate("followerId", "name email");
    return followers.map((follow) => follow.followerId);
  };

  fetchAllFollowing = async (email) => {
    const user = await this.User.findOne({ email: email });
    if (!user) {
      console.log("User not found");
      return undefined;
    }
    const following = await this.Follow.find({ followerId: user._id })
      .select("followingId")
      .populate("followingId", "name email");
    return following.map((follow) => follow.followingId);
  };
}

module.exports = FollowRepository;
