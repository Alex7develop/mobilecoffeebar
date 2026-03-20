import { createSlice } from '@reduxjs/toolkit';

export interface CalcState {
  eventDate: string;
  eventType: string;
  guests: number;
  hours: number;
  city: string;
  selectedMilk: string[];
  optDrink: boolean;
  optExtra: boolean;
  optFunctional: boolean;
  optStandCustom: boolean;
  optMasterclass: boolean;
  optMoreMilks: boolean;
  resultVisible: boolean;
  totalPrice: string;
  recommendedPackage: string;
}

const today = new Date().toISOString().slice(0, 10);

const initialState: CalcState = {
  eventDate: today,
  eventType: 'Свадьба',
  guests: 80,
  hours: 4,
  city: 'msk',
  selectedMilk: [],
  optDrink: false,
  optExtra: false,
  optFunctional: false,
  optStandCustom: false,
  optMasterclass: false,
  optMoreMilks: false,
  resultVisible: false,
  totalPrice: '',
  recommendedPackage: '',
};

const calcSlice = createSlice({
  name: 'calc',
  initialState,
  reducers: {
    setEventDate: (state, action: { payload: string }) => {
      state.eventDate = action.payload;
    },
    setEventType: (state, action: { payload: string }) => {
      state.eventType = action.payload;
    },
    setGuests: (state, action: { payload: number }) => {
      state.guests = action.payload;
    },
    setHours: (state, action: { payload: number }) => {
      state.hours = action.payload;
    },
    setCity: (state, action: { payload: string }) => {
      state.city = action.payload;
    },
    toggleMilk: (state, action: { payload: string }) => {
      const idx = state.selectedMilk.indexOf(action.payload);
      if (idx >= 0) state.selectedMilk = state.selectedMilk.filter((id) => id !== action.payload);
      else {
        const max = state.optMoreMilks ? Infinity : 4;
        if (state.selectedMilk.length < max) state.selectedMilk = [...state.selectedMilk, action.payload];
      }
    },
    setOptDrink: (state, action: { payload: boolean }) => {
      state.optDrink = action.payload;
    },
    setOptExtra: (state, action: { payload: boolean }) => {
      state.optExtra = action.payload;
    },
    setOptFunctional: (state, action: { payload: boolean }) => {
      state.optFunctional = action.payload;
    },
    setOptStandCustom: (state, action: { payload: boolean }) => {
      state.optStandCustom = action.payload;
    },
    setOptMasterclass: (state, action: { payload: boolean }) => {
      state.optMasterclass = action.payload;
    },
    setOptMoreMilks: (state, action: { payload: boolean }) => {
      state.optMoreMilks = action.payload;
    },
    setResult: (state, action: { payload: { totalPrice: string; recommendedPackage: string } }) => {
      state.resultVisible = true;
      state.totalPrice = action.payload.totalPrice;
      state.recommendedPackage = action.payload.recommendedPackage;
    },
    hideResult: (state) => {
      state.resultVisible = false;
    },
  },
});

export const {
  setEventDate,
  setEventType,
  setGuests,
  setHours,
  setCity,
  toggleMilk,
  setOptDrink,
  setOptExtra,
  setOptFunctional,
  setOptStandCustom,
  setOptMasterclass,
  setOptMoreMilks,
  setResult,
  hideResult,
} = calcSlice.actions;
export default calcSlice.reducer;
