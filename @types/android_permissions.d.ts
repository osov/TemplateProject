/** @noResolution */

declare namespace android_permissions {
    export function initialize(key: string): void;
    export function set_callback(cb: Callback): void;
    export function report_event(event: string, json: string): void;
}

