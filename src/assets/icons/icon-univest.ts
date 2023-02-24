import { memo, MemoExoticComponent } from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

import { ICONS } from './constant';

const IconUnivestBase = createIconSetFromIcoMoon(
    require('./selection.json'),
    'Univest',
    'univest.ttf'
);

export const IconUnivest = memo(IconUnivestBase) as MemoExoticComponent<
    typeof IconUnivestBase
> & {
    icons: typeof ICONS;
};

IconUnivest.icons = ICONS;
