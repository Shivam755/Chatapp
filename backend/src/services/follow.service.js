const {CustomResponse} = require("../models/response");

class FollowService {
  constructor({followRepository}) {
    this.followRepository = followRepository;
  }

  fetchAllFollowers= async (email) => {
    const response = new CustomResponse();
    if (!email || email === "") {
      response.error = "Email is required";
      return response;
    }
    response.data = await this.followRepository.fetchAllFollowers(email);

    if (!response.data) {
      response.error = "User does not exist";
    }
    response.success = true;

    return response;
  }
  fetchAllFollowing= async (email) => {
    const response = new CustomResponse();
    if (!email || email === "") {
      response.error = "Email is required";
      return response;
    }
    response.data = await this.followRepository.fetchAllFollowing(email);

    if (!response.data) {
      response.error = "User does not exist";
    }
    response.success = true;
    return response;
  }
}

module.exports = FollowService;
