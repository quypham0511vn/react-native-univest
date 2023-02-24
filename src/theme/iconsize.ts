import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/DimensionUtils";

export const IconSize = {
  sizeHeader: {
    width: SCREEN_WIDTH,
    height: (SCREEN_WIDTH / 375) * 175,
  },
  sizeBanner: {
    width: SCREEN_WIDTH * 0.75,
    height: (SCREEN_HEIGHT - 10) * 0.2,
  },
  sizeIndicator: {
    width: 10,
    height: 10,
  },
  size15_15: {
    width: 15,
    height: 15,
  },
  size20_20: {
    width: 20,
    height: 20,
  },
  size25_25: {
    width: 25,
    height: 25,
  },
  size30_30: {
    width: 30,
    height: 30,
  },
  size50_30: {
    width: 50,
    height: 30,
  },
  size40_40: {
    width: 40,
    height: 40,
  },
  size80_80: {
    width: 80,
    height: 80,
  },
  sizeW_110: {
    width: SCREEN_WIDTH - 60,
    height: 110,
  },
  vps: {
    width: SCREEN_WIDTH - 40,
    height: ((SCREEN_WIDTH - 40) / 1032) * 645,
  },
};
