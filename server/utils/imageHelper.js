const fs = require('fs');
const path = require('path');

/**
 * Deletes an image file from the uploads directory if it exists
 * @param {string} imageUrl - The full URL of the image
 * @returns {boolean} - Whether the image was successfully deleted
 */
const deleteUploadedImage = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('uploads/')) {
    return false;
  }
  
  try {
    // Extract the filename from the URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Create the file path
    const filePath = path.join(__dirname, '../../public/uploads', filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      console.log(`Deleted image: ${filename}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Error deleting image:', err);
    return false;
  }
};

module.exports = {
  deleteUploadedImage
};