import { Joi } from 'celebrate';

export const addUserSchema = {
  name: Joi.string().required(),
  email: Joi.string().email().required()
};

export const userIdSchema = {
  id: Joi.string().hex().length(24).required()
};

export const updateSchema = {
  name: Joi.string().optional(),
  university: Joi.string().optional(),
  members: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(9).required(),
        academic_year: Joi.number().required().min(1).max(4)
      })
    )
    .min(1)
    .max(4)
    .optional(),
  photo_url: Joi.string().optional(),
  is_active: Joi.boolean().optional()
};

export const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&^()._*?]{8,30}$/)
    .required()
    .error((errors) =>
      errors.map((err) => {
        if (err.code === 'string.pattern.base')
          err.message = `Password should have at least one lowercase letter, one uppercase letter, one number and one special character and should be at least 8 characters long`;
        return err;
      })
    )
});
