import { PluginSettings } from "../settings";
import * as qiniu from 'qiniu';
import { Uploader } from "./uploader";

export class QiniuUploader implements Uploader {
    settings: PluginSettings;

    lastToken: string;
    tokenCreated: number;
    tokenExpires: number;

    constructor(settings: PluginSettings) {
        this.settings = settings;

        this.lastToken = "";
        this.tokenCreated = Date.now();
        this.tokenExpires = 7200;
    }

    public async uploadFile(name: string, file: File): Promise<string> {
        var config = new qiniu.conf.Config({
            zone: qiniu.zone.Zone_z0,
        });

        var formUploader = new qiniu.form_up.FormUploader(config);
        var putExtra = new qiniu.form_up.PutExtra();

        const uploadToken = await this.getToken();
        const content = await file.arrayBuffer();
        return new Promise((resolve, reject) => {
            formUploader.put(uploadToken, name, Buffer.from(content), putExtra, function (respErr,
                respBody, respInfo) {
                if (respErr) {
                    reject(respErr);
                    return;
                }
                if (respInfo.statusCode != 200) {
                    reject({ Status: respInfo.statusCode, Body: respBody });
                    return;
                }
                resolve(respBody);
            });
        });
    }

    private async getToken(): Promise<string> {
        if (this.lastToken != '' && Date.now() - this.tokenCreated < this.tokenExpires * 0.9) {
            return this.lastToken;
        }

        var accessKey = this.settings.accessKey;
        var secretKey = this.settings.accessSecretKey;
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

        var options = {
            scope: this.settings.bucketName,
            expires: this.tokenExpires,
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken = putPolicy.uploadToken(mac);

        this.tokenCreated = Date.now();
        this.lastToken = uploadToken;
        return uploadToken;
    }
}