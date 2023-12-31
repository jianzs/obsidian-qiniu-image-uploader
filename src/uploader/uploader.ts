import { PluginSettings } from "../settings";
import { QiniuUploader } from "./qiniu";

export interface Uploader {
    uploadFile(name: string, file: File): Promise<string>;
}

export function buildUploaderFrom(settings: PluginSettings): Uploader | undefined {
    if (settings.accessKey == "" || settings.accessSecretKey == "" || settings.bucketName == "" || settings.domain == "" || settings.region == "") {
        console.log('Settings: ', settings);
        return undefined
    }
    return new QiniuUploader(settings);
}