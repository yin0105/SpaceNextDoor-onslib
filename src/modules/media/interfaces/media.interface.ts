type IOpenWriteStreamParam = {
  key: string;
  contentType?: string;
  bucket: string;
  isPrivate?: boolean;
};

type IOpenReadStreamParam = {
  key: string;
  bucket: string;
  isPrivate?: boolean;
};

type IFileDetail = {
  file: Buffer;
  ext: string;
  mimeType: string;
};

type IS3Config = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

type IError = {
  message: string;
  code: string;
};

type IUploaderOption = {
  compressImage: boolean;
  resizeWidth: number;
  uploadType: string;
  isPrivate?: boolean;
};

type IUploadResult = {
  error?: IError;
  key?: string | null;
};

type IUploadImagesQueryParam = {
  compressImage: boolean;
  resizeWidth: number;
  uploadType: string;
  isPrivate?: boolean;
};

type IUploadImagesResult = {
  bucketUrl: string;
  files: IUploadResult[];
};

type IResizeImageQueryParam = {
  size: string;
  imageKey: string;
};

type IResizeImageResult = {
  bucketUrl: string;
  key: string;
};

type IDeleteImageQueryParam = {
  imageKey: string;
};

type IDeleteImageResult = {
  code: number;
  success: boolean;
};

export {
  IOpenWriteStreamParam,
  IOpenReadStreamParam,
  IFileDetail,
  IS3Config,
  IError,
  IUploaderOption,
  IUploadResult,
  IUploadImagesQueryParam,
  IUploadImagesResult,
  IResizeImageQueryParam,
  IResizeImageResult,
  IDeleteImageQueryParam,
  IDeleteImageResult,
};
