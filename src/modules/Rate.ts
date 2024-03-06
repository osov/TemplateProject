/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/*
    Модуль для вызова окна оценки приложения и проверки показано ли оно 
*/

declare global {
    const Rate: ReturnType<typeof RateModule>;
}

export function register_rate() {
    (_G as any).Rate = RateModule();
}


function RateModule() {
    let _is_shown = false;

    function show() {
        if (System.platform == 'Android' || System.platform == 'iPhone OS' || (System.platform == 'HTML5' && Ads.get_social_platform() == 'yandex') || System.platform == 'Windows')
            EventBus.trigger('SYS_SHOW_RATE');
    }

    function _mark_shown() {
        _is_shown = true;
    }

    function is_shown() {
        const tmp = _is_shown;
        _is_shown = false;
        return tmp;
    }

    return { show, is_shown, _mark_shown };
}