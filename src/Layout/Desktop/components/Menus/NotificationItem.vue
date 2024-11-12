<script setup lang="ts">
import {type PropType} from "vue";
import VueMarkdown from 'vue-markdown-render'

import type {Message, User} from "@/types/auth";
import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import KeepCounting from '@/components/KeepCounting.vue';
import {removeMessage} from '@/store/messages';

const props = defineProps({
    data: {
        type: Object as PropType<Message>,
        required: true,
    },
});

const handleClick = () => {
    removeMessage(props.data);
}

</script>

<template>
    <div
        :class="`flex justify-start items-start relative gap-2 p-2 rounded-lg border ${data.read ? 'border-transparent' : ' border-auto-alpha-2'}`"
    >
        <NoMercyAvatar v-if="(data.from as User).email" :user="data.from as User" class="w-10 min-w-10"/>
        <MoooomIcon v-else-if="data.type == 'notice' && data.from == 'System'" icon="wrench" className="w-10 p-2.5"/>
        <MoooomIcon v-else-if="data.type == 'notice'" icon="infoCircle" className="w-10 p-2.5"/>
        <MoooomIcon v-else-if="data.type == 'event'" icon="wrench" className="w-10 p-2.5"/>
        <MoooomIcon v-else-if="data.type == 'message'" icon="emailReceived" className="w-10 p-2.5"/>

        <div class="flex flex-grow flex-col items-start justify-start gap-3">
            <div class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch">
                <p class="flex-shrink-0 flex-grow-0 self-stretch w-available">
                    {{ (data.from as User).name ?? data.from }}
                </p>
                <div class="flex-shrink-0 flex-grow-0 self-stretch text-sm w-available text-auto-8">
                    <VueMarkdown class="markdown" :source="data.body"/>
                </div>
                <p class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available text-auto-alpha-10/[0.47]">
                    <KeepCounting :startTime="data.created_at" :relative="true"/>
                </p>
            </div>
        </div>

        <button @click="handleClick">
            <MoooomIcon icon="cross" className="w-5"/>
        </button>
    </div>
</template>
