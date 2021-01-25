import * as fs from "fs";
import util from "util";
const ffmpeg = require('fluent-ffmpeg');

import { User } from "../entity/user";
import { Lick } from "../entity/lick";
import { v4 as uuidv4 } from "uuid";
const logger = require('../winston/winston');

export class LickUtils {

    public static validateAudioFile(audioFile: any) {
        const MAX_FILE_SIZE_MB = 2;
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 * 1000;

        if (!audioFile) throw new Error("Error: No file sent.")
        if (!audioFile.size) throw new Error("Error: File is empty.")
        if (audioFile.size > MAX_FILE_SIZE_BYTES) throw new Error("Error: File must be less than " + MAX_FILE_SIZE_MB + "MB.")

        // ffmpeg can convert most types of audio files, let it fail if it can't convert the audio file
        if (!audioFile.type.startsWith("audio/"))  throw new Error("Error: Mimetype is not supported.");
    }

    public static async saveAudioFile(audioFile: any): Promise<string> {
        // save the audio to a file with a randomly generated uuid
        const audioFileLocation: string = "uploads/" + uuidv4();

        // convert all file types to .wav before saving
        return new Promise((res, rej) => {
            ffmpeg(audioFile.path)
                .toFormat('wav')
                .on('error', (err) => {
                    rej(err);
                })
                .on('end', () => {
                    res(audioFileLocation);
                })
                .save(audioFileLocation);
        })
    }

    public static canUserAccess(user: User, lick: Lick): boolean {
        // The owner and sharedWith relations MUST exist be loaded on the lick passed in
        if (!lick.owner || !lick.sharedWith) {
            throw new Error('The owner and sharedWith relations MUST be loaded on lick');
        }

        return lick.isPublic ||
            (user && (user.id == lick.owner.id)) ||
            (lick.sharedWith.some(user => user.id === user.id));
    }

    // Used when errors occurring during file deletion shouldn't be masked
    public static async unlinkAsync(filePath: string) : Promise<void> {
        const deleteFile = util.promisify(fs.unlink);
        await deleteFile(filePath);
    }

    public static async attemptToDeleteFile(filePath: string): Promise<void> {
        try {
            await LickUtils.unlinkAsync(filePath);
        } catch (err) {
            logger.error('couldn\'t delete file\n' + err.stack)
        }
    }
}
