// import { ref } from "vue";
// import router from "@/router";
//
// const hasRedirected = ref(false);
//
// const handleRedirects = (): Promise<void> => new Promise((resolve) => {
//
//     if (hasRedirected.value) {
//         resolve();
//         return;
//     }
//
//     const redirect_uri = location.search.includes('redirect_uri')
//         ? location.search.split('redirect_uri=')[1].split('&')[0]
//         : undefined;
//
//     if (redirect_uri) {
//         router.push(redirect_uri).then();
//         hasRedirected.value = true;
//
//         resolve();
//     } else {
//         resolve();
//     }
//
// });
//
// export default handleRedirects;