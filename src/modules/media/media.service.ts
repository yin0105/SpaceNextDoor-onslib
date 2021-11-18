import * as mime from 'mime-types';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../../exceptions';
import {
  IFileDetail,
  IResizeImageQueryParam,
  IUploaderOption,
  IUploadImagesQueryParam,
  IUploadResult,
} from './interfaces/media.interface';
import { S3Service } from './helpers';
import { resizeValidation, uploadValidation } from './validations';
import { UploadType } from '../../graphql/enums';
import { DEFAULT_BUCKET } from '../../configs/constants';

export class MediaService {
  private bucketName: string;
  private defaultResizeWidth: number = 0;
  private supportedMimeTypes: string[] = [];

  constructor(private readonly s3Service: S3Service) {
    this.bucketName = `${DEFAULT_BUCKET}` || '';
    this.defaultResizeWidth =
      parseInt(`${process.env.DEFAULT_RESIZE_WIDTH}`, 10) || 0;
    this.supportedMimeTypes =
      `${process.env.SUPPORT_MIME_TYPE}`.split(',') || [];
  }

  public async validateImageUploadQueryParams(
    queryParams: IUploadImagesQueryParam
  ): Promise<void> {
    try {
      await uploadValidation.validate(queryParams);
    } catch ({ message }) {
      throw new BadRequestError(message as string);
    }
  }

  public async validateResizeImageQueryParams(
    queryParams: IResizeImageQueryParam
  ): Promise<void> {
    try {
      await resizeValidation.validate(queryParams);
    } catch ({ message }) {
      throw new BadRequestError(message as string);
    }
  }

  public async resize(key: string, width: number, height?: number) {
    const newKey = `${key.split('.')[0]}-${width}x${height || ''}.${
      key.split('.')[1]
    }`;
    const bucket = this.bucketName;

    // If height is undefined or null, it'll maintain aspect ratio by using width only
    const streamResize = sharp().resize(width, height);

    const readStream = this.s3Service.openReadStream({ bucket, key });
    const { uploadStream, done } = this.s3Service.openWriteStream({
      bucket,
      key: newKey,
    });
    /**
     * Get image from S3 and simultaneously push it to the resize function. After that
     * directly upload that stream to s3 with new key provided.
     */
    readStream.pipe(streamResize).pipe(uploadStream);

    return (await done).Key;
  }

  public async upload(
    files: IFileDetail[],
    options: IUploaderOption = {
      compressImage: false,
      resizeWidth: this.defaultResizeWidth,
      uploadType: '',
      isPrivate: false,
    }
  ) {
    const resizeWidth = options?.resizeWidth || this.defaultResizeWidth;
    const result: IUploadResult[] = [];
    /**
     * By default, Promise.all will stop and error out if any of the promises
     * return error, by catching the error inside. We make sure this doesn't happen
     * Since stopping other file uploads could be expensive for the clients to send again
     */
    await Promise.all(
      files.map(async (file, i) => {
        const { file: fileBuffer, mimeType, ext } = file;

        if (this.isMimeSupported(mimeType)) {
          console.log(`Filetype not supported: ${mimeType}`);
          return (result[i] = this.generateErrorRes(
            /* eslint-disable @typescript-eslint/restrict-template-expressions */
            `Err: Expected file types: [${this.supportedMimeTypes}], instead got [${mimeType}]`,
            'UNSUPPORTED_FILE_TYPE'
          ));
        }

        try {
          let buffer = fileBuffer;

          if (this.isImage(mimeType)) {
            console.log(
              `File is an image, passing to image library: ${mimeType}`
            );
            /**
             * Sharp.resize() expects width and height respectively. When height is undefined
             * its gonna keep the aspect ratio of the image.
             * Rotation of image is determined from the EXIF data.
             */
            let sharpInstance = sharp(fileBuffer)
              .rotate()
              .resize(parseInt(resizeWidth.toString(), 10));

            if (options.compressImage) {
              sharpInstance = sharpInstance.jpeg({ quality: 81 });
            }

            buffer = await sharpInstance.toBuffer();
          }

          const s3Result = await this.s3Service.uploadBuffer({
            buffer,
            contentType: mimeType,
            key: this.getFileKey(options.uploadType, ext),
            bucket: this.bucketName,
            isPrivate: options.isPrivate,
          });

          return (result[i] = {
            error: undefined,
            key: s3Result.Key,
          });
        } catch ({ message }) {
          return (result[i] = this.generateErrorRes(
            message,
            'UNEXPECTED_ERROR'
          ));
        }
      })
    );

    return result;
  }

  private isImage(mimeType: string) {
    return mimeType.indexOf('image') >= 0;
  }

  private getFileKey(uploadType: string, ext: string) {
    /* eslint-disable @typescript-eslint/restrict-template-expressions */
    const fileName = `${uuidv4()}.${ext}`;

    switch (uploadType) {
      case UploadType.CUSTOMERS:
        return `uploads/customers/${fileName}`;
      case UploadType.BUILDINGS:
        return `uploads/buildings/${fileName}`;
      case UploadType.FEATURES:
        return `uploads/features/${fileName}`;
      case UploadType.INSURANCES:
        return `uploads/insurances/${fileName}`;
      case UploadType.POLICIES:
        return `uploads/policies/${fileName}`;
      case UploadType.PROMOTIONS:
        return `uploads/promotions/${fileName}`;
      case UploadType.USERS:
        return `uploads/users/${fileName}`;
      case UploadType.CONTRACTS:
        return `uploads/contracts/${fileName}`;
      default:
        return `uploads/${fileName}`;
    }
  }

  private generateErrorRes(err: string, code: string) {
    return {
      key: code,
      error: {
        message: err,
        code,
      },
    };
  }

  private isMimeSupported(type: string) {
    return !this.supportedMimeTypes.includes(type);
  }

  public getExtensionFromContentType(mimeType: string) {
    return mime.extension(mimeType);
  }
}
