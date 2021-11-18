import { BadRequestError } from '../../exceptions';
import {
  IFileDetail,
  IResizeImageQueryParam,
  IResizeImageResult,
  IUploadImagesQueryParam,
  IUploadImagesResult,
} from './interfaces/media.interface';
import { MediaService } from './media.service';

export class MediaController {
  private bucketUrl: string = '';
  constructor(private readonly mediaService: MediaService) {
    this.bucketUrl = `${process.env.AWS_S3_BUCKET_URL}`;
  }

  //@UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(
    queryParams: IUploadImagesQueryParam,
    files: any[]
  ): Promise<IUploadImagesResult> {
    await this.mediaService.validateImageUploadQueryParams(queryParams);
    const filesDetails: IFileDetail[] = files.map(file => ({
      file: file.buffer,
      ext: this.mediaService.getExtensionFromContentType(file.mimetype),
      mimeType: file.mimetype,
    })) as IFileDetail[];
    try {
      const uploadFileResult = await this.mediaService.upload(
        filesDetails,
        queryParams
      );
      /* eslint-disable @typescript-eslint/restrict-template-expressions */
      console.log(`Uploader result: ${uploadFileResult}`);
      return {
        bucketUrl: this.bucketUrl,
        files: uploadFileResult,
      } as IUploadImagesResult;
    } catch (e) {
      console.error('Error occurred while uploading', e);
      throw new BadRequestError('Something went wrong while uploading images!');
    }
  }

  async resizeImage(
    queryParams: IResizeImageQueryParam
  ): Promise<IResizeImageResult> {
    await this.mediaService.validateResizeImageQueryParams(queryParams);
    const { size, imageKey } = queryParams;
    const sizeArray = size.split('x');
    const width = parseInt(sizeArray[0], 10);
    const height = parseInt(sizeArray[1], 10) || undefined;
    if (!width) {
      console.error(`Width param missing or malformed size param: ${size}`);
      throw new BadRequestError(
        'The size path param should be like 40x40, instead got width undefined'
      );
    }

    try {
      const imagePath = await this.mediaService.resize(imageKey, width, height);
      console.log(`Generated new image with path: ${imagePath}`);
      return {
        bucketUrl: this.bucketUrl,
        key: imagePath,
      } as IResizeImageResult;
    } catch (e) {
      console.error('Error occurred while resizing and uploading', e);
      throw new BadRequestError('Error occurred while resizing the image!');
    }
  }
}
