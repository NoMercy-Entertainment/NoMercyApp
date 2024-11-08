<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import {onMounted, onUnmounted, ref} from 'vue';

import { humanTimeExtended, timeAgoShort } from '@/lib/dateTime';

const { t } = useTranslation();

const props = defineProps({
	startTime: {
		required: true,
	},
    relative: {
        type: Boolean,
        required: false,
        default: false,
    }
});

const makeTime = (time: Date|number) => {
    if(props.relative){
        return timeAgoShort(time).replace(/NaN/gui, '_').trim();
    }

    return humanTimeExtended(t, time, true).replace(/NaN/gui, '_').trim();
}

const time = ref(makeTime(props.startTime as Date));

const interval = ref<NodeJS.Timeout>();

onMounted(() => {
	interval.value = setInterval(() => {
		time.value = makeTime(props.startTime as Date);
	}, 1000);
});

onUnmounted(() => {
	clearInterval(interval.value);
});

</script>

<template>
    {{ time.toString() || $t('Just now') }}
</template>
