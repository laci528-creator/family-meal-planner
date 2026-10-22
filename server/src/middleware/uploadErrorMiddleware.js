import multer from "multer";

export function handleUploadError(
  error,
  req,
  res,
  next
) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: true,
        message:
          "Image is too large. Maximum file size is 5 MB.",
      });
    }

    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }

  if (
    error.message ===
    "Only JPG, PNG, and WebP images are allowed."
  ) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }

  next(error);
}