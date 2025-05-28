import { AppContext } from 'vue';
import I18NextVue from 'i18next-vue';
// @ts-ignore
import KonamiCode from 'vue3-konami-code';
import { Swiper, SwiperSlide } from 'swiper/vue';
import PrimeVue from 'primevue/config';
import {
    Card, Checkbox, ConfirmationService,
    ContextMenu, Dialog, FloatLabel,
    IftaLabel, InputNumber, InputText,
    MultiSelect, Ripple, ScrollPanel,
    Select, Toast, ToastService,
    Tooltip, Textarea, Image
} from 'primevue';
import { Form } from '@primevue/forms';
import '@primeuix/styled';

import { App } from '@capacitor/app';
import { IonicVue, isPlatform, useBackButton } from '@ionic/vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Aura from '@primevue/themes/aura';

import MasonryWall from '@yeger/vue-masonry-wall'

import '@/lib/scrollHandlers';
import '@/store/deviceInfo';

import konamiEnabled from '@/store/konami';
import i18next from '@/config/i18next';
import { queryClient } from '@/config/tanstack-query';
import router from './router';

import Button from '@/components/Buttons/Button.vue';
import HomeCard from '@/components/NMHomeCard.vue';
import Modal from '@/components/Modal.vue';
import NMCard from '@/components/NMCard.vue';
import NMCarousel from '@/components/NMCarousel.vue';
import NMContainer from '@/components/NMContainer.vue';
import NMList from '@/components/NMList.vue';
import NMMusicCard from '@/components/NMMusicCard.vue';
import NMMusicHomeCard from '@/components/NMMusicHomeCard.vue';
import NMServerComponent from '@/components/NMServerComponent.vue';
import NMTopResultCard from '@/components/NMTopResultCard.vue';
import NMTrackRow from '@/components/NMTrackRow.vue';

export async function setupApp(app: AppContext['app']) {

    if ('serviceWorker' in navigator && location.hostname !== 'localhost' && !import.meta.env.DEV) {
        await navigator.serviceWorker.ready;
    }

    app.use(router);
    app.use(IonicVue);
    app.use(I18NextVue, {
        i18next: i18next,
        rerenderOn: ['languageChanged', 'loaded'],
    });

    app.use(VueQueryPlugin, {
        enableDevtoolsV6Plugin: true,
        queryClient: queryClient,
    });

    app.use(PrimeVue, {
        theme: {
            preset: Aura,
        },
        ripple: true,
        inputVariant: 'outlined',
        inputStyle: 'outlined',
        options: {
            prefix: 'p',
            darkModeSelector: '.scheme-dark',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        },
    });

    app.use(KonamiCode, {
        onKonamiCodeEntered: () => {
            konamiEnabled.value = !konamiEnabled.value;
        },
    });

    app.use(MasonryWall);

    app.component('NMCard', NMCard);
    app.component('NMCarousel', NMCarousel);
    app.component('NMContainer', NMContainer);
    app.component('NMHomeCard', HomeCard);
    app.component('NMList', NMList);
    app.component('NMMusicCard', NMMusicCard);
    app.component('NMMusicHomeCard', NMMusicHomeCard);
    app.component('NMServerComponent', NMServerComponent);
    app.component('NMTopResultCard', NMTopResultCard);
    app.component('NMTrackRow', NMTrackRow);
    app.component('Button', Button);
    app.component('Modal', Modal);

    app.component('SwiperContainer', Swiper);
    app.component('SwiperSlide', SwiperSlide);

    app.use(ConfirmationService);
    app.use(ToastService);
    app.directive('ripple', Ripple);
    app.directive('tooltip', Tooltip);
    app.component('Card', Card);
    app.component('Checkbox', Checkbox);
    app.component('ContextMenu', ContextMenu);
    app.component('Dialog', Dialog);
    app.component('FloatLabel', FloatLabel);
    app.component('IftaLabel', IftaLabel);
    app.component('InputNumber', InputNumber);
    app.component('InputText', InputText);
    app.component('MultiSelect', MultiSelect);
    app.component('ScrollPanel', ScrollPanel);
    app.component('Select', Select);
    app.component('Toast', Toast);
    app.component('Textarea', Textarea);
    app.component('Image', Image);
    app.component('Form', Form);

    router.isReady()
        .then(() => {
            app.mount('#app');

            setTimeout(() => {
                const redirectUrl = location.search.includes('redirectUrl')
                    ? location.search.split('redirectUrl=')[1].split('&')[0]
                    : undefined;

                localStorage.setItem('redirectUrl', redirectUrl || localStorage.getItem('redirectUrl') || '/home');

                if (redirectUrl) {
                    router.push(redirectUrl).then();
                }
            }, 1000);
        });

    useBackButton(9999, () => {
        document.dispatchEvent(new Event('backbutton'));
    });

    await App.addListener('backButton', async (e) => {
        if (document.querySelector('video')) return;
        console.log('Back button pressed', e);

        if (!e.canGoBack) {
            await App.exitApp();
        } else {
            router.back();
        }
    });
}
