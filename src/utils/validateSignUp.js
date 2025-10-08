const { z } = require('zod');

/**
 * Zod validation schema for user sign-up requests
 * 
 * Schema requirements:
 * - email: required, validated as email format, lowercased and trimmed
 * - password: required, minimum 8 characters, maximum 64 characters
 * - firstName: required, minimum 5 characters, maximum 50 characters, trimmed
 * - lastName: required, maximum 50 characters, trimmed
 * 
 * Strict mode: rejects any unknown fields not defined in the schema
 */
const signUpSchema = z.object({
    email: z.email()
        .transform(v => v.trim().toLowerCase()),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must be at most 64 characters"),
    firstName: z.string()
        .min(5, "First name must be at least 5 characters")
        .max(50, "First name is too long")
        .transform(v => v.trim()),
    lastName: z.string()
        .max(50, "Last name is too long")
        .transform(v => v.trim())
})
.strict();


/**
 * Express middleware function to validate user sign-up request data
 * 
 * @param {Object} req - Express request object containing user sign-up data in req.body
 * @param {Object} res - Express response object for sending validation errors
 * @param {Function} next - Express next function to continue to next middleware
 * 
 * @description
 * Validates the request body against the signUpSchema using Zod.
 * If validation fails, returns a 400 status with detailed field errors.
 * If validation succeeds, transforms and sanitizes the data, then passes control to next middleware.
 * 
 * @returns {void} Either calls next() or sends error response
 */
function validateSignUp(req, res, next) {
    // Parse and validate the request body against the signUpSchema
    const result = signUpSchema.safeParse(req.body);

    // If validation fails, extract and format error details
    if (!result.success) {
        const fieldErrors = result.error.issues.map(i => ({
            path: i.path.join("."),
            message: i.message,
        }));

        // Return validation error response with field-specific error messages
        return res.status(400).json({
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            fieldErrors
        });
    }
    
    // Replace req.body with validated and transformed data
    req.body = result.data;
    // Continue to next middleware/route handler
    next();
}

module.exports = { validateSignUp };