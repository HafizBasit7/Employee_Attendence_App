import axios, { AxiosError } from "axios";
import * as ImageManipulator from "expo-image-manipulator";

const getMimeType = (uri) => {
  const extension = uri.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc":
      return "application/msword";
    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    case "avi":
      return "video/x-msvideo";
    case "wmv":
      return "video/x-ms-wmv";
    case "flv":
      return "video/x-flv";
    case "webm":
      return "video/webm";
    default:
      return "application/octet-stream";
  }
};

export const uploadImage = async (assetOrUri, fileName) => {
  try {
    // Handle both asset object and direct URI
    const sourceUri = typeof assetOrUri === 'string' ? assetOrUri : assetOrUri.uri;
    
    // Compress the image before uploading
    const compressedImage = await ImageManipulator.manipulateAsync(
      sourceUri,
      [{ resize: { width: 800 } }], // Resize to max width of 800px
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70% quality
    );

    // Ensure filename has proper extension
    const finalFileName = fileName || 'image.jpg';
    const fileNameWithExtension = finalFileName.includes('.') ? finalFileName : `${finalFileName}.jpg`;

    const formData = new FormData();
    
    // ✅ Fix: Use proper file object structure for React Native
    formData.append("file", {
      uri: compressedImage.uri,
      name: fileNameWithExtension,
      type: "image/jpeg",
    });

    const response = await axios.post(
      "https://srv694651.hstgr.cloud/storage/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "ayzenn09876@",
        },
        maxContentLength: 5 * 1024 * 1024, // 10MB max
        maxBodyLength: 7 * 1024 * 1024, // 10MB max
      }
    );

    const data = response.data;
    // console.log("Upload Response:", data); // Debugging

    // ✅ Fix: Return the correct field (fileUrl)
    if (data.fileUrl) {
      return data.fileUrl;
    } else {
      throw new Error(data.message || "Image upload failed.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    if (error.response?.status === 413) {
      throw new Error(
        "Image is too large. Please try uploading a smaller image."
      );
    }
    throw error;
  }
};

export const uploadFile = async (file, fileName) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name || fileName,
      type: file.type || getMimeType(file.uri),
    });

    const response = await axios.post(
      "https://srv694651.hstgr.cloud/storage/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "ayzenn09876@",
        },
        maxContentLength: 10 * 1024 * 1024, // 10MB
        maxBodyLength: 10 * 1024 * 1024,
      }
    );

    const data = response.data;
    if (data.fileUrl) {
      return data.fileUrl;
    } else {
      throw new Error(data.message || "File upload failed.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    if (error.response?.status === 413) {
      throw new Error("File is too large. Please upload a smaller file.");
    }
    throw error;
  }
};

export const uploadVideo = async (assetOrUri, fileName) => {
  try {
    // Handle both asset object and direct URI
    const sourceUri = typeof assetOrUri === 'string' ? assetOrUri : assetOrUri.uri;
    const fileInfo = typeof assetOrUri === 'object' ? assetOrUri : { uri: sourceUri };
    
    // Check file size (50MB limit)
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (fileInfo.fileSize && fileInfo.fileSize > maxSizeInBytes) {
      throw new Error("Video file is too large. Maximum size allowed is 50MB.");
    }

    // Get file extension from URI
    const fileExtension = sourceUri.split('.').pop()?.toLowerCase() || 'mp4';
    const mimeType = getMimeType(sourceUri);
    
    // Ensure filename has proper extension
    const finalFileName = fileName || `video_${Date.now()}.${fileExtension}`;
    const fileNameWithExtension = finalFileName.includes('.') ? finalFileName : `${finalFileName}.${fileExtension}`;

    const formData = new FormData();
    
    // Add video file to form data
    formData.append("file", {
      uri: sourceUri,
      name: fileNameWithExtension,
      type: mimeType,
    });

    console.log('Uploading video:', {
      fileName: fileNameWithExtension,
      mimeType,
      fileSize: fileInfo.fileSize ? `${(fileInfo.fileSize / 1024 / 1024).toFixed(2)}MB` : 'unknown'
    });

    const response = await axios.post(
      "https://srv694651.hstgr.cloud/storage/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "ayzenn09876@",
        },
        maxContentLength: 52 * 1024 * 1024, // 52MB to account for form data overhead
        maxBodyLength: 52 * 1024 * 1024, // 52MB
        timeout: 300000, // 5 minutes timeout for large video uploads
      }
    );

    const data = response.data;
    console.log("Video Upload Response:", data);

    if (data.fileUrl) {
      return data.fileUrl;
    } else {
      throw new Error(data.message || "Video upload failed.");
    }
  } catch (error) {
    console.error("Error uploading video:", error);
    if (error.response?.status === 413) {
      throw new Error(
        "Video file is too large. Maximum size allowed is 50MB."
      );
    }
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error(
        "Video upload timed out. Please check your internet connection and try again."
      );
    }
    throw error;
  }
};

export const uploadMedia = async (assetOrUri, fileName) => {
  try {
    // Handle both asset object and direct URI
    const sourceUri = typeof assetOrUri === 'string' ? assetOrUri : assetOrUri.uri;
    const fileInfo = typeof assetOrUri === 'object' ? assetOrUri : { uri: sourceUri };
    
    // Determine if it's an image or video based on file extension
    const fileExtension = sourceUri.split('.').pop()?.toLowerCase();
    const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'm4v', '3gp'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    
    if (videoExtensions.includes(fileExtension)) {
      return await uploadVideo(assetOrUri, fileName);
    } else if (imageExtensions.includes(fileExtension)) {
      return await uploadImage(assetOrUri, fileName);
    } else {
      // Default to image upload for unknown extensions
      return await uploadImage(assetOrUri, fileName);
    }
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};

