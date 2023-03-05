import {
  parse as jsoncParse,
  ParseError as JSONCParseError,
  printParseErrorCode,
} from 'jsonc-parser';
import { DSL } from './TenetFormRenderer';

export interface ParseError {
  message: ReturnType<typeof printParseErrorCode>;
  offset: JSONCParseError['offset'];
  length: JSONCParseError['length'];
}

export default class TenetJSONStrParser {
  private static parserInstance: TenetJSONStrParser;
  static createParser() {
    if (!TenetJSONStrParser.parserInstance) {
      TenetJSONStrParser.parserInstance = new TenetJSONStrParser();
      return TenetJSONStrParser.parserInstance;
    }
    return TenetJSONStrParser.parserInstance;
  }
  /* 将 jsonStr 解析为 DSL */
  parse(
    jsonStr: string,
    onSuccess?: (dsl: DSL) => void,
    onError?: (errorInfoList: ParseError[]) => void
  ): void {
    const errors: JSONCParseError[] = [];
    const res = jsoncParse(jsonStr, errors, {
      allowTrailingComma: true,
      allowEmptyContent: true,
    });
    // 如果 jsoncParse 解析出错，内部会将错误信息记录到 errors 中
    if (errors.length > 0) {
      const errorInfoList: ParseError[] = errors.map((error) => {
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
