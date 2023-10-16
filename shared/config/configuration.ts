export default () => ({
  mongodb_uri: process.env.MONGODB_URI,
  databse_name: process.env.DATA_BASE_NAME,
  collection_name: process.env.COLLECTION_NAME,
});
