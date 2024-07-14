export enum ReportFileType {
    HTML = 'text/html',
    PDF = 'application/pdf'
}

export function getFileTypeExtension(type: ReportFileType) {
    switch (type) {
        case ReportFileType.HTML:
            return 'html';
        case ReportFileType.PDF:
            return 'pdf';
    }
}