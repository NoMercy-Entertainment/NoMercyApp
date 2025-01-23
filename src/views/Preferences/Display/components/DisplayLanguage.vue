<script setup lang="ts">
import { ref, watch } from 'vue';

import useServerClient from "@/lib/clients/useServerClient";
import { Language } from "@/types/api/shared";
import { displayLanguage, setDisplayLanguage } from "@/store/ui";
import LanguageSelect from "@/components/Forms/LanguageSelect.vue";

const { data: languages } = useServerClient<Language[]>({
	path: '/dashboard/configuration/languages',
});

const language = ref(languages.value?.find(l => l.iso_639_1 == displayLanguage?.value || l.iso_639_1 == navigator.language.split('-')[0]));

watch(languages, (value) => {
	if (!value) return;
	language.value = value.find(l => l.iso_639_1 == displayLanguage?.value || l.iso_639_1 == navigator.language.split('-')[0]);
});

watch(language, (value) => {
	if (!value) return;
	setDisplayLanguage(value?.iso_639_1);
});

</script>

<template>
	<div class="xl:col-start-1 2xl:col-span-2 2xl:col-start-1">
		<LanguageSelect v-if="languages" id="language" v-model="language" class="mb-4" name="Display language" />
	</div>
</template>
