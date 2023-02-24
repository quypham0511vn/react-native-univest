export type MyImageViewProps = {
    imageUrl: string;
    style?: any;
    resizeMode?: any;
    onLoadFailed?: () => void;
    onClickImage?: (item: string) => void;
}
