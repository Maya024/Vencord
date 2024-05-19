import { classNameFactory } from "@api/Styles";
import { settings } from "./settings";

export const cl = classNameFactory("vc-trans-");

interface TranslationData {
    src: string;
    sentences: {
        trans: string;
    }[];
}

export interface TranslationValue {
    src: string;
    text: string;
}

export async function translate(kind: "received" | "sent", text: string): Promise<TranslationValue> {
    const sourceLang = settings.store[kind + "Input"];
    const targetLang = settings.store[kind + "Output"];

    const url = "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
        client: "gtx",
        sl: sourceLang,
        tl: targetLang,
        dt: "t",
        dj: "1",
        source: "input",
        q: text
    });

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(
            `Failed to translate "${text}" (${sourceLang} -> ${targetLang})`
            + `\n${res.status} ${res.statusText}`
        );
    }

    const { src, sentences }: TranslationData = await res.json();

    return {
        src,
        text: sentences.map(s => s?.trans).filter(Boolean).join(" ")
    };
}
