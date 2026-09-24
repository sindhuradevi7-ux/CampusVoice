import IssueCluster from '../models/IssueCluster.js';
import { generateIssueId } from '../utils/idGenerator.js';

// Text normalizer helper
const normalize = (str = '') => {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(laboratory|lab)\b/g, 'lab')
    .replace(/\b(wifi|wi-fi|internet|network)\b/g, 'wifi')
    .replace(/\b(washroom|restroom|toilet|bathroom)\b/g, 'washroom')
    .replace(/\b(canteen|mess|cafeteria)\b/g, 'canteen')
    .replace(/\b(first|1st)\b/g, '1')
    .replace(/\b(second|2nd)\b/g, '2')
    .replace(/\b(third|3rd)\b/g, '3')
    .replace(/\b(fourth|4th)\b/g, '4')
    .trim();
};

const getTokens = (str = '') => {
  const stopWords = new Set([
    'the', 'and', 'a', 'an', 'in', 'on', 'is', 'it', 'to', 'for', 'of', 'with', 'at', 'by',
    'from', 'this', 'that', 'our', 'we', 'are', 'was', 'very', 'not', 'have', 'has', 'there',
    'been', 'problem', 'issue', 'not', 'working'
  ]);
  return normalize(str)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
};

// Calculate token overlap score (0 to 1)
const calculateSimilarity = (tokensA, tokensB) => {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  return (2 * intersection) / (setA.size + setB.size);
};

/**
 * Find active clusters matching the criteria
 */
export const findSimilarClusters = async ({ category, location, description, keywords = [] }) => {
  // Look only at active clusters (not Closed)
  const candidates = await IssueCluster.find({
    status: { $nin: ['Closed'] },
  }).lean();

  const newLocNorm = normalize(location);
  const newDescTokens = getTokens(description);
  const newKeywords = keywords.map((k) => normalize(k));

  const matches = [];

  for (const cluster of candidates) {
    let score = 0;

    // 1. Category exact match gives strong base
    if (cluster.category === category) {
      score += 0.3;
    }

    // 2. Location comparison
    const clusterLocNorm = normalize(cluster.location);
    if (newLocNorm && clusterLocNorm) {
      if (newLocNorm === clusterLocNorm || newLocNorm.includes(clusterLocNorm) || clusterLocNorm.includes(newLocNorm)) {
        score += 0.45;
      } else {
        const locSim = calculateSimilarity(getTokens(newLocNorm), getTokens(clusterLocNorm));
        score += locSim * 0.4;
      }
    }

    // 3. Description & Summary text overlap
    const clusterTokens = getTokens(`${cluster.title} ${cluster.summary}`);
    const textSim = calculateSimilarity(newDescTokens, clusterTokens);
    score += textSim * 0.35;

    // 4. Keyword overlap
    if (cluster.keywords && cluster.keywords.length > 0 && newKeywords.length > 0) {
      const kwSim = calculateSimilarity(newKeywords, cluster.keywords.map((k) => normalize(k)));
      score += kwSim * 0.2;
    }

    if (score >= 0.52) {
      matches.push({
        cluster,
        confidence: Math.min(Math.round(score * 100), 99),
      });
    }
  }

  // Sort highest confidence first
  matches.sort((a, b) => b.confidence - a.confidence);
  return matches;
};

/**
 * Associate complaint with existing cluster or create a new cluster
 */
export const processComplaintClustering = async ({
  category,
  location,
  description,
  severity,
  aiAnalysis,
  preferredClusterId = null,
}) => {
  // If student explicitly linked to or selected an existing cluster
  if (preferredClusterId) {
    const existingCluster = await IssueCluster.findById(preferredClusterId);
    if (existingCluster) {
      existingCluster.affectedCount += 1;
      // Upgrade severity if this complaint is higher
      const severityOrder = { Low: 1, Medium: 2, High: 3, Critical: 4 };
      if (severityOrder[severity] > severityOrder[existingCluster.severity]) {
        existingCluster.severity = severity;
      }
      await existingCluster.save();
      return existingCluster;
    }
  }

  // Run automated similarity detection
  const matches = await findSimilarClusters({
    category,
    location,
    description,
    keywords: aiAnalysis?.keywords || [],
  });

  if (matches.length > 0 && matches[0].confidence >= 65) {
    const matchedCluster = await IssueCluster.findById(matches[0].cluster._id);
    if (matchedCluster) {
      matchedCluster.affectedCount += 1;
      // Upgrade severity if necessary
      const severityOrder = { Low: 1, Medium: 2, High: 3, Critical: 4 };
      if (severityOrder[severity] > severityOrder[matchedCluster.severity]) {
        matchedCluster.severity = severity;
      }
      // Merge keywords
      if (aiAnalysis?.keywords?.length) {
        const merged = Array.from(new Set([...matchedCluster.keywords, ...aiAnalysis.keywords]));
        matchedCluster.keywords = merged.slice(0, 10);
      }
      await matchedCluster.save();
      return matchedCluster;
    }
  }

  // Create a brand new issue cluster
  const title = aiAnalysis?.summary
    ? `${category}: ${aiAnalysis.summary.slice(0, 60)}`
    : `${category} issue at ${location}`;

  const summary = aiAnalysis?.summary || description.slice(0, 180);

  const newCluster = await IssueCluster.create({
    publicIssueId: generateIssueId(),
    title,
    summary,
    category,
    location,
    severity: severity || aiAnalysis?.severity || 'Medium',
    affectedCount: 1,
    status: 'Submitted',
    assignedDepartment: aiAnalysis?.possibleDepartment || 'Campus Facilities',
    keywords: aiAnalysis?.keywords || [],
    statusHistory: [
      {
        status: 'Submitted',
        note: 'Issue cluster created from initial student report.',
        updatedAt: new Date(),
      },
    ],
  });

  return newCluster;
};
