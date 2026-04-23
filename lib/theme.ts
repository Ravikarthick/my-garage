
import { useColorScheme } from 'react-native';

export function useTheme() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return {
    dark,
    bg:      dark ? '#141414' : '#FFFFFF',
    bg2:     dark ? '#1E1E1E' : '#F5F4F1',
    bg3:     dark ? '#2A2A2A' : '#EEEDEA',
    card:    dark ? '#1E1E1E' : '#FFFFFF',
    text:    dark ? '#F0EFE8' : '#1A1A18',
    muted:   dark ? '#A0A09A' : '#6B6B67',
    hint:    dark ? '#6A6A64' : '#A0A09C',
    border:  dark ? '#2E2E2E' : '#E0DEDA',
    border2: dark ? '#3E3E3E' : '#CCCBC6',
    red:     '#D85A30',
    redL:    dark ? '#3A1A0E' : '#FAECE7',
    redD:    dark ? '#F08060' : '#993C1D',
    blue:    '#185FA5',
    blueL:   dark ? '#0A1E35' : '#E6F1FB',
    blueD:   dark ? '#5090D0' : '#0C447C',
    green:   '#3B6D11',
    greenL:  dark ? '#142008' : '#EAF3DE',
    amber:   '#BA7517',
    amberL:  dark ? '#2A1C04' : '#FAEEDA',
  };
}

// Static colors (for StyleSheet.create which runs outside components)
export const C = {
  red: '#D85A30', redL: '#FAECE7', redD: '#993C1D',
  blue: '#185FA5', blueL: '#E6F1FB', blueD: '#0C447C',
  green: '#3B6D11', greenL: '#EAF3DE',
  amber: '#BA7517', amberL: '#FAEEDA',
};
