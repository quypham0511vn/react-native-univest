import React from 'react';

import { Configs } from '@/commons/Configs';
import { COLORS, RenderHtmlStyle } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import he from 'he';
import RenderHTML from 'react-native-render-html';

const NotificationBody = ({ content }: {content?: string}) => {

    const source = `<div style="font-family: '${Configs.FontFamily.regular}'; 
    font-size: ${Configs.FontSize.size14}px; color: ${COLORS.BLACK}; ">
            ${he.decode(content || '')}
          </div>`

    return <RenderHTML
    contentWidth={SCREEN_WIDTH}
    source={{ html: source }}
    systemFonts={[Configs.FontFamily.regular]}
    enableExperimentalMarginCollapsing={true}
    tagsStyles={RenderHtmlStyle}
/>
};

export default NotificationBody;
