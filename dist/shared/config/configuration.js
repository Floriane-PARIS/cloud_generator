"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    mongodb_uri: process.env.MONGODB_URI,
    databse_name: process.env.DATA_BASE_NAME,
    collection_name: process.env.COLLECTION_NAME,
    google_application_credentials_content: process.env.GOOGLE_APPLICATION_CREDENTIALS_CONTENT,
    google_project_id: process.env.GOOGLE_PROJECT_ID,
    google_subscription_id: process.env.GOOGLE_SUBSCRIPTION_ID,
});
//# sourceMappingURL=configuration.js.map