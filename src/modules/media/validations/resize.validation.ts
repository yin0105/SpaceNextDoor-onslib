import * as yup from 'yup';

export const resizeValidation = yup.object().shape({
  imageKey: yup.string().required(),
  size: yup.string().required(),
});
