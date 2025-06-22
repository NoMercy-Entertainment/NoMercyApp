<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { musicSearchResult, musicSearchValue } from '@/store/search';
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div class="flex w-available m-4">
				<InputText
					v-model="musicSearchValue"
					type="text"
					variant="filled"
					class="w-available"
				/>
			</div>

			<template v-if="musicSearchResult">
				<component
					:is="render.component"
					v-for="(render, index) in musicSearchResult ?? []"
					:key="render.id"
					:index="index"
					v-bind="render.props"
				/>
			</template>
		</IonContent>
	</IonPage>
</template>
