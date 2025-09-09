// Import API paths and configured Axios instance
import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

/**
 * uploadImage
 * Uploads a user profile image to the backend server.
 *
 * @param {File} imageFile - The image file to be uploaded.
 * @returns {Object} - The response data from the server after upload.
 * @throws - Throws an error if the upload fails.
 */
const uploadImage = async (imageFile) => {
  // Create a new FormData object to send file in multipart/form-data format
  const formData = new FormData();
  formData.append("image", imageFile); // "image" is the key backend expects

  try {
    // Send POST request to the backend API
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      }
    );
    return response.data; // Return response data (e.g., image URL)
  } catch (err) {
    console.error("خطایی هنگام آپلود عکس پروفایل رخ داد.", err);
    throw err; // Re-throw error to handle it in calling function
  }
};

export default uploadImage;
