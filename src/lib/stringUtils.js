/**
 * Convert strings like "SocialSecurity" to "socialSecurity".
 * If passed a non-PascalCase string such as SOCIAL_SECURITY, it cannot detect that the string
 * is not PascalCase and will therefore convert it to sOCIAL_SECURITY
 * @param string
 * @return {*}
 */
const pascalToCamelCase = (string) => string.replace(/^([A-Z])/, (match) => match.toLowerCase());

module.exports = {
  pascalToCamelCase,
};
