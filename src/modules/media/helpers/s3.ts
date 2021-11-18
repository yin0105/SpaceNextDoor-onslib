import { S3 } from 'aws-sdk';
import * as mime from 'mime-types';
import * as stream from 'stream';

import {
  IOpenReadStreamParam,
  IOpenWriteStreamParam,
  IS3Config,
} from '../interfaces';

export class S3Service {
  private s3Client: S3;
  constructor() {
    this.s3Client = new S3(this.getS3Config());
  }

  private getS3Config(): IS3Config {
    return {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION,
    } as IS3Config;
  }

  public openReadStream({ key, bucket }: IOpenReadStreamParam) {
    return this.s3Client
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .createReadStream();
  }

  public openWriteStream({ key, contentType, bucket }: IOpenWriteStreamParam) {
    const _contentType = contentType || (mime.contentType(key) as string);

    if (!_contentType) {
      throw new Error('contentType is required to upload files to s3');
    }

    const passThrough = new stream.PassThrough();
    return {
      uploadStream: passThrough,
      done: this.s3Client
        .upload({
          ContentType: _contentType,
          Body: passThrough,
          Bucket: bucket,
          Key: key,
          ACL: 'public-read',
        })
        .promise(),
    };
  }

  /**
   * Get object from S3.
   *
   * @param IOpenReadStreamParam S3 object param
   * @returns
   */
  public getObject({ key, bucket }: IOpenReadStreamParam) {
    return this.s3Client.getObject({
      Bucket: bucket,
      Key: key,
    });
  }

  public uploadBuffer({
    key,
    contentType,
    bucket,
    buffer,
    isPrivate = false,
  }: IOpenWriteStreamParam & { buffer: Buffer }) {
    return this.s3Client
      .upload({
        ContentType: contentType,
        Body: buffer,
        Bucket: bucket,
        Key: key,
        ACL: isPrivate ? 'private' : 'public-read',
      })
      .promise();
  }

  public deleteImage(key: string, bucket: string) {
    return this.s3Client
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
  }
}
