import cloudinary from "../config/cloudinary.js";

export async function uploadRecipeImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No image file provided.",
      });
    }

    const uploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "family-meal-planner/recipes",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        uploadStream.end(req.file.buffer);
      }
    );

    return res.status(201).json({
      error: false,
      message: "Image uploaded successfully.",
      image: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return res.status(500).json({
      error: true,
      message: "Could not upload image.",
    });
  }
}