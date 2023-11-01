export default () => ({
  mongodb_uri: process.env.MONGODB_URI,
  database_name: process.env.DATABASE_NAME,
  collection_conversation: process.env.COLLECTION_CONVERSATION,
  collection_user: process.env.COLLECTION_USER,
  collection_story: process.env.COLLECTION_STORY,
  google_application_credentials_content: process.env.GOOGLE_APPLICATION_CREDENTIALS_CONTENT,
  google_project_id: process.env.GOOGLE_PROJECT_ID,
  google_subscription_id: process.env.GOOGLE_SUBSCRIPTION_ID,
});
