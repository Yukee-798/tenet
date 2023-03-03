import { ParseError as JSONCParseError, printParseErrorCode } from 'jsonc-parser';
import { DSL } from './TenetFormRenderer';
export interface ParseError {
    message: ReturnType<typeof printParseErrorCode>;
    offset: JSONCParseError['offset'];
    length: JSONCParseError['length'];
}
export default class TenetJSONStrParser {
    private static parserInstance;
    static createParser(): TenetJSONStrParser;
    parse(jsonStr: string, onSuccess?: (dsl: DSL) => void, onError?: (errorInfoList: ParseError[]) => void): void;
}
export declare const createParser: typeof TenetJSONStrParser.createParser;
