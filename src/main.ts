import { Editor, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, PluginSettings, SettingTab } from './settings';
import { Uploader, buildUploaderFrom } from './uploader/uploader';

export default class QiniuImageUploader extends Plugin {
    settings: PluginSettings;

    uploader: Uploader | undefined;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new SettingTab(this.app, this));

        this.registerEvent(this.app.workspace.on('editor-paste', this.customPasteEventCallback))
        this.registerEvent(this.app.workspace.on('editor-drop', this.customDropEventListener))

        this.uploader = buildUploaderFrom(this.settings);
    }

    private customPasteEventCallback = async (e: ClipboardEvent) => {
        if (!this.uploader) {
            QiniuImageUploader.showUnconfiguredPluginNotice();
            return;
        }
        if (e.clipboardData == null || e.clipboardData.files.length === 0) {
            return;
        }

        const { files } = e.clipboardData!;
        const uploadFile = files[0];
        if (!uploadFile.type.startsWith('image')) {
            return;
        }

        e.preventDefault()
        await this.uploadFileAndEmbedImage(uploadFile);
    }

    private customDropEventListener = async (e: DragEvent) => {
        if (!this.uploader) {
            QiniuImageUploader.showUnconfiguredPluginNotice();
            return;
        }
        if (e.dataTransfer == null || e.dataTransfer.files.length === 0) {
            return;
        }

        const { files } = e.dataTransfer;
        const uploadFile = files[0];
        if (!uploadFile.type.startsWith('image')) {
            return;
        }

        e.preventDefault()
        await this.uploadFileAndEmbedImage(uploadFile);
    }

    private async uploadFileAndEmbedImage(uploadFile: File) {
        const pasteId = (Math.random() + 1).toString(36).substring(2, 7)
        const progressText = `![Uploading file... ${pasteId}]()`

        const editor = this.getEditor();
        if (!editor) {
            new Notice('⚠️ Please open a file.');
            return;
        }
        editor.replaceSelection(`${progressText}\n`)

        const fileName = this.genImageName(uploadFile);
        await this.uploader!.uploadFile(fileName, uploadFile);

        const imageUrl = `http://${this.settings.domain}/${fileName}`;
        const markDownImage = `![](${imageUrl})`
        QiniuImageUploader.replaceFirstOccurrence(editor, progressText, markDownImage)
    }

    private getEditor(): Editor | undefined {
        return this.app.workspace.activeEditor?.editor;
    }

    private genImageName(image: File) {
        const parts = image.type.split('/');
        const type = parts[parts.length - 1];
        return `${this.settings.namePrefix}${Date.now()}.${type}`;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    private static showUnconfiguredPluginNotice() {
        const fiveSecondsMillis = 5_000
        new Notice('⚠️ Please configure Qiniu Image Uploader or disable it', fiveSecondsMillis)
    }

    private static replaceFirstOccurrence(editor: Editor, target: string, replacement: string) {
        const lines = editor.getValue().split('\n')
        for (let i = 0; i < lines.length; i += 1) {
            const ch = lines[i].indexOf(target)
            if (ch !== -1) {
                const from = { line: i, ch }
                const to = { line: i, ch: ch + target.length }
                editor.replaceRange(replacement, from, to)
                break
            }
        }
    }
}