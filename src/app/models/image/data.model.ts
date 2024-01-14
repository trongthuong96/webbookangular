import { Image } from "./image.model";
import { Medium } from "./medium.model";
import { Thumb } from "./thumb.model";

export interface Data {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: Image;
    thumb: Thumb;
    medium: Medium;
    delete_url: string;
}