export class SD {
    static isUrl(input: string): boolean {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
        return urlRegex.test(input);
    }

    static extractSlugFromUrl(url: string): string | null {
        const parts = url.split('/');
        return parts[parts.length - 1] || null;
    }
}

  