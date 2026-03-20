import { createSlice } from '@reduxjs/toolkit';

export type Lang = 'ru' | 'en';

export interface UiState {
  lang: Lang;
  introVisible: boolean;
  introSwipeStarted: boolean;
  aboutAccordionOpen: boolean;
  menuOpen: boolean;
  calcOpen: boolean;
}

const initialState: UiState = {
  lang: 'ru',
  introVisible: true,
  introSwipeStarted: false,
  aboutAccordionOpen: false,
  menuOpen: false,
  calcOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLang: (state, action: { payload: Lang }) => {
      state.lang = action.payload;
    },
    hideIntro: (state) => {
      state.introVisible = false;
    },
    setIntroSwipeStarted: (state, action: { payload: boolean }) => {
      state.introSwipeStarted = action.payload;
    },
    toggleAboutAccordion: (state) => {
      state.aboutAccordionOpen = !state.aboutAccordionOpen;
    },
    toggleMenu: (state) => {
      state.menuOpen = !state.menuOpen;
    },
    toggleCalc: (state) => {
      state.calcOpen = !state.calcOpen;
    },
  },
});

export const { setLang, hideIntro, setIntroSwipeStarted, toggleAboutAccordion, toggleMenu, toggleCalc } = uiSlice.actions;
export default uiSlice.reducer;
