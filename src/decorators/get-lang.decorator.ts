import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AVAILABLE_LANGS } from "src/constants/constants";

export const GetLang = createParamDecorator((data, ctx: ExecutionContext): string => {
    let lang: string = ctx.switchToHttp().getRequest().headers['accept-language']
    if (!lang) {
        return 'en'
    }

    lang = lang.substr(0, 2)
    if (!AVAILABLE_LANGS.includes(lang)) {
        return 'en'
    }

    return lang
})