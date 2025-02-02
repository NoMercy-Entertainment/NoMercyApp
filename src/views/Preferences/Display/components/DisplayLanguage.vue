<script setup lang="ts">
import { ref, watch } from 'vue';
import {refDebounced} from "@vueuse/core";

import { Language } from "@/types/api/shared";

import {displayLanguage, setDisplayLanguage} from "@/store/preferences";
import {languages} from "@/config/i18next";

import LanguageSelect from "@/components/Forms/LanguageSelect.vue";

const language = ref<Language>(languages?.find(l => l.iso_639_1 == displayLanguage.value)
    ?? { iso_639_1: 'en', name: 'English', label: 'English', english_name: 'English' });
const debouncedName = refDebounced(language, 100);
watch(debouncedName, (value) => {
  if (!value) return;
  setDisplayLanguage(value?.iso_639_1);
});

</script>

<template>
	<div class="xl:col-start-1 2xl:col-span-2 2xl:col-start-1">
		<LanguageSelect v-if="languages" id="language" :languages="languages" v-model="language" class="mb-4" name="Display language" />
	</div>
</template>
