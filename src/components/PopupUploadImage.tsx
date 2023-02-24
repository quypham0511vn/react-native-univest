import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import Languages from '@/commons/Languages';
import ImageUtils from '@/utils/ImageUtils';
import BottomSheetComponent from './BottomSheet';
import { PopupActions } from './popup/types';

export type PopupUploadImageProps = {
    onImageSelected: (data: any) => any;
    maxSelect: number;
};

const PopupUploadImage = forwardRef<PopupActions, PopupUploadImageProps>(
    (props: PopupUploadImageProps, ref) => {
        const actionSheetRef = useRef<PopupActions>(null);

        const ACTIONS = [
            {  value: Languages.image.camera, key: 0 },
            {  value: Languages.image.library, key: 1 }
        ];

        const show = useCallback(() => {
            actionSheetRef.current?.show();
        }, []);

        useImperativeHandle(ref, () => ({
            show
        }));

        const onImageSelected = useCallback((data) => {
            actionSheetRef.current?.hide?.();
            if (data) {
                props.onImageSelected?.(data);
            }
        }, [props]);

        const onChangeValue = useCallback((item: any) => {
            if (item.key === 0) { // camera
                ImageUtils.openCamera(onImageSelected);
            } else if (item.key === 1) { // library
                ImageUtils.openLibrary(onImageSelected, props.maxSelect);
            }
        }, [onImageSelected, props.maxSelect]);

        return (
            <BottomSheetComponent
                ref={actionSheetRef}
                data={ACTIONS}
                onPressItem={onChangeValue}
            />
        );
    });

export default PopupUploadImage;
