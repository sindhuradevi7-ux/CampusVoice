import { analyzeComplaintContent } from '../services/aiService.js';
import { findSimilarClusters } from '../services/clusterService.js';
import { sanitizeIssueForPublic } from '../utils/privacySanitizer.js';

/**
 * @desc    Analyze a draft complaint in real-time (AI classification & summarization)
 * @route   POST /api/ai/analyze-complaint
 * @access  Private (Student)
 */
export const analyzeDraftComplaint = async (req, res, next) => {
  try {
    const { description, location, category, severity } = req.body;

    if (!description || description.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a brief description to analyze.',
      });
    }

    const aiResult = await analyzeComplaintContent({
      description,
      location: location || '',
      categoryInput: category || '',
      severityInput: severity || 'Medium',
    });

    res.status(200).json({
      success: true,
      analysis: aiResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check for duplicate or related existing issues in real-time
 * @route   POST /api/ai/check-related-issue
 * @access  Private (Student)
 */
export const checkRelatedIssues = async (req, res, next) => {
  try {
    const { description, location, category, keywords } = req.body;

    if (!description && !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide description or location.',
      });
    }

    const matches = await findSimilarClusters({
      category: category || '',
      location: location || '',
      description: description || '',
      keywords: keywords || [],
    });

    const formattedMatches = matches.map((m) => ({
      cluster: sanitizeIssueForPublic(m.cluster),
      confidence: m.confidence,
    }));

    res.status(200).json({
      success: true,
      count: formattedMatches.length,
      matches: formattedMatches,
    });
  } catch (error) {
    next(error);
  }
};
