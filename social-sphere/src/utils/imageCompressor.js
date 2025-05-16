import imageCompression from "browser-image-compression";
/**
 * Compresses an image file before upload.
 *
 * @param {File} file - The original image file to compress.
 * @param {Object} customOptions - (Optional) Custom compression options.
 * @returns {Promise<File>} - The compressed image file.
 */
const compressImage = async (file, maxFileSize, customOptions = {}) => {
    const defaultOptions = {
        maxSizeMB: maxFileSize, // Max size in MB
        maxWidthOrHeight: 1280, // Resize if larger
        useWebWorker: true,
        initialQuality: 0.7,
        ...customOptions,
    };

    try {
        //console.log("🔍 Original file size:", (file.size / 1024 / 1024).toFixed(2), "MB");

        const compressedFile = await imageCompression(file, defaultOptions);

        //console.log("✅ Compressed file size:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");
        return compressedFile;
    } catch (error) {
        console.error("❌ Image compression failed:", error);
        return file; // fallback to original
    }
};

export default compressImage;
