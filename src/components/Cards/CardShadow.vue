<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

defineProps({
	colored: {
		type: Boolean,
		required: false,
		default: false,
	},
	className: {
		type: String,
		required: false,
		default: '',
	},
});
</script>

<template>
	<svg
		:class="
			twMerge(
				'w-[280px] h-[122px] absolute left-0 top-[298px] blur-md z-20 z-0',
				className,
			)
		"
		fill="none"
		height="123"
		preserveAspectRatio="none"
		viewBox="0 0 280 123"
		width="280"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g filter="url(#filter0_bf_5719_22815)">
			<rect
				fill="var(--color-theme-8)"
				fill-opacity="0.12"
				height="122"
				transform="matrix(1 0 0 -1 0 123)"
				width="280"
			/>
		</g>
		<g filter="url(#filter1_bf_5719_22815)">
			<rect
				fill="var(--color-theme-8)"
				fill-opacity="0.12"
				height="106"
				transform="matrix(1 0 0 -1 0 123)"
				width="280"
			/>
		</g>
		<g filter="url(#filter2_bf_5719_22815)">
			<rect
				fill="var(--color-theme-8)"
				fill-opacity="0.12"
				height="90"
				transform="matrix(1 0 0 -1 0 123)"
				width="280"
			/>
		</g>
		<g filter="url(#filter3_bf_5719_22815)">
			<rect
				fill="var(--color-theme-8)"
				fill-opacity="0.12"
				height="74"
				transform="matrix(1 0 0 -1 0 123)"
				width="280"
			/>
		</g>
		<g filter="url(#filter4_bf_5719_22815)">
			<rect
				fill="var(--color-theme-8)"
				fill-opacity="0.12"
				height="58"
				transform="matrix(1 0 0 -1 0 123)"
				width="280"
			/>
		</g>
		<g filter="url(#filter5_bf_5719_22815)">
			<rect
				fill="var(--color-theme-8)"
				fill-opacity="0.12"
				height="42"
				transform="matrix(1 0 0 -1 0 123)"
				width="280"
			/>
		</g>
		<defs>
			<filter
				id="filter0_bf_5719_22815"
				color-interpolation-filters="sRGB"
				filterUnits="userSpaceOnUse"
				height="124"
				width="282"
				x="-1"
				y="0"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feGaussianBlur
					in="BackgroundImageFix"
					stdDeviation="0.5"
				/>
				<feComposite
					in2="SourceAlpha"
					operator="in"
					result="effect1_backgroundBlur_5719_22815"
				/>
				<feBlend
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					mode="normal"
					result="shape"
				/>
				<feGaussianBlur
					result="effect2_foregroundBlur_5719_22815"
					stdDeviation="0.5"
				/>
			</filter>
			<filter
				id="filter1_bf_5719_22815"
				color-interpolation-filters="sRGB"
				filterUnits="userSpaceOnUse"
				height="110"
				width="284"
				x="-2"
				y="15"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feGaussianBlur
					in="BackgroundImageFix"
					stdDeviation="1"
				/>
				<feComposite
					in2="SourceAlpha"
					operator="in"
					result="effect1_backgroundBlur_5719_22815"
				/>
				<feBlend
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					mode="normal"
					result="shape"
				/>
				<feGaussianBlur
					result="effect2_foregroundBlur_5719_22815"
					stdDeviation="1"
				/>
			</filter>
			<filter
				id="filter2_bf_5719_22815"
				color-interpolation-filters="sRGB"
				filterUnits="userSpaceOnUse"
				height="96"
				width="286"
				x="-3"
				y="30"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feGaussianBlur
					in="BackgroundImageFix"
					stdDeviation="1.5"
				/>
				<feComposite
					in2="SourceAlpha"
					operator="in"
					result="effect1_backgroundBlur_5719_22815"
				/>
				<feBlend
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					mode="normal"
					result="shape"
				/>
				<feGaussianBlur
					result="effect2_foregroundBlur_5719_22815"
					stdDeviation="1.5"
				/>
			</filter>
			<filter
				id="filter3_bf_5719_22815"
				color-interpolation-filters="sRGB"
				filterUnits="userSpaceOnUse"
				height="82"
				width="288"
				x="-4"
				y="45"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feGaussianBlur
					in="BackgroundImageFix"
					stdDeviation="2"
				/>
				<feComposite
					in2="SourceAlpha"
					operator="in"
					result="effect1_backgroundBlur_5719_22815"
				/>
				<feBlend
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					mode="normal"
					result="shape"
				/>
				<feGaussianBlur
					result="effect2_foregroundBlur_5719_22815"
					stdDeviation="2"
				/>
			</filter>
			<filter
				id="filter4_bf_5719_22815"
				color-interpolation-filters="sRGB"
				filterUnits="userSpaceOnUse"
				height="68"
				width="290"
				x="-5"
				y="60"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feGaussianBlur
					in="BackgroundImageFix"
					stdDeviation="2.5"
				/>
				<feComposite
					in2="SourceAlpha"
					operator="in"
					result="effect1_backgroundBlur_5719_22815"
				/>
				<feBlend
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					mode="normal"
					result="shape"
				/>
				<feGaussianBlur
					result="effect2_foregroundBlur_5719_22815"
					stdDeviation="2.5"
				/>
			</filter>
			<filter
				id="filter5_bf_5719_22815"
				color-interpolation-filters="sRGB"
				filterUnits="userSpaceOnUse"
				height="54"
				width="292"
				x="-6"
				y="75"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feGaussianBlur
					in="BackgroundImageFix"
					stdDeviation="3"
				/>
				<feComposite
					in2="SourceAlpha"
					operator="in"
					result="effect1_backgroundBlur_5719_22815"
				/>
				<feBlend
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					mode="normal"
					result="shape"
				/>
				<feGaussianBlur
					result="effect2_foregroundBlur_5719_22815"
					stdDeviation="3"
				/>
			</filter>
		</defs>
	</svg>
</template>

<style scoped></style>
