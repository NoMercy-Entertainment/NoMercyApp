<script lang="ts" setup>
// import {onMounted, ref} from 'vue';
// import axios from 'axios';
// import {useTranslation} from 'i18next-vue';
//
// import {type RegistrationResponse, TokenResponse} from '@/lib/auth/index.d';
//
// import promises from '@/router/middleware/beforeResolve';
// import {keepTokenFresh, refreshToken, storeTokens} from '@/lib/auth';
// import {useKeycloak} from '@/lib/keycloak';
// import router from '@/router';
// import {handlePromises} from '@/router/middleware/handlePromises';
// import ApiClient from '@/lib/clients/apiClient';
// import AppLogo from '@/components/Images/icons/AppLogo.vue';
// import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
//
// const {t} = useTranslation();
//
// const show = ref(false);
// const email = ref('');
// const password = ref('');
// const twoFactor = ref<string | undefined>();
// const tab = ref<'login' | 'register'>('login');
// const firstName = ref('');
// const lastName = ref('');
// const passwordConfirm = ref('');
// const username = ref('');
// const loading = ref<boolean>(false);
// const errorBucket = ref<{
//   type: string,
//   place: string;
//   message: string;
// }[]>([]);
// const registrationResponse = ref<RegistrationResponse>();
//
// onMounted(async () => {
//
//   const {isAuthenticated} = useKeycloak();
//
//   if (isAuthenticated.value) {
//     await router.replace('/');
//     return;
//   }
//
//   try {
//     await refreshToken();
//
//     keepTokenFresh();
//
//     isAuthenticated.value = true;
//
//   } catch (error) {
//     show.value = true;
//   }
// });
//
// const setTab = (value: 'login' | 'register') => {
//   tab.value = value;
// };
//
// const login = () => {
//
//   loading.value = true;
//   // axios.post<TokenResponse>(`https://auth${import.meta.env.VITE_DOMAIN_SUFFIX}.nomercy.tv/realms/NoMercyTV/protocol/openid-connect/token`, {
//   axios.post<TokenResponse>('https://auth-dev.nomercy.tv/realms/NoMercyTV/protocol/openid-connect/token', {
//     grant_type: 'password',
//     client_id: 'nomercy-ui',
//     scope: 'openid',
//     username: email.value,
//     password: password.value,
//     totp: twoFactor.value || undefined,
//   }, {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   }).then(async (response) => {
//     storeTokens(response.data);
//
//     keepTokenFresh();
//
//     await handlePromises(promises, () => router.replace('/'));
//
//     router.replace('/').then();
//   })
//       .catch((error) => {
//         loading.value = false;
//         console.log(error.response.data);
//         if (error.response.data.error_description === 'Account is not fully set up') {
//           errorBucket.value.push({
//             type: 'error',
//             place: 'login',
//             message: 'You need to verify your email first',
//           });
//         }
//
//       });
// };
//
// const register = () => {
//   loading.value = true;
//   if (password.value !== passwordConfirm.value) {
//     errorBucket.value.push({
//       type: 'error',
//       place: 'password',
//       message: 'Passwords do not match',
//     });
//     return;
//   }
//
//   ApiClient().post<RegistrationResponse>(`https://api${import.meta.env.VITE_DOMAIN_SUFFIX}.nomercy.tv/user/register`, {
//     email: email.value,
//     firstName: firstName.value,
//     lastName: lastName.value,
//     username: username.value,
//     password: password.value,
//   }, {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//   })
//       .then((response) => {
//         tab.value = 'login';
//
//         registrationResponse.value = response.data;
//
//         if (!response.data.emailVerified) {
//           errorBucket.value.push({
//             type: 'info',
//             place: 'login',
//             message: 'We have sent you an email to verify your account.',
//           });
//           return;
//         }
//
//         login();
//       })
//       .catch((error) => {
//         loading.value = false;
//         errorBucket.value.push({
//           type: 'error',
//           place: 'register',
//           message: error.response.data.errorMessage,
//         });
//         console.log(error);
//       });
//
// };
</script>

