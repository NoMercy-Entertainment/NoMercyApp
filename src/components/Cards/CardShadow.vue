<script setup lang="ts">
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
		width="280"
		height="123"
		viewBox="0 0 280 123"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="none"
		:class="
			twMerge(
				'w-[280px] h-[122px] absolute left-0 top-[298px] blur-md z-20 z-0',
				className,
			)
		"
	>
		<g filter="url(#filter0_bf_5719_22815)">
			<rect
				width="280"
				height="122"
				transform="matrix(1 0 0 -1 0 123)"
				fill="rgb(var(--color-focus))"
				fill-opacity="0.12"
			/>
		</g>
		<g filter="url(#filter1_bf_5719_22815)">
			<rect
				width="280"
				height="106"
				transform="matrix(1 0 0 -1 0 123)"
				fill="rgb(var(--color-focus))"
				fill-opacity="0.12"
			/>
		</g>
		<g filter="url(#filter2_bf_5719_22815)">
			<rect
				width="280"
				height="90"
				transform="matrix(1 0 0 -1 0 123)"
				fill="rgb(var(--color-focus))"
				fill-opacity="0.12"
			/>
		</g>
		<g filter="url(#filter3_bf_5719_22815)">
			<rect
				width="280"
				height="74"
				transform="matrix(1 0 0 -1 0 123)"
				fill="rgb(var(--color-focus))"
				fill-opacity="0.12"
			/>
		</g>
		<g filter="url(#filter4_bf_5719_22815)">
			<rect
				width="280"
				height="58"
				transform="matrix(1 0 0 -1 0 123)"
				fill="rgb(var(--color-focus))"
				fill-opacity="0.12"
			/>
		</g>
		<g filter="url(#filter5_bf_5719_22815)">
			<rect
				width="280"
				height="42"
				transform="matrix(1 0 0 -1 0 123)"
				fill="rgb(var(--color-focus))"
				fill-opacity="0.12"
			/>
		</g>
		<defs>
			<filter
				id="filter0_bf_5719_22815"
				x="-1"
				y="0"
				width="282"
				height="124"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
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
					mode="normal"
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					result="shape"
				/>
				<feGaussianBlur
					stdDeviation="0.5"
					result="effect2_foregroundBlur_5719_22815"
				/>
			</filter>
			<filter
				id="filter1_bf_5719_22815"
				x="-2"
				y="15"
				width="284"
				height="110"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
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
					mode="normal"
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					result="shape"
				/>
				<feGaussianBlur
					stdDeviation="1"
					result="effect2_foregroundBlur_5719_22815"
				/>
			</filter>
			<filter
				id="filter2_bf_5719_22815"
				x="-3"
				y="30"
				width="286"
				height="96"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
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
					mode="normal"
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					result="shape"
				/>
				<feGaussianBlur
					stdDeviation="1.5"
					result="effect2_foregroundBlur_5719_22815"
				/>
			</filter>
			<filter
				id="filter3_bf_5719_22815"
				x="-4"
				y="45"
				width="288"
				height="82"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
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
					mode="normal"
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					result="shape"
				/>
				<feGaussianBlur
					stdDeviation="2"
					result="effect2_foregroundBlur_5719_22815"
				/>
			</filter>
			<filter
				id="filter4_bf_5719_22815"
				x="-5"
				y="60"
				width="290"
				height="68"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
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
					mode="normal"
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					result="shape"
				/>
				<feGaussianBlur
					stdDeviation="2.5"
					result="effect2_foregroundBlur_5719_22815"
				/>
			</filter>
			<filter
				id="filter5_bf_5719_22815"
				x="-6"
				y="75"
				width="292"
				height="54"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
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
					mode="normal"
					in="SourceGraphic"
					in2="effect1_backgroundBlur_5719_22815"
					result="shape"
				/>
				<feGaussianBlur
					stdDeviation="3"
					result="effect2_foregroundBlur_5719_22815"
				/>
			</filter>
		</defs>
	</svg>
</template>

<style scoped></style>
