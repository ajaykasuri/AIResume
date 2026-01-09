const Joi = require('joi');
const ResponseHandler = require('../utils/responseHandler');

// Validation schemas for different sections
const educationSchema = Joi.object({
  education_id: Joi.number().optional(),
  degree: Joi.string().max(255).required(),
  institution_name: Joi.string().max(255).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().optional().allow(null),
  gpa: Joi.number().min(0).max(4).optional()
});

const experienceSchema = Joi.object({
  exp_id: Joi.number().optional(),
  job_title: Joi.string().max(255).required(),
  company_name: Joi.string().max(255).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().optional().allow(null),
  is_current_job: Joi.boolean().default(false)
});

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return ResponseHandler.badRequest(res, error.details[0].message);
    }
    next();
  };
};

module.exports = {
  validateEducation: validate(educationSchema),
  validateExperience: validate(experienceSchema),
  // Add more validators as needed
};