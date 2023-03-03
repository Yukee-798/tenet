import { parse as jsoncParse, printParseErrorCode, } from 'jsonc-parser';
export default class TenetJSONStrParser {
    static parserInstance;
    static createParser() {
        if (!TenetJSONStrParser.parserInstance) {
            TenetJSONStrParser.parserInstance = new TenetJSONStrParser();
            return TenetJSONStrParser.parserInstance;
        }
        return TenetJSONStrParser.parserInstance;
    }
    /* 将 jsonStr 解析为 DSL */
    parse(jsonStr, onSuccess, onError) {
        const errors = [];
        const res = jsoncParse(jsonStr, errors, {
            allowTrailingComma: true,
            allowEmptyContent: true,
        });
        // 如果 jsoncParse 解析出错，内部会将错误信息记录到 errors 中
        if (errors.length > 0) {
            const errorInfoList = errors.map((error) => {
                const { error: errorCode, ...rest } = error;
                return {
                    message: printParseErrorCode(errorCode),
                    ...rest,
                };
            });
            onError?.(errorInfoList);
        }
        onSuccess?.(res);
    }
}
export const createParser = TenetJSONStrParser.createParser;
//# sourceMappingURL=TenetJSONStrParser.js.map