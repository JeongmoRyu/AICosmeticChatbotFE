import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const language = atom<string | undefined>({
  key: "language",
  default: "",
  effects_UNSTABLE: [persistAtom]
});

export { language };