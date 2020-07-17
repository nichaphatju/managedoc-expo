import { View } from "native-base";
export default function renderIf(condition, content) {
    if (condition) {
        return content;
    } else {
        return ;
    }
}