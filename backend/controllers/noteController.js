import Note from '../models/Note.js';

export const createNote = async (req, res) => {
  try {
    const { title, content, tags = [], priority = 'medium' } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.'
      });
    }

    // Check subscription limits
    if (req.tenant.subscription === 'free') {
      const noteCount = await Note.countDocuments({ tenantId: req.tenantId });
      
      if (noteCount >= req.tenant.settings.maxNotes) {
        return res.status(403).json({
          success: false,
          message: 'Note limit reached. Upgrade to Pro for unlimited notes.',
          upgradeRequired: true
        });
      }
    }

    // Create note
    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      tags: tags.map(tag => tag.trim().toLowerCase()),
      priority,
      tenantId: req.tenantId,
      createdBy: req.user._id
    });

    await note.save();
    await note.populate('createdBy', 'email');

    res.status(201).json({
      success: true,
      message: 'Note created successfully.',
      note
    });

  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating note.'
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', priority = '', archived = false } = req.query;
    
    // Build query with tenant isolation
    const query = { 
      tenantId: req.tenantId,
      isArchived: archived === 'true'
    };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Add priority filter
    if (priority) {
      query.priority = priority;
    }

    // Execute query with pagination
    const notes = await Note.find(query)
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Note.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      notes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalNotes: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      tenant: {
        subscription: req.tenant.subscription,
        maxNotes: req.tenant.settings.maxNotes,
        currentNotes: await Note.countDocuments({ tenantId: req.tenantId })
      }
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notes.'
    });
  }
};

export const getNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      _id: id,
      tenantId: req.tenantId
    }).populate('createdBy', 'email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.'
      });
    }

    res.json({
      success: true,
      note
    });

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching note.'
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, priority } = req.body;

    const note = await Note.findOne({
      _id: id,
      tenantId: req.tenantId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.'
      });
    }

    // Update fields
    if (title) note.title = title.trim();
    if (content) note.content = content.trim();
    if (tags) note.tags = tags.map(tag => tag.trim().toLowerCase());
    if (priority) note.priority = priority;

    await note.save();
    await note.populate('createdBy', 'email');

    res.json({
      success: true,
      message: 'Note updated successfully.',
      note
    });

  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating note.'
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      tenantId: req.tenantId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.'
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully.'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting note.'
    });
  }
};
