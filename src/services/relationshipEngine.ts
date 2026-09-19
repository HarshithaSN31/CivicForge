import { Issue, CivicIncident, RelationshipSignals, RelatedIncidentCandidate } from '../types';

/**
 * Calculates Haversine distance in meters between two lat/lng coordinates.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Evaluates geographic proximity score based on meters.
 */
function getDistanceScore(distanceMeters: number): number {
  if (distanceMeters <= 50) return 1.0;
  if (distanceMeters <= 200) return 0.95;
  if (distanceMeters <= 500) return 0.85;
  if (distanceMeters <= 1000) return 0.6;
  if (distanceMeters <= 2000) return 0.35;
  if (distanceMeters <= 4000) return 0.15;
  return 0.0;
}

/**
 * Evaluates category matching score.
 */
function getCategoryScore(cat1: string, cat2: string): number {
  if (cat1 === cat2) return 1.0;
  
  // Related categories
  const relatedPairs = [
    ['Road Infrastructure', 'Public Safety'],
    ['Water & Sewerage', 'Sanitation & Waste'],
    ['Electricity & Lighting', 'Public Safety'],
    ['Parks & Environment', 'Sanitation & Waste'],
  ];

  for (const [a, b] of relatedPairs) {
    if ((cat1 === a && cat2 === b) || (cat1 === b && cat2 === a)) {
      return 0.5;
    }
  }

  return 0.1;
}

/**
 * Evaluates temporal proximity score based on creation timestamps.
 */
function getTemporalScore(date1Str: string, date2Str: string): { score: number; hoursDiff: number } {
  const d1 = new Date(date1Str).getTime();
  const d2 = new Date(date2Str).getTime();
  const diffMs = Math.abs(d1 - d2);
  const hoursDiff = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;

  if (hoursDiff <= 4) return { score: 1.0, hoursDiff };
  if (hoursDiff <= 12) return { score: 0.9, hoursDiff };
  if (hoursDiff <= 24) return { score: 0.8, hoursDiff };
  if (hoursDiff <= 48) return { score: 0.65, hoursDiff };
  if (hoursDiff <= 96) return { score: 0.4, hoursDiff };
  if (hoursDiff <= 168) return { score: 0.2, hoursDiff };
  return { score: 0.05, hoursDiff };
}

/**
 * Deterministic text similarity using Token Jaccard + N-gram overlap.
 */
function getTextSimilarityScore(text1: string, text2: string): number {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'near', 'there', 'this', 'that', 'it', 'my', 'has', 'been'
  ]);

  const tokenize = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
  };

  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0.0;

  let intersection = 0;
  tokens1.forEach((t) => {
    if (tokens2.has(t)) intersection++;
  });

  const union = new Set([...tokens1, ...tokens2]).size;
  const jaccard = intersection / union;

  // Keyword boost for high-signal words (e.g. pothole, flood, leak, fire, dark, broken)
  const keywords = ['pothole', 'leak', 'flooding', 'fire', 'dark', 'collapsed', 'sewer', 'hazard', 'traffic', 'signal'];
  let keywordMatchCount = 0;
  keywords.forEach((kw) => {
    if ((text1.toLowerCase().includes(kw) && text2.toLowerCase().includes(kw))) {
      keywordMatchCount++;
    }
  });

  const keywordBoost = Math.min(0.3, keywordMatchCount * 0.15);
  return Math.min(1.0, Math.round((jaccard + keywordBoost) * 100) / 100);
}

/**
 * Calculates relationship confidence and transparent signals between an issue and a target incident.
 */
export function evaluateIssueIncidentRelationship(
  issue: Issue,
  targetIncident: CivicIncident,
  incidentPrimaryIssue?: Issue
): RelationshipSignals {
  // Use incident primary location
  const distanceMeters = calculateHaversineDistance(
    issue.location.latitude,
    issue.location.longitude,
    targetIncident.primaryLocation.latitude,
    targetIncident.primaryLocation.longitude
  );

  const distanceScore = getDistanceScore(distanceMeters);
  const categoryMatchScore = getCategoryScore(issue.category, targetIncident.category);
  const { score: temporalScore, hoursDiff } = getTemporalScore(issue.createdAt, targetIncident.createdAt);

  const compareText = incidentPrimaryIssue 
    ? `${incidentPrimaryIssue.title} ${incidentPrimaryIssue.description}` 
    : `${targetIncident.title} ${targetIncident.summary}`;

  const textSimilarityScore = getTextSimilarityScore(
    `${issue.title} ${issue.description}`,
    compareText
  );

  // Deterministic weights
  // Distance: 35%, Category: 25%, Text: 25%, Time: 15%
  const compositeScore = Math.min(
    1.0,
    Math.round(
      (distanceScore * 0.35 +
        categoryMatchScore * 0.25 +
        textSimilarityScore * 0.25 +
        temporalScore * 0.15) *
        100
    ) / 100
  );

  // Generate transparent explanations
  const explanation: string[] = [];

  if (distanceMeters < 1000) {
    explanation.push(`Geographic proximity: ${distanceMeters}m apart (${Math.round(distanceScore * 100)}% proximity score)`);
  } else {
    explanation.push(`Geographic distance: ${(distanceMeters / 1000).toFixed(1)}km apart`);
  }

  if (issue.category === targetIncident.category) {
    explanation.push(`Exact category match: ${issue.category}`);
  } else {
    explanation.push(`Categories: ${issue.category} vs ${targetIncident.category}`);
  }

  if (textSimilarityScore > 0.4) {
    explanation.push(`High semantic similarity: ${Math.round(textSimilarityScore * 100)}% text match`);
  } else {
    explanation.push(`Semantic match: ${Math.round(textSimilarityScore * 100)}% text similarity`);
  }

  explanation.push(`Time window: Reported within ${hoursDiff} hours of incident creation`);

  return {
    distanceMeters,
    distanceScore,
    categoryMatchScore,
    textSimilarityScore,
    temporalScore,
    compositeScore,
    explanation,
  };
}

/**
 * Searches all incidents in the system and ranks potential related incident candidates for an issue.
 */
export function findPotentiallyRelatedIncidents(
  newIssue: Issue,
  existingIncidents: CivicIncident[],
  existingIssues: Issue[],
  minConfidenceThreshold = 0.45
): RelatedIncidentCandidate[] {
  const candidates: RelatedIncidentCandidate[] = [];

  const issueMap = new Map<string, Issue>();
  existingIssues.forEach((i) => issueMap.set(i.id, i));

  for (const incident of existingIncidents) {
    const primaryIssue = incident.reportIds.length > 0 ? issueMap.get(incident.reportIds[0]) : undefined;
    const signals = evaluateIssueIncidentRelationship(newIssue, incident, primaryIssue);

    if (signals.compositeScore >= minConfidenceThreshold) {
      candidates.push({
        incidentId: incident.id,
        incidentTitle: incident.title,
        confidencePercentage: Math.round(signals.compositeScore * 100),
        signals,
      });
    }
  }

  // Sort descending by confidence
  return candidates.sort((a, b) => b.confidencePercentage - a.confidencePercentage);
}
