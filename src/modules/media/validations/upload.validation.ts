import * as yup from 'yup';

export const uploadValidation = yup.object().shape({
  compressImage: yup.boolean().required(),
  resizeWidth: yup.number().optional().positive().integer(),
  uploadType: yup.string().required(),
  isPrivate: yup.boolean().optional(),
});
