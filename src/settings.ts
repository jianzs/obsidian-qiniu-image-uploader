import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import QiniuImageUploader from "./main";
import { t } from "./lang/helpers";

export interface PluginSettings {
    accessKey: string;
    accessSecretKey: string;
    bucketName: string;
    https: string;
    domain: string;
    namePrefix: string;
    region: string;
    deleteSource: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    accessKey: "",
    accessSecretKey: "",
    bucketName: "",
    https: "No",
    domain: "",
    namePrefix: "ob-",
    region: "z1",
    deleteSource: false,
};

export class SettingTab extends PluginSettingTab {
    plugin: QiniuImageUploader;

    constructor(app: App, plugin: QiniuImageUploader) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName(t("Access Key"))
            .setDesc(t("Access Key Desc"))
            .addText(text => text
                .setPlaceholder(t("Access Key Input"))
                .setValue(this.plugin.settings.accessKey)
                .onChange(async (value) => {
                    this.plugin.settings.accessKey = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t("Access Secret Key"))
            .setDesc(t("Access Secret Key Desc"))
            .addText(text => text
                .setPlaceholder(t("Access Secret Key Input"))
                .setValue(this.plugin.settings.accessSecretKey)
                .onChange(async (value) => {
                    this.plugin.settings.accessSecretKey = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t("Bucket Name"))
            .setDesc(t("Bucket Name Desc"))
            .addText(text => text
                .setPlaceholder(t("Bucket Name Input"))
                .setValue(this.plugin.settings.bucketName)
                .onChange(async (value) => {
                    this.plugin.settings.bucketName = value;
                    await this.plugin.saveSettings();
                }));

        const regionMapping: { [key: string]: string } = {
            "z1": t("North China - Hebei"),
            "z0": t("East China - Zhejiang"),
            "cn-east-2": t("East China - Zhejiang 2"),
            "z2": t("South China - Guangdong"),
            "na0": t("North America - Los Angeles"),
            "as0": t("Asia Pacific - Singapore (formerly Southeast Asia)"),
        };

        new Setting(containerEl)
            .setName(t("Region"))
            .setDesc(t("Region Desc"))
            .addDropdown(dropDown => dropDown
                .addOption("z1", t("North China - Hebei"))
                .addOption("z0", t("East China - Zhejiang"))
                .addOption("cn-east-2", t("East China - Zhejiang 2"))
                .addOption("z2", t("South China - Guangdong"))
                .addOption("na0", t("North America - Los Angeles"))
                .addOption("as0", t("Asia Pacific - Singapore (formerly Southeast Asia)"))
                .setValue(this.plugin.settings.region)
                .onChange(async (value) => {
                    this.plugin.settings.region = value;
                    await this.plugin.saveSettings();
                    const fiveSecondsMillis = 5_000
                    new Notice("修改地区为 " + regionMapping[value], fiveSecondsMillis)
                })
            );

        new Setting(containerEl)
            .setName(t("HTTPS"))
            .setDesc(t("HTTPS Desc"))
            .addDropdown(dropDown => dropDown
                .addOption("Yes", t("YES"))
                .addOption("No", t("NO"))
                .setValue(this.plugin.settings.https)
                .onChange(async (value) => {
                    this.plugin.settings.https = value;
                    await this.plugin.saveSettings();
                    const fiveSecondsMillis = 5_000;
                    if (value === "Yes") {
                        new Notice("修改为 HTTPS", fiveSecondsMillis)
                    } else {
                        new Notice("修改为 HTTP", fiveSecondsMillis)
                    }
                })
            );

        new Setting(containerEl)
            .setName(t("Domain"))
            .setDesc(t("Domain Desc"))
            .addText(text => text
                .setPlaceholder(t("Domain Input"))
                .setValue(this.plugin.settings.domain)
                .onChange(async (value) => {
                    this.plugin.settings.domain = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t("Name Prefix"))
            .setDesc(t("Name Prefix Desc"))
            .addText(text => text
                .setPlaceholder(t("Name Prefix Input"))
                .setValue(this.plugin.settings.namePrefix)
                .onChange(async (value) => {
                    this.plugin.settings.namePrefix = value;
                    await this.plugin.saveSettings();
                }));
    }
}
