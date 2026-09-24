import axios from 'axios';

/**
 * Privacy-preserving AI Complaint Analysis Service
 * NEVER passes user identities, names, emails, or IDs to AI models.
 */

// Heuristic fallback engine when AI_API_KEY is not set or API is unreachable
const fallbackAnalyze = ({ description, location, categoryInput, severityInput }) => {
  const text = (description || '').toLowerCase();
  const loc = (location || '').toLowerCase();

  // Category determination
  let category = categoryInput || 'Infrastructure';
  let possibleDepartment = 'Campus Maintenance';

  if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('network') || text.includes('speed') || text.includes('disconnect') || text.includes('ethernet')) {
    category = 'Wi-Fi / Internet';
    possibleDepartment = 'IT & Networking Department';
  } else if (text.includes('lab') || text.includes('computer') || text.includes('equipment') || text.includes('machine') || text.includes('chemical') || text.includes('apparatus')) {
    category = 'Laboratory';
    possibleDepartment = 'Laboratory & Technical Services';
  } else if (text.includes('food') || text.includes('canteen') || text.includes('mess') || text.includes('hygiene') || text.includes('snack') || text.includes('meal')) {
    category = 'Food / Canteen';
    possibleDepartment = 'Canteen & Hospitality Committee';
  } else if (text.includes('hostel') || text.includes('room') || text.includes('dorm') || text.includes('warden') || text.includes('geyser') || text.includes('bed')) {
    category = 'Hostel';
    possibleDepartment = 'Hostel Affairs & Student Housing';
  } else if (text.includes('bus') || text.includes('transport') || text.includes('shuttle') || text.includes('parking') || text.includes('van')) {
    category = 'Transport';
    possibleDepartment = 'Campus Transport Division';
  } else if (text.includes('library') || text.includes('book') || text.includes('journal') || text.includes('study room')) {
    category = 'Library';
    possibleDepartment = 'Library Services';
  } else if (text.includes('classroom') || text.includes('projector') || text.includes('podium') || text.includes('bench') || text.includes('ac') || text.includes('fan') || text.includes('blackboard') || text.includes('whiteboard')) {
    category = 'Classroom';
    possibleDepartment = 'Estate & Classroom Facilities';
  } else if (text.includes('exam') || text.includes('grade') || text.includes('faculty') || text.includes('schedule') || text.includes('syllabus') || text.includes('course')) {
    category = 'Academic';
    possibleDepartment = 'Academic Affairs & Registrar';
  } else if (text.includes('washroom') || text.includes('toilet') || text.includes('water') || text.includes('leak') || text.includes('lift') || text.includes('elevator')) {
    category = 'Facilities';
    possibleDepartment = 'Estate & Facilities Maintenance';
  }

  // Severity evaluation
  let severity = severityInput || 'Medium';
  if (text.includes('urgent') || text.includes('danger') || text.includes('hazard') || text.includes('electric') || text.includes('shock') || text.includes('fire') || text.includes('broken glass') || text.includes('flood')) {
    severity = 'Critical';
  } else if (text.includes('not working') || text.includes('failed') || text.includes('severe') || text.includes('blocked') || text.includes('exam tomorrow') || text.includes('dead')) {
    severity = 'High';
  } else if (text.includes('minor') || text.includes('slow') || text.includes('request') || text.includes('suggestion')) {
    severity = 'Low';
  }

  // Keyword extraction
  const stopWords = new Set(['the', 'and', 'a', 'an', 'in', 'on', 'is', 'it', 'to', 'for', 'of', 'with', 'at', 'by', 'from', 'this', 'that', 'our', 'we', 'are', 'was', 'very', 'not', 'have', 'has']);
  const words = (description + ' ' + location)
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
  const uniqueKeywords = Array.from(new Set(words)).slice(0, 6);

  // Generate clean summary
  let summary = description.trim();
  if (summary.length > 130) {
    const firstPeriod = summary.indexOf('.');
    if (firstPeriod > 30 && firstPeriod < 140) {
      summary = summary.substring(0, firstPeriod + 1);
    } else {
      summary = summary.substring(0, 127) + '...';
    }
  }

  return {
    category,
    severity,
    summary,
    keywords: uniqueKeywords,
    possibleDepartment,
  };
};

export const analyzeComplaintContent = async ({ description, location, categoryInput, severityInput }) => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    return fallbackAnalyze({ description, location, categoryInput, severityInput });
  }

  try {
    // Calling Google Gemini REST API
    const prompt = `You are an AI assistant for a university campus grievance triage system.
Analyze the following student campus complaint report. 
Do NOT assume any personal identity.
Return ONLY a valid JSON object without markdown fences, formatting, or commentary.

Input:
Description: "${description}"
Location: "${location}"
Category Hint: "${categoryInput || 'Unknown'}"
Severity Hint: "${severityInput || 'Unknown'}"

Required JSON output format:
{
  "category": "Wi-Fi / Internet | Infrastructure | Laboratory | Classroom | Library | Hostel | Transport | Food / Canteen | Facilities | Academic | Other",
  "severity": "Low | Medium | High | Critical",
  "summary": "A concise 1-2 sentence factual summary of the core issue without personal pronouns",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "possibleDepartment": "Recommended campus department handling this"
}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      },
      { timeout: 8000 }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return {
        category: parsed.category || categoryInput || 'Infrastructure',
        severity: parsed.severity || severityInput || 'Medium',
        summary: parsed.summary || description.slice(0, 120),
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        possibleDepartment: parsed.possibleDepartment || 'Campus Facilities',
      };
    }

    return fallbackAnalyze({ description, location, categoryInput, severityInput });
  } catch (error) {
    console.warn(`AI API call failed (${error.message}), falling back to NLP heuristic analysis.`);
    return fallbackAnalyze({ description, location, categoryInput, severityInput });
  }
};
