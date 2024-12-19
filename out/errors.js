"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.FileTreeError = void 0;
class FileTreeError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'FileTreeError';
    }
}
exports.FileTreeError = FileTreeError;
exports.ErrorCodes = {
    ACCESS_DENIED: 'ACCESS_DENIED',
    INVALID_PATH: 'INVALID_PATH',
    MAX_DEPTH_EXCEEDED: 'MAX_DEPTH_EXCEEDED',
};
//# sourceMappingURL=errors.js.map