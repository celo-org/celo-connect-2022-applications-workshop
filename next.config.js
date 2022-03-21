require("dotenv").config();

module.exports = {
  webpack5: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        child_process: false,
        readline: false,
      };
    }
    return config;
  },
  env: {
    AUCTION_CONTRACT_ADDRESS: process.env.AUCTION_CONTRACT_ADDRESS,
  },
  images: {
    domains: ["*"],
  },
};
