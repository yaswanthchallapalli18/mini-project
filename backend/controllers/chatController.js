const Message = require('../models/Message');

// Get Chat Messages for a Room (booking ID)
exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id; // From protect middleware

    // Fetch messages sorted by createdAt
    const messages = await Message.find({ roomId })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: 1 });

    // Mark messages sent by the OTHER party as read
    await Message.updateMany(
      { roomId, sender: { $ne: userId }, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload Chat File/Attachment
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    // Determine url (Cloudinary puts it in path/secure_url, disk storage puts filename or relative path)
    const fileUrl = req.file.path || `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'file';

    res.status(200).json({
      success: true,
      data: {
        fileUrl,
        fileName: req.file.originalname,
        fileType,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