<template>
	<!--  <div v-if="show" -->
	<!--       class="flex h-screen w-screen flex-col flex-nowrap items-center justify-center gap-4 overflow-hidden p-8 bg-auto-50"> -->
	<!--    <div class="mx-12 flex"> -->
	<!--      <AppLogo class="h-12 w-full"/> -->
	<!--    </div> -->
	<!--    <div v-if="tab === 'login'" -->
	<!--         class="flex w-full flex-col gap-4"> -->
	<!--      <div class="pointer-events-auto flex w-full flex-col"> -->

	<!--        <Input id="email" -->
	<!--               v-model="email" -->
	<!--               name="Email" -->
	<!--        > -->
	<!--        </Input> -->

	<!--        <Input id="password" -->
	<!--               v-model="password" -->
	<!--               name="Password" -->
	<!--               type="password" -->
	<!--        > -->
	<!--        </Input> -->

	<!--        <Input id="twofactor" -->
	<!--               v-model="twoFactor" -->
	<!--               name="Two factor code" -->
	<!--               type="number" -->
	<!--        > -->
	<!--        </Input> -->
	<!--        <template v-if="errorBucket.some(e => e.place === 'login')"> -->
	<!--          <p :class="errorBucket.find(e => e.place === 'login')?.type === 'error' -->
	<!--                           ? 'text-red-600 dark:text-red-400' -->
	<!--                           : 'text-green-600 dark:text-green-400'" -->
	<!--             class="text-sm"> -->
	<!--            {{ t(errorBucket.find(e => e.place === 'login')?.message ?? '') }} -->
	<!--          </p> -->
	<!--        </template> -->
	<!--      </div> -->
	<!--      <div class="flex w-full flex-col gap-4"> -->
	<!--        <Button id="Login" -->
	<!--                :class="`flex gap-4 ${loading && 'last:children:animate-spin'}`" -->
	<!--                color="violet" -->
	<!--                @click="login"> -->
	<!--          <span class="">{{ t('Login') }}</span> -->
	<!--          <MoooomIcon icon="dataBaseRefresh" class="w-6 h-6"/> -->
	<!--        </Button> -->
	<!--      </div> -->
	<!--      <span class="text-center text-sm"> -->
	<!--                {{ t('Don\'t have an account') }}? <button :onclick="() => setTab('register')" -->
	<!--                                                           class="text-theme-500" id="register"> -->
	<!--                    <span>{{ t('Register') }}</span> -->
	<!--                </button> -->
	<!--            </span> -->
	<!--    </div> -->
	<!--    <div v-else -->
	<!--         class="flex w-full flex-col gap-4"> -->
	<!--      <div class="pointer-events-auto flex w-full flex-col"> -->

	<!--        <Input id="firstName" -->
	<!--               v-model="firstName" -->
	<!--               name="FirstName" -->
	<!--               @change-firstName="firstName = $event"> -->
	<!--        </Input> -->

	<!--        <Input id="lastName" -->
	<!--               v-model="lastName" -->
	<!--               name="LastName" -->
	<!--               @change-lastName="lastName = $event"> -->
	<!--        </Input> -->

	<!--        <Input id="username" -->
	<!--               v-model="username" -->
	<!--               name="Username" -->
	<!--               @change-username="username = $event"> -->
	<!--        </Input> -->

	<!--        <Input id="email" -->
	<!--               v-model="email" -->
	<!--               name="Email" -->
	<!--               @change-email="email = $event"> -->
	<!--        </Input> -->

	<!--        <Input id="password" -->
	<!--               v-model="password" -->
	<!--               name="Password" -->
	<!--               type="password" -->
	<!--               @change-password="password = $event"> -->
	<!--        </Input> -->

	<!--        <Input id="passwordConfirm" -->
	<!--               v-model="passwordConfirm" -->
	<!--               name="Confirm password" -->
	<!--               type="password" -->
	<!--               @change-passwordConfirm="passwordConfirm = $event"> -->
	<!--        </Input> -->

	<!--        <template v-if="errorBucket.some(e => e.place === 'register')"> -->
	<!--          <p :class="errorBucket.find(e => e.place === 'register')?.type === 'error' -->
	<!--                           ? 'text-red-600 dark:text-red-400' -->
	<!--                           : 'text-green-600 dark:text-green-400'" -->
	<!--             class="text-sm"> -->
	<!--            {{ t(errorBucket.find(e => e.place === 'register')?.message ?? '') }} -->
	<!--          </p> -->
	<!--        </template> -->
	<!--      </div> -->
	<!--      <div class="flex w-full flex-col gap-4"> -->
	<!--        <Button id="Register" -->
	<!--                color="theme" -->
	<!--                @click="register()"> -->
	<!--          {{ t('Register') }} -->
	<!--        </Button> -->
	<!--      </div> -->
	<!--      <span class="text-center text-sm"> -->
	<!--                {{ t('Already have an account') }}? <button id="login" :onclick="() => setTab('login')" -->
	<!--                                                            class="text-theme-500"> -->
	<!--                    {{ t('Login') }} -->
	<!--                </button> -->
	<!--            </span> -->
	<!--    </div> -->
	<!--  </div> -->
	<!--  <div v-else -->
	<!--       class="grid h-screen w-screen place-items-center"> -->

	<!--    <div role="status"> -->
	<!--      <span>{{ t('Loading') }}...</span> -->
	<!--    </div> -->
	<!--  </div> -->
</template>
