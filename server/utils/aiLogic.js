/**
 * AI Simulation Logic
 * Rule-based logic to simulate AI behavior for hackathon demo.
 */

const detectUrgency = (text) => {
  const t = text.toLowerCase();
  if (/(today|tonight|asap|urgent|tomorrow|deadline|before|immediately|important)/.test(t)) return "High";
  if (/(this week|soon|by friday|next few days)/.test(t)) return "Medium";
  return "Low";
};

const detectCategory = (text) => {
  const t = text.toLowerCase();
  if (/(react|html|css|portfolio|web|frontend|javascript|node|express|backend)/.test(t)) return "Web Development";
  if (/(figma|design|poster|ui|ux|logo|branding)/.test(t)) return "Design";
  if (/(interview|career|internship|resume|job|hiring)/.test(t)) return "Career";
  if (/(python|data|ml|ai|machine learning|analytics)/.test(t)) return "Data";
  return "Community";
};

const suggestTags = (text) => {
  const t = text.toLowerCase();
  const keywords = ["react", "figma", "html", "css", "python", "portfolio", "interview", "career", "frontend", "backend", "node", "express", "javascript", "ui", "ux", "responsive", "bug", "debugging"];
  const tags = [];
  keywords.forEach((k) => {
    if (t.includes(k)) tags.push(k.charAt(0).toUpperCase() + k.slice(1));
  });
  return tags.slice(0, 4);
};

const generateSummary = (title, description) => {
  // Simple summary simulation
  const mainSent = description.split('.')[0];
  return `This is a request regarding ${title}. The user needs assistance with: ${mainSent.length > 100 ? mainSent.substring(0, 97) + '...' : mainSent}.`;
};

module.exports = {
  detectUrgency,
  detectCategory,
  suggestTags,
  generateSummary
};
