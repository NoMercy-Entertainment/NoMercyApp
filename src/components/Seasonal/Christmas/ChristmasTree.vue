<script setup lang="ts">

import {onMounted} from "vue";
import sidebar from "@/store/sidebar";

// const getRandomArbitrary = (min: number, max: number) => {
//   return Math.random() * (max - min) + min;
// }

// const colors = [
//   "0deg 51.63137145448386%  93.92639352741541%",
//   "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
//   "0deg 48.746176194629754%  91.7177011895702%",
//   "0deg 66.99085788897199%  97.12791699505918%",
//   "0deg 54.438474975376884%  90.4219506848536%",
//   "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
//   "0deg 65.8799957034882%  92.47824947024873%",
//   "115.30281904608316deg 66.391855020869%  46.05582041796425%",
//   "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
//   "0deg 45.792047584110755%  94.89904859082304%",
//   "125.65301188160373deg 40.506531551923786%  59.655833590551296%",
//   "0deg 57.90098210321452%  99.22441916468446%",
//   "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
//   "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
//   "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
//   "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
//   "0deg 55.57820412831627%  92.19889108666375%",
//   "0deg 55.759929303066734%  97.23386413682329%",
//   "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
//   "0deg 58.6360751709761%  96.52065921875122%",
//   "125.43854206195701deg 51.873614175952234%  57.51025524342779%",
//   "0deg 62.45127944743773%  95.33695710684607%",
//   "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
//   "0deg 45.69882252391706%  91.08465011705404%"
// ];

const circles = [
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 5,
    "xPosition": 355.11889624056255,
    "yPosition": 28,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 78,
    "pulseDirection": "shrink",
    "pulseRate": 0.07711814853299809
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 20,
    "xPosition": 363.0219258751246,
    "yPosition": 56,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 59,
    "pulseDirection": "shrink",
    "pulseRate": 0.49875321505703635
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 22,
    "xPosition": 383.77932276105037,
    "yPosition": 56,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 61,
    "pulseDirection": "shrink",
    "pulseRate": 0.2730104416350314
  },
  {
    "radius": 17.007761556457083,
    "minRadius": 9,
    "maxRadius": 28,
    "xPosition": 332.4216206161039,
    "yPosition": 84,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.17408177296645885
  },
  {
    "radius": 3.2380825649998575,
    "minRadius": 3,
    "maxRadius": 5,
    "xPosition": 331.4356525904021,
    "yPosition": 84,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 48,
    "pulseDirection": "grow",
    "pulseRate": 0.11904128249992892
  },
  {
    "radius": 7,
    "minRadius": 7,
    "maxRadius": 2,
    "xPosition": 390.42828531781475,
    "yPosition": 84,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 83,
    "pulseDirection": "shrink",
    "pulseRate": 0.0062868363581918725
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 11,
    "xPosition": 329.8227742071831,
    "yPosition": 112,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 78,
    "pulseDirection": "shrink",
    "pulseRate": 0.20429185623295001
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 338.57056030698624,
    "yPosition": 112,
    "color": "0deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.05357837347543535
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 376.3108472531163,
    "yPosition": 112,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.13104740265506717
  },
  {
    "radius": 19.501701311227762,
    "minRadius": 13,
    "maxRadius": 24,
    "xPosition": 359.94155999556716,
    "yPosition": 112,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 63,
    "pulseDirection": "shrink",
    "pulseRate": 0.3612056284015429
  },
  {
    "radius": 16,
    "minRadius": 16,
    "maxRadius": 3,
    "xPosition": 355.02312503825834,
    "yPosition": 140,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 26,
    "pulseDirection": "shrink",
    "pulseRate": 0.4178104003763676
  },
  {
    "radius": 11.455161324276604,
    "minRadius": 2,
    "maxRadius": 16,
    "xPosition": 394.5533547497397,
    "yPosition": 140,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 29,
    "pulseDirection": "shrink",
    "pulseRate": 0.2780929801257826
  },
  {
    "radius": 13.58562888808475,
    "minRadius": 8,
    "maxRadius": 25,
    "xPosition": 417.74466368347566,
    "yPosition": 140,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 47,
    "pulseDirection": "grow",
    "pulseRate": 0.0435955683223266
  },
  {
    "radius": 20,
    "minRadius": 20,
    "maxRadius": 4,
    "xPosition": 398.87484726982,
    "yPosition": 140,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 39,
    "pulseDirection": "shrink",
    "pulseRate": 0.023451195977437125
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 25,
    "xPosition": 330.1217144439343,
    "yPosition": 140,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 36,
    "pulseDirection": "shrink",
    "pulseRate": 0.1415471560676617
  },
  {
    "radius": 23,
    "minRadius": 23,
    "maxRadius": 26,
    "xPosition": 414.62464316826504,
    "yPosition": 168,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 23,
    "pulseDirection": "shrink",
    "pulseRate": 0.46037341424211425
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 21,
    "xPosition": 305.820486152879,
    "yPosition": 168,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 21,
    "pulseDirection": "shrink",
    "pulseRate": 0.49623454781259096
  },
  {
    "radius": 27.219817062245973,
    "minRadius": 25,
    "maxRadius": 28,
    "xPosition": 369.6747970810028,
    "yPosition": 168,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 83,
    "pulseDirection": "grow",
    "pulseRate": 0.15855836158899722
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 9,
    "xPosition": 395.48256345406577,
    "yPosition": 168,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 63,
    "pulseDirection": "shrink",
    "pulseRate": 0.4068134623482429
  },
  {
    "radius": 28,
    "minRadius": 28,
    "maxRadius": 27,
    "xPosition": 335.1140513320043,
    "yPosition": 168,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 37,
    "pulseDirection": "shrink",
    "pulseRate": 0.11960315188464438
  },
  {
    "radius": 18.0815441663051,
    "minRadius": 17,
    "maxRadius": 19,
    "xPosition": 323.3627613007242,
    "yPosition": 168,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 43,
    "pulseDirection": "grow",
    "pulseRate": 0.5407720831525488
  },
  {
    "radius": 26,
    "minRadius": 26,
    "maxRadius": 23,
    "xPosition": 379.94308020706484,
    "yPosition": 196,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 73,
    "pulseDirection": "shrink",
    "pulseRate": 0.15618390713849387
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 13,
    "xPosition": 317.62009484613384,
    "yPosition": 196,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 54,
    "pulseDirection": "shrink",
    "pulseRate": 0.3991083825817077
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 17,
    "xPosition": 448.57323766906654,
    "yPosition": 196,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 48,
    "pulseDirection": "shrink",
    "pulseRate": 0.4520841971501122
  },
  {
    "radius": 26,
    "minRadius": 26,
    "maxRadius": 16,
    "xPosition": 391.1289117328834,
    "yPosition": 196,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.21611483500220244
  },
  {
    "radius": 9,
    "minRadius": 9,
    "maxRadius": 3,
    "xPosition": 395.4591459526775,
    "yPosition": 196,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.19008841982892027
  },
  {
    "radius": 11.823898981197189,
    "minRadius": 10,
    "maxRadius": 22,
    "xPosition": 338.6374026754911,
    "yPosition": 196,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 61,
    "pulseDirection": "grow",
    "pulseRate": 0.4559747452992971
  },
  {
    "radius": 13.205800570291736,
    "minRadius": 9,
    "maxRadius": 19,
    "xPosition": 346.0844172304401,
    "yPosition": 196,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 52,
    "pulseDirection": "shrink",
    "pulseRate": 0.2102900285145875
  },
  {
    "radius": 6.411562970844571,
    "minRadius": 5,
    "maxRadius": 8,
    "xPosition": 418.3026850646465,
    "yPosition": 224,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 61,
    "pulseDirection": "shrink",
    "pulseRate": 0.352890742711143
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 384.785561767112,
    "yPosition": 224,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.06965936599186096
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 301.6119049922363,
    "yPosition": 224,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.3278682923901374
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 10,
    "xPosition": 415.9340149282093,
    "yPosition": 224,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 24,
    "pulseDirection": "shrink",
    "pulseRate": 0.05677283842303683
  },
  {
    "radius": 20,
    "minRadius": 20,
    "maxRadius": 21,
    "xPosition": 352.9917463075142,
    "yPosition": 224,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 73,
    "pulseDirection": "shrink",
    "pulseRate": 0.4616126583179
  },
  {
    "radius": 25.386929885519635,
    "minRadius": 8,
    "maxRadius": 26,
    "xPosition": 381.9683008055151,
    "yPosition": 224,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 85,
    "pulseDirection": "shrink",
    "pulseRate": 0.12116831178449784
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 27,
    "xPosition": 410.5214076027364,
    "yPosition": 224,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 63,
    "pulseDirection": "shrink",
    "pulseRate": 0.32920672186425437
  },
  {
    "radius": 18.00416809929794,
    "minRadius": 14,
    "maxRadius": 19,
    "xPosition": 419.4742458307067,
    "yPosition": 224,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 48,
    "pulseDirection": "grow",
    "pulseRate": 0.3336806749414953
  },
  {
    "radius": 17.66031846127953,
    "minRadius": 12,
    "maxRadius": 20,
    "xPosition": 258.97310529254787,
    "yPosition": 252,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 69,
    "pulseDirection": "shrink",
    "pulseRate": 0.2572872027854328
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 4,
    "xPosition": 415.8089027356736,
    "yPosition": 252,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 84,
    "pulseDirection": "shrink",
    "pulseRate": 0.27362369465153896
  },
  {
    "radius": 17.00694948829445,
    "minRadius": 15,
    "maxRadius": 17,
    "xPosition": 390.41963107038725,
    "yPosition": 252,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 85,
    "pulseDirection": "shrink",
    "pulseRate": 0.5017373720736116
  },
  {
    "radius": 14.322398864569543,
    "minRadius": 14,
    "maxRadius": 15,
    "xPosition": 341.9023022459354,
    "yPosition": 252,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 55,
    "pulseDirection": "grow",
    "pulseRate": 0.08059971614238565
  },
  {
    "radius": 16.853753872969598,
    "minRadius": 11,
    "maxRadius": 27,
    "xPosition": 400.47581513451416,
    "yPosition": 252,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 58,
    "pulseDirection": "grow",
    "pulseRate": 0.41812527664068566
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 328.3567331646342,
    "yPosition": 252,
    "color": "220deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.01735848914861643
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 26,
    "xPosition": 309.4709388896426,
    "yPosition": 252,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 59,
    "pulseDirection": "shrink",
    "pulseRate": 0.37718605460648275
  },
  {
    "radius": 17.026854539483736,
    "minRadius": 2,
    "maxRadius": 18,
    "xPosition": 327.5809428233682,
    "yPosition": 252,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 34,
    "pulseDirection": "shrink",
    "pulseRate": 0.09886088512818252
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 312.7051706173974,
    "yPosition": 252,
    "color": "0deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.056597340980438865
  },
  {
    "radius": 15.890687697675643,
    "minRadius": 9,
    "maxRadius": 17,
    "xPosition": 349.2269809286538,
    "yPosition": 280,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 81,
    "pulseDirection": "shrink",
    "pulseRate": 0.4306679811047275
  },
  {
    "radius": 14.36883440579669,
    "minRadius": 13,
    "maxRadius": 22,
    "xPosition": 250.36560925195027,
    "yPosition": 280,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 65,
    "pulseDirection": "grow",
    "pulseRate": 0.342208601449172
  },
  {
    "radius": 13.023224293779727,
    "minRadius": 12,
    "maxRadius": 23,
    "xPosition": 350.0643687406072,
    "yPosition": 280,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 29,
    "pulseDirection": "shrink",
    "pulseRate": 0.2558060734449309
  },
  {
    "radius": 28,
    "minRadius": 28,
    "maxRadius": 28,
    "xPosition": 371.63753047007447,
    "yPosition": 280,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 65,
    "pulseDirection": "grow",
    "pulseRate": 0.3395496625407987
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 23,
    "xPosition": 313.9139505562433,
    "yPosition": 280,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 84,
    "pulseDirection": "shrink",
    "pulseRate": 0.4510784856417347
  },
  {
    "radius": 7.2102614268951015,
    "minRadius": 5,
    "maxRadius": 11,
    "xPosition": 245.20763241504773,
    "yPosition": 280,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 33,
    "pulseDirection": "shrink",
    "pulseRate": 0.36837690448251686
  },
  {
    "radius": 10.203441881794799,
    "minRadius": 8,
    "maxRadius": 15,
    "xPosition": 293.83653001635173,
    "yPosition": 280,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 34,
    "pulseDirection": "grow",
    "pulseRate": 0.3672403136324668
  },
  {
    "radius": 11.578295144587232,
    "minRadius": 5,
    "maxRadius": 12,
    "xPosition": 443.2553199059139,
    "yPosition": 280,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 80,
    "pulseDirection": "grow",
    "pulseRate": 0.2990134156630559
  },
  {
    "radius": 13.984629587784122,
    "minRadius": 8,
    "maxRadius": 15,
    "xPosition": 275.7547240361996,
    "yPosition": 280,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 80,
    "pulseDirection": "shrink",
    "pulseRate": 0.05785963469408755
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 9,
    "xPosition": 444.58499000900576,
    "yPosition": 280,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 88,
    "pulseDirection": "shrink",
    "pulseRate": 0.42076688565949977
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 15,
    "xPosition": 259.4745796459456,
    "yPosition": 308,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 61,
    "pulseDirection": "shrink",
    "pulseRate": 0.3836118914204216
  },
  {
    "radius": 6.186732735976943,
    "minRadius": 3,
    "maxRadius": 24,
    "xPosition": 326.88524548991074,
    "yPosition": 308,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 55,
    "pulseDirection": "shrink",
    "pulseRate": 0.22762376685549568
  },
  {
    "radius": 13.75616989508432,
    "minRadius": 9,
    "maxRadius": 27,
    "xPosition": 477.36767772783895,
    "yPosition": 308,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 88,
    "pulseDirection": "grow",
    "pulseRate": 0.02733430974186354
  },
  {
    "radius": 6.499619477079645,
    "minRadius": 8,
    "maxRadius": 10,
    "xPosition": 268.24988792282124,
    "yPosition": 308,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 45,
    "pulseDirection": "grow",
    "pulseRate": 0.24980973853982294
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 11,
    "xPosition": 487.06393011884717,
    "yPosition": 308,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 62,
    "pulseDirection": "shrink",
    "pulseRate": 0.3334338250294128
  },
  {
    "radius": 7.000000000000001,
    "minRadius": 7,
    "maxRadius": 20,
    "xPosition": 359.71138133955344,
    "yPosition": 308,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 57,
    "pulseDirection": "shrink",
    "pulseRate": 0.4780711646007814
  },
  {
    "radius": 13.878690219293112,
    "minRadius": 11,
    "maxRadius": 18,
    "xPosition": 353.6089076531073,
    "yPosition": 308,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 46,
    "pulseDirection": "grow",
    "pulseRate": 0.016544196662604673
  },
  {
    "radius": 2.638614907991329,
    "minRadius": 2,
    "maxRadius": 7,
    "xPosition": 486.5230553598078,
    "yPosition": 308,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 30,
    "pulseDirection": "grow",
    "pulseRate": 0.3193074539956644
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 15,
    "xPosition": 348.6117816635907,
    "yPosition": 308,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 74,
    "pulseDirection": "shrink",
    "pulseRate": 0.045358415923726
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 19,
    "xPosition": 327.6814910107802,
    "yPosition": 308,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 69,
    "pulseDirection": "shrink",
    "pulseRate": 0.037254246514606564
  },
  {
    "radius": 23.41601315816454,
    "minRadius": 7,
    "maxRadius": 27,
    "xPosition": 299.883259411962,
    "yPosition": 308,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 64,
    "pulseDirection": "grow",
    "pulseRate": 0.32832026316329044
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 503.56408398158555,
    "yPosition": 336,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.5004615845900284
  },
  {
    "radius": 20,
    "minRadius": 20,
    "maxRadius": 13,
    "xPosition": 406.6769262704902,
    "yPosition": 336,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.43044769573382313
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 290.7039920589349,
    "yPosition": 336,
    "color": "220deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.0490825524355532
  },
  {
    "radius": 23.026433680428084,
    "minRadius": 21,
    "maxRadius": 26,
    "xPosition": 379.9365591353881,
    "yPosition": 336,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 40,
    "pulseDirection": "shrink",
    "pulseRate": 0.16886947336900673
  },
  {
    "radius": 24.537141643351713,
    "minRadius": 8,
    "maxRadius": 26,
    "xPosition": 386.86379861489996,
    "yPosition": 336,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 41,
    "pulseDirection": "grow",
    "pulseRate": 0.30624336376577177
  },
  {
    "radius": 5.465002334828004,
    "minRadius": 3,
    "maxRadius": 8,
    "xPosition": 370.9100853082205,
    "yPosition": 336,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.044017898836214125
  },
  {
    "radius": 9.920338422075808,
    "minRadius": 9,
    "maxRadius": 12,
    "xPosition": 477.3910897223119,
    "yPosition": 336,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 35,
    "pulseDirection": "shrink",
    "pulseRate": 0.23008460551895274
  },
  {
    "radius": 23,
    "minRadius": 23,
    "maxRadius": 7,
    "xPosition": 449.4368740427996,
    "yPosition": 336,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 79,
    "pulseDirection": "shrink",
    "pulseRate": 0.18243873163486732
  },
  {
    "radius": 17.5485766315738,
    "minRadius": 7,
    "maxRadius": 25,
    "xPosition": 224.7447902063655,
    "yPosition": 336,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 31,
    "pulseDirection": "shrink",
    "pulseRate": 0.14650800877185813
  },
  {
    "radius": 14,
    "minRadius": 14,
    "maxRadius": 4,
    "xPosition": 254.2392206215959,
    "yPosition": 336,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 22,
    "pulseDirection": "shrink",
    "pulseRate": 0.01768666011453751
  },
  {
    "radius": 20.922261755905225,
    "minRadius": 20,
    "maxRadius": 22,
    "xPosition": 243.37446388158924,
    "yPosition": 336,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 59,
    "pulseDirection": "shrink",
    "pulseRate": 0.23056543897630588
  },
  {
    "radius": 10,
    "minRadius": 10,
    "maxRadius": 8,
    "xPosition": 322.20782553311346,
    "yPosition": 336,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.4430327692657248
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 5,
    "xPosition": 421.8928832208303,
    "yPosition": 364,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 27,
    "pulseDirection": "shrink",
    "pulseRate": 0.22941923636762832
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 16,
    "xPosition": 211.8830527484044,
    "yPosition": 364,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 45,
    "pulseDirection": "shrink",
    "pulseRate": 0.22304903176039395
  },
  {
    "radius": 9,
    "minRadius": 9,
    "maxRadius": 13,
    "xPosition": 330.4234461294667,
    "yPosition": 364,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 25,
    "pulseDirection": "shrink",
    "pulseRate": 0.42798901037053216
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 18,
    "xPosition": 450.5039586684829,
    "yPosition": 364,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 40,
    "pulseDirection": "shrink",
    "pulseRate": 0.4370614388855921
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 5,
    "xPosition": 464.29222564867547,
    "yPosition": 364,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 45,
    "pulseDirection": "shrink",
    "pulseRate": 0.1721193213447359
  },
  {
    "radius": 26,
    "minRadius": 26,
    "maxRadius": 8,
    "xPosition": 386.75530362743245,
    "yPosition": 364,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 26,
    "pulseDirection": "shrink",
    "pulseRate": 0.09734162052963925
  },
  {
    "radius": 19,
    "minRadius": 19,
    "maxRadius": 10,
    "xPosition": 474.56037998049965,
    "yPosition": 364,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.10242355484750779
  },
  {
    "radius": 9.689167799714227,
    "minRadius": 8,
    "maxRadius": 16,
    "xPosition": 248.97385451567345,
    "yPosition": 364,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 82,
    "pulseDirection": "shrink",
    "pulseRate": 0.28152796661903745
  },
  {
    "radius": 19,
    "minRadius": 19,
    "maxRadius": 8,
    "xPosition": 384.5704109795093,
    "yPosition": 364,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 57,
    "pulseDirection": "shrink",
    "pulseRate": 0.01056638690345717
  },
  {
    "radius": 20,
    "minRadius": 20,
    "maxRadius": 20,
    "xPosition": 349.94777663928824,
    "yPosition": 364,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 53,
    "pulseDirection": "grow",
    "pulseRate": 0.10094577692477384
  },
  {
    "radius": 19,
    "minRadius": 19,
    "maxRadius": 9,
    "xPosition": 233.20815015438563,
    "yPosition": 364,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 49,
    "pulseDirection": "shrink",
    "pulseRate": 0.3585665646134046
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 20,
    "xPosition": 360.3042378720238,
    "yPosition": 364,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 39,
    "pulseDirection": "shrink",
    "pulseRate": 0.36327422214413607
  },
  {
    "radius": 10,
    "minRadius": 10,
    "maxRadius": 4,
    "xPosition": 434.90918900556426,
    "yPosition": 364,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 44,
    "pulseDirection": "shrink",
    "pulseRate": 0.13108147071391174
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 23,
    "xPosition": 299.5997092426685,
    "yPosition": 392,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 38,
    "pulseDirection": "shrink",
    "pulseRate": 0.5211827960115255
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 229.95651160647287,
    "yPosition": 392,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.4543035097437915
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 12,
    "xPosition": 318.99211952423707,
    "yPosition": 392,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 33,
    "pulseDirection": "shrink",
    "pulseRate": 0.43858019453304015
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 8,
    "xPosition": 490.61684084143326,
    "yPosition": 392,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 25,
    "pulseDirection": "shrink",
    "pulseRate": 0.27026141710793883
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 5,
    "xPosition": 290.28846866382014,
    "yPosition": 392,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 28,
    "pulseDirection": "shrink",
    "pulseRate": 0.0870018908977108
  },
  {
    "radius": 23.557676442145763,
    "minRadius": 20,
    "maxRadius": 26,
    "xPosition": 334.9718858822712,
    "yPosition": 392,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 52,
    "pulseDirection": "shrink",
    "pulseRate": 0.19764869123031967
  },
  {
    "radius": 5,
    "minRadius": 5,
    "maxRadius": 4,
    "xPosition": 443.8938169260129,
    "yPosition": 392,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 38,
    "pulseDirection": "shrink",
    "pulseRate": 0.2009325184467966
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 320.72167814524346,
    "yPosition": 392,
    "color": "0deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.1615243714064969
  },
  {
    "radius": 26.887976980578728,
    "minRadius": 25,
    "maxRadius": 27,
    "xPosition": 237.05388965335567,
    "yPosition": 392,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 81,
    "pulseDirection": "shrink",
    "pulseRate": 0.03630724962651419
  },
  {
    "radius": 15.848072211569695,
    "minRadius": 15,
    "maxRadius": 27,
    "xPosition": 232.35136030547426,
    "yPosition": 392,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 41,
    "pulseDirection": "shrink",
    "pulseRate": 0.42403610578484824
  },
  {
    "radius": 17.364815217394096,
    "minRadius": 4,
    "maxRadius": 21,
    "xPosition": 230.3994443297354,
    "yPosition": 392,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 47,
    "pulseDirection": "grow",
    "pulseRate": 0.2784336503623771
  },
  {
    "radius": 26.577082991616592,
    "minRadius": 26,
    "maxRadius": 27,
    "xPosition": 287.5466129217252,
    "yPosition": 392,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 27,
    "pulseDirection": "grow",
    "pulseRate": 0.28854149580829525
  },
  {
    "radius": 13,
    "minRadius": 13,
    "maxRadius": 12,
    "xPosition": 504.4887688041829,
    "yPosition": 392,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 30,
    "pulseDirection": "shrink",
    "pulseRate": 0.11573183646147168
  },
  {
    "radius": 16.64312684081645,
    "minRadius": 13,
    "maxRadius": 22,
    "xPosition": 341.3586499798706,
    "yPosition": 392,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 54,
    "pulseDirection": "shrink",
    "pulseRate": 0.30359390340136994
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 15,
    "xPosition": 313.92517294793623,
    "yPosition": 420,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 34,
    "pulseDirection": "shrink",
    "pulseRate": 0.2837753202623696
  },
  {
    "radius": 15,
    "minRadius": 15,
    "maxRadius": 5,
    "xPosition": 414.0240096378408,
    "yPosition": 420,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 27,
    "pulseDirection": "shrink",
    "pulseRate": 0.103569448098335
  },
  {
    "radius": 15.455404807077912,
    "minRadius": 8,
    "maxRadius": 22,
    "xPosition": 246.82379271834333,
    "yPosition": 420,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 55,
    "pulseDirection": "grow",
    "pulseRate": 0.42979112759445093
  },
  {
    "radius": 13.70322138785783,
    "minRadius": 12,
    "maxRadius": 14,
    "xPosition": 335.9584329777252,
    "yPosition": 420,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 63,
    "pulseDirection": "shrink",
    "pulseRate": 0.28387023130963795
  },
  {
    "radius": 28,
    "minRadius": 28,
    "maxRadius": 4,
    "xPosition": 449.5416520262427,
    "yPosition": 420,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 40,
    "pulseDirection": "shrink",
    "pulseRate": 0.5496070495125875
  },
  {
    "radius": 16.425910948360112,
    "minRadius": 10,
    "maxRadius": 20,
    "xPosition": 371.270721604439,
    "yPosition": 420,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 62,
    "pulseDirection": "grow",
    "pulseRate": 0.03735994737418692
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 339.21624679735,
    "yPosition": 420,
    "color": "220deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.3779118617140465
  },
  {
    "radius": 10,
    "minRadius": 10,
    "maxRadius": 7,
    "xPosition": 327.6311247879417,
    "yPosition": 420,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 73,
    "pulseDirection": "shrink",
    "pulseRate": 0.09286590118544256
  },
  {
    "radius": 19.987866404631347,
    "minRadius": 19,
    "maxRadius": 20,
    "xPosition": 403.3833806075455,
    "yPosition": 420,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 58,
    "pulseDirection": "shrink",
    "pulseRate": 0.2469666011578366
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 2,
    "xPosition": 305.20385283905836,
    "yPosition": 420,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 21,
    "pulseDirection": "shrink",
    "pulseRate": 0.22119546949381919
  },
  {
    "radius": 4,
    "minRadius": 4,
    "maxRadius": 3,
    "xPosition": 351.5054168059144,
    "yPosition": 420,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 67,
    "pulseDirection": "shrink",
    "pulseRate": 0.4222049499673825
  },
  {
    "radius": 11.450987935216746,
    "minRadius": 3,
    "maxRadius": 12,
    "xPosition": 352.0834319939895,
    "yPosition": 420,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 41,
    "pulseDirection": "shrink",
    "pulseRate": 0.528186745951047
  },
  {
    "radius": 10,
    "minRadius": 10,
    "maxRadius": 8,
    "xPosition": 212.30803863758433,
    "yPosition": 420,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 24,
    "pulseDirection": "shrink",
    "pulseRate": 0.3406371397412105
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 253.6011304518815,
    "yPosition": 420,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.4899247873531068
  },
  {
    "radius": 21.61121848173417,
    "minRadius": 5,
    "maxRadius": 22,
    "xPosition": 283.74265403669585,
    "yPosition": 420,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 38,
    "pulseDirection": "grow",
    "pulseRate": 0.4885652494627692
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 527.6916846649212,
    "yPosition": 448,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.3416294448216256
  },
  {
    "radius": 15.728972140663302,
    "minRadius": 15,
    "maxRadius": 16,
    "xPosition": 537.4909345692057,
    "yPosition": 448,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 61,
    "pulseDirection": "shrink",
    "pulseRate": 0.36448607033165076
  },
  {
    "radius": 25.936191000554032,
    "minRadius": 13,
    "maxRadius": 26,
    "xPosition": 181.6873724177409,
    "yPosition": 448,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 27,
    "pulseDirection": "shrink",
    "pulseRate": 0.07521041279391996
  },
  {
    "radius": 15,
    "minRadius": 15,
    "maxRadius": 5,
    "xPosition": 241.61691063202193,
    "yPosition": 448,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 51,
    "pulseDirection": "shrink",
    "pulseRate": 0.13049848713624823
  },
  {
    "radius": 15.121224942701204,
    "minRadius": 11,
    "maxRadius": 22,
    "xPosition": 349.328776033685,
    "yPosition": 448,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 81,
    "pulseDirection": "shrink",
    "pulseRate": 0.5151531178376513
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 549.1215413871647,
    "yPosition": 448,
    "color": "0deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.5488577959362467
  },
  {
    "radius": 15.162585650029143,
    "minRadius": 9,
    "maxRadius": 27,
    "xPosition": 377.1280928236936,
    "yPosition": 448,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 82,
    "pulseDirection": "shrink",
    "pulseRate": 0.3851616031268217
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 21,
    "xPosition": 408.63824350836467,
    "yPosition": 448,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 40,
    "pulseDirection": "shrink",
    "pulseRate": 0.10790478819234618
  },
  {
    "radius": 12.173125191172822,
    "minRadius": 10,
    "maxRadius": 19,
    "xPosition": 351.23823252623157,
    "yPosition": 448,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 73,
    "pulseDirection": "shrink",
    "pulseRate": 0.5432812977932049
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 3,
    "xPosition": 266.33327069039547,
    "yPosition": 448,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 26,
    "pulseDirection": "shrink",
    "pulseRate": 0.531513975394776
  },
  {
    "radius": 14.425061932705411,
    "minRadius": 4,
    "maxRadius": 19,
    "xPosition": 390.5595155927972,
    "yPosition": 448,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 83,
    "pulseDirection": "shrink",
    "pulseRate": 0.2895850536862611
  },
  {
    "radius": 25.841585932868924,
    "minRadius": 21,
    "maxRadius": 27,
    "xPosition": 486.6188157247819,
    "yPosition": 448,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 74,
    "pulseDirection": "shrink",
    "pulseRate": 0.04173780976611058
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 23,
    "xPosition": 238.00459625714427,
    "yPosition": 448,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 80,
    "pulseDirection": "shrink",
    "pulseRate": 0.1254661325219958
  },
  {
    "radius": 20.25158017361315,
    "minRadius": 17,
    "maxRadius": 26,
    "xPosition": 467.94206559063383,
    "yPosition": 448,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 51,
    "pulseDirection": "grow",
    "pulseRate": 0.01890453589309972
  },
  {
    "radius": 23,
    "minRadius": 23,
    "maxRadius": 23,
    "xPosition": 451.2345115787599,
    "yPosition": 448,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 34,
    "pulseDirection": "shrink",
    "pulseRate": 0.22134128356532842
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 378.73327842657994,
    "yPosition": 448,
    "color": "220deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.1155692078304112
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 312.4807385927412,
    "yPosition": 476,
    "color": "0deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.4890939531642916
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 4,
    "xPosition": 168.37301751119492,
    "yPosition": 476,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 82,
    "pulseDirection": "shrink",
    "pulseRate": 0.3239395868478656
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 25,
    "xPosition": 416.5140823205509,
    "yPosition": 476,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 78,
    "pulseDirection": "shrink",
    "pulseRate": 0.03853262879432284
  },
  {
    "radius": 26,
    "minRadius": 26,
    "maxRadius": 2,
    "xPosition": 330.45799555494966,
    "yPosition": 476,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 40,
    "pulseDirection": "shrink",
    "pulseRate": 0.26615035024157385
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 8,
    "xPosition": 371.7551193026737,
    "yPosition": 476,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 53,
    "pulseDirection": "shrink",
    "pulseRate": 0.41193563599692307
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 522.1143103967856,
    "yPosition": 476,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.5227910628005473
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 8,
    "xPosition": 196.30096499996358,
    "yPosition": 476,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 80,
    "pulseDirection": "shrink",
    "pulseRate": 0.015805141284860783
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 16,
    "xPosition": 496.7943854384131,
    "yPosition": 476,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 57,
    "pulseDirection": "shrink",
    "pulseRate": 0.2822480249294551
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 378.80769692055924,
    "yPosition": 476,
    "color": "220deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.11164696706289262
  },
  {
    "radius": 8.531612473533793,
    "minRadius": 8,
    "maxRadius": 19,
    "xPosition": 223.56663756722185,
    "yPosition": 476,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 60,
    "pulseDirection": "grow",
    "pulseRate": 0.13290311838344826
  },
  {
    "radius": 22.154936568416694,
    "minRadius": 5,
    "maxRadius": 25,
    "xPosition": 515.9624899418875,
    "yPosition": 476,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 40,
    "pulseDirection": "shrink",
    "pulseRate": 0.13196105052628193
  },
  {
    "radius": 11,
    "minRadius": 11,
    "maxRadius": 11,
    "xPosition": 353.31683393443734,
    "yPosition": 476,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 84,
    "pulseDirection": "grow",
    "pulseRate": 0.0039729338869612385
  },
  {
    "radius": 6.000000000000002,
    "minRadius": 8,
    "maxRadius": 16,
    "xPosition": 566.1537573686802,
    "yPosition": 476,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 69,
    "pulseDirection": "grow",
    "pulseRate": 0.3603066994871458
  },
  {
    "radius": 11.881322590805539,
    "minRadius": 11,
    "maxRadius": 20,
    "xPosition": 464.6874034150835,
    "yPosition": 476,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 78,
    "pulseDirection": "grow",
    "pulseRate": 0.22033064770138502
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 213.6551436467476,
    "yPosition": 476,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.47189148959910787
  },
  {
    "radius": 9,
    "minRadius": 9,
    "maxRadius": 5,
    "xPosition": 181.77197599721325,
    "yPosition": 476,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 85,
    "pulseDirection": "shrink",
    "pulseRate": 0.04292180142199941
  },
  {
    "radius": 23,
    "minRadius": 23,
    "maxRadius": 8,
    "xPosition": 199.5878321815614,
    "yPosition": 476,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 43,
    "pulseDirection": "shrink",
    "pulseRate": 0.29439153380365163
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 187.7664086852235,
    "yPosition": 504,
    "color": "0deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.5253015018908577
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 528.4012785757213,
    "yPosition": 504,
    "color": "220deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.4793629667067413
  },
  {
    "radius": 11.85766574737363,
    "minRadius": 11,
    "maxRadius": 14,
    "xPosition": 413.42821858134954,
    "yPosition": 504,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 25,
    "pulseDirection": "shrink",
    "pulseRate": 0.21441643684340697
  },
  {
    "radius": 5.845262955368501,
    "minRadius": 5,
    "maxRadius": 12,
    "xPosition": 385.2725543282985,
    "yPosition": 504,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 22,
    "pulseDirection": "grow",
    "pulseRate": 0.004914319507956045
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 10,
    "xPosition": 520.0084895076362,
    "yPosition": 504,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 47,
    "pulseDirection": "shrink",
    "pulseRate": 0.03253459663014774
  },
  {
    "radius": 9.753423973291262,
    "minRadius": 2,
    "maxRadius": 16,
    "xPosition": 440.4515694273735,
    "yPosition": 504,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 88,
    "pulseDirection": "grow",
    "pulseRate": 0.3876711986645632
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 495.3653803918002,
    "yPosition": 504,
    "color": "220deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.5097379869512504
  },
  {
    "radius": 9.191641808591783,
    "minRadius": 8,
    "maxRadius": 11,
    "xPosition": 213.5163523542281,
    "yPosition": 504,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 86,
    "pulseDirection": "grow",
    "pulseRate": 0.29791045214794476
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 26,
    "xPosition": 572.8281159897105,
    "yPosition": 504,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 43,
    "pulseDirection": "grow",
    "pulseRate": 0.534798994455934
  },
  {
    "radius": 19.985077969072357,
    "minRadius": 14,
    "maxRadius": 27,
    "xPosition": 474.1415299119535,
    "yPosition": 504,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 35,
    "pulseDirection": "shrink",
    "pulseRate": 0.27204899859419857
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 274.2534504127533,
    "yPosition": 504,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.21026874765916553
  },
  {
    "radius": 28,
    "minRadius": 28,
    "maxRadius": 8,
    "xPosition": 196.63097575948802,
    "yPosition": 504,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 31,
    "pulseDirection": "shrink",
    "pulseRate": 0.39406424828956477
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 4,
    "xPosition": 229.6987710424645,
    "yPosition": 504,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 59,
    "pulseDirection": "shrink",
    "pulseRate": 0.3226442550145598
  },
  {
    "radius": 17.694779233055307,
    "minRadius": 3,
    "maxRadius": 26,
    "xPosition": 222.5625348831519,
    "yPosition": 504,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 25,
    "pulseDirection": "shrink",
    "pulseRate": 0.18368474041319097
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 9,
    "xPosition": 396.90245278593153,
    "yPosition": 504,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 57,
    "pulseDirection": "shrink",
    "pulseRate": 0.4066353360773012
  },
  {
    "radius": 22.70376815800384,
    "minRadius": 20,
    "maxRadius": 25,
    "xPosition": 492.5681414073143,
    "yPosition": 504,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 28,
    "pulseDirection": "grow",
    "pulseRate": 0.07510467105566353
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 7,
    "xPosition": 296.87034165007276,
    "yPosition": 504,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 49,
    "pulseDirection": "shrink",
    "pulseRate": 0.5276948213629498
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 12,
    "xPosition": 562.6922120417781,
    "yPosition": 504,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 40,
    "pulseDirection": "shrink",
    "pulseRate": 0.30885711233298524
  },
  {
    "radius": 19.517104432494765,
    "minRadius": 7,
    "maxRadius": 19,
    "xPosition": 453.9675458289761,
    "yPosition": 532,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 61,
    "pulseDirection": "shrink",
    "pulseRate": 0.5215460180206156
  },
  {
    "radius": 12.42395488521267,
    "minRadius": 12,
    "maxRadius": 14,
    "xPosition": 396.19077756408876,
    "yPosition": 532,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.21197744260633442
  },
  {
    "radius": 19.677138720809907,
    "minRadius": 16,
    "maxRadius": 21,
    "xPosition": 540.4416926093488,
    "yPosition": 532,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 56,
    "pulseDirection": "grow",
    "pulseRate": 0.20428548448943984
  },
  {
    "radius": 14.165592298742624,
    "minRadius": 12,
    "maxRadius": 15,
    "xPosition": 234.23496132021768,
    "yPosition": 532,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 81,
    "pulseDirection": "shrink",
    "pulseRate": 0.27069903734282824
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 2,
    "xPosition": 297.67941389395247,
    "yPosition": 532,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 56,
    "pulseDirection": "shrink",
    "pulseRate": 0.20290739940101352
  },
  {
    "radius": 9,
    "minRadius": 9,
    "maxRadius": 4,
    "xPosition": 194.50643858650506,
    "yPosition": 532,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.4138475283194244
  },
  {
    "radius": 7.373594811170556,
    "minRadius": 8,
    "maxRadius": 10,
    "xPosition": 165.13858627099563,
    "yPosition": 532,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 83,
    "pulseDirection": "shrink",
    "pulseRate": 0.22893246852842603
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 9,
    "xPosition": 378.38645379357513,
    "yPosition": 532,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.13690268097567165
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 16,
    "xPosition": 334.7380481959294,
    "yPosition": 532,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 34,
    "pulseDirection": "shrink",
    "pulseRate": 0.0008612130121781636
  },
  {
    "radius": 10.028319113367754,
    "minRadius": 4,
    "maxRadius": 16,
    "xPosition": 281.4050692073578,
    "yPosition": 532,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 79,
    "pulseDirection": "grow",
    "pulseRate": 0.17730350333434577
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 11,
    "xPosition": 501.61488773816404,
    "yPosition": 532,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 55,
    "pulseDirection": "shrink",
    "pulseRate": 0.3733245340128816
  },
  {
    "radius": 18.665582596149893,
    "minRadius": 12,
    "maxRadius": 22,
    "xPosition": 272.2168100750068,
    "yPosition": 532,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 25,
    "pulseDirection": "grow",
    "pulseRate": 0.41659891225936874
  },
  {
    "radius": 5.176402049212015,
    "minRadius": 5,
    "maxRadius": 17,
    "xPosition": 185.16194626529307,
    "yPosition": 532,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 33,
    "pulseDirection": "grow",
    "pulseRate": 0.0010138048805286904
  },
  {
    "radius": 26,
    "minRadius": 26,
    "maxRadius": 23,
    "xPosition": 479.698457928207,
    "yPosition": 532,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 33,
    "pulseDirection": "shrink",
    "pulseRate": 0.06879023390382272
  },
  {
    "radius": 15.999999999999998,
    "minRadius": 16,
    "maxRadius": 8,
    "xPosition": 202.59594530033058,
    "yPosition": 532,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 80,
    "pulseDirection": "grow",
    "pulseRate": 0.29182870704095015
  },
  {
    "radius": 9.241177105978585,
    "minRadius": 8,
    "maxRadius": 13,
    "xPosition": 149.50986036396102,
    "yPosition": 532,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 76,
    "pulseDirection": "shrink",
    "pulseRate": 0.3241177105978584
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 414.19803875663786,
    "yPosition": 532,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.3660903379641726
  },
  {
    "radius": 3.9280817757174984,
    "minRadius": 2,
    "maxRadius": 22,
    "xPosition": 588.4585531894134,
    "yPosition": 532,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 43,
    "pulseDirection": "grow",
    "pulseRate": 0.4820204439293749
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 377.1254578226309,
    "yPosition": 532,
    "color": "220deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.27021464680950097
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 383.74671620015016,
    "yPosition": 560,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.2435330335364033
  },
  {
    "radius": 14.834253221250236,
    "minRadius": 11,
    "maxRadius": 17,
    "xPosition": 486.01795352975114,
    "yPosition": 560,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 26,
    "pulseDirection": "grow",
    "pulseRate": 0.31952110177085247
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 11,
    "xPosition": 532.7155302209856,
    "yPosition": 560,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 53,
    "pulseDirection": "shrink",
    "pulseRate": 0.5152454588659141
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 273.11099415627734,
    "yPosition": 560,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.5248337784645908
  },
  {
    "radius": 13.142225660254688,
    "minRadius": 10,
    "maxRadius": 18,
    "xPosition": 133.0729379906959,
    "yPosition": 560,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 28,
    "pulseDirection": "grow",
    "pulseRate": 0.11222234500909525
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 16,
    "xPosition": 233.4869745068563,
    "yPosition": 560,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 32,
    "pulseDirection": "shrink",
    "pulseRate": 0.43245087726246567
  },
  {
    "radius": 28,
    "minRadius": 28,
    "maxRadius": 27,
    "xPosition": 254.441621386748,
    "yPosition": 560,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 28,
    "pulseDirection": "shrink",
    "pulseRate": 0.4984389606298454
  },
  {
    "radius": 13,
    "minRadius": 13,
    "maxRadius": 9,
    "xPosition": 495.65804753370355,
    "yPosition": 560,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 43,
    "pulseDirection": "shrink",
    "pulseRate": 0.3527441687980658
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 10,
    "xPosition": 141.0888543326783,
    "yPosition": 560,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 53,
    "pulseDirection": "shrink",
    "pulseRate": 0.015673516829892476
  },
  {
    "radius": 17.056082728043158,
    "minRadius": 16,
    "maxRadius": 23,
    "xPosition": 385.66298296865585,
    "yPosition": 560,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 50,
    "pulseDirection": "shrink",
    "pulseRate": 0.0754344805745097
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 440.99393282870784,
    "yPosition": 560,
    "color": "0deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.12519183830077651
  },
  {
    "radius": 13.860925216893577,
    "minRadius": 9,
    "maxRadius": 27,
    "xPosition": 483.8283560314494,
    "yPosition": 560,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 30,
    "pulseDirection": "grow",
    "pulseRate": 0.2430462608446781
  },
  {
    "radius": 25.035115157729862,
    "minRadius": 24,
    "maxRadius": 26,
    "xPosition": 472.6956857147462,
    "yPosition": 560,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 56,
    "pulseDirection": "shrink",
    "pulseRate": 0.2587787894324648
  },
  {
    "radius": 23,
    "minRadius": 23,
    "maxRadius": 10,
    "xPosition": 203.81343938787614,
    "yPosition": 560,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 21,
    "pulseDirection": "shrink",
    "pulseRate": 0.030482970829003333
  },
  {
    "radius": 18.053613152883003,
    "minRadius": 17,
    "maxRadius": 21,
    "xPosition": 430.77266046430543,
    "yPosition": 560,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 36,
    "pulseDirection": "shrink",
    "pulseRate": 0.08780109607358454
  },
  {
    "radius": 25.37777262530432,
    "minRadius": 15,
    "maxRadius": 26,
    "xPosition": 321.37524665987377,
    "yPosition": 560,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 71,
    "pulseDirection": "grow",
    "pulseRate": 0.19218097454267138
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 9,
    "xPosition": 393.85520414089285,
    "yPosition": 560,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 84,
    "pulseDirection": "shrink",
    "pulseRate": 0.34898169723769346
  },
  {
    "radius": 19.20631755215845,
    "minRadius": 15,
    "maxRadius": 21,
    "xPosition": 160.12717187369338,
    "yPosition": 560,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 54,
    "pulseDirection": "shrink",
    "pulseRate": 0.5257896940198054
  },
  {
    "radius": 14,
    "minRadius": 14,
    "maxRadius": 13,
    "xPosition": 185.64585870877568,
    "yPosition": 560,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 51,
    "pulseDirection": "shrink",
    "pulseRate": 0.2456548799864949
  },
  {
    "radius": 16,
    "minRadius": 16,
    "maxRadius": 10,
    "xPosition": 190.32476018968595,
    "yPosition": 560,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 21,
    "pulseDirection": "shrink",
    "pulseRate": 0.2375356516299141
  },
  {
    "radius": 26,
    "minRadius": 26,
    "maxRadius": 26,
    "xPosition": 202.87313591892075,
    "yPosition": 588,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 23,
    "pulseDirection": "shrink",
    "pulseRate": 0.31005032646450165
  },
  {
    "radius": 23.491684615317034,
    "minRadius": 14,
    "maxRadius": 25,
    "xPosition": 563.7866421884468,
    "yPosition": 588,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 29,
    "pulseDirection": "shrink",
    "pulseRate": 0.20634096989819603
  },
  {
    "radius": 16.087539661096244,
    "minRadius": 12,
    "maxRadius": 16,
    "xPosition": 320.59092418658213,
    "yPosition": 588,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 42,
    "pulseDirection": "shrink",
    "pulseRate": 0.17031415254567656
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 11,
    "xPosition": 381.82594716701664,
    "yPosition": 588,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 30,
    "pulseDirection": "shrink",
    "pulseRate": 0.2901682043340182
  },
  {
    "radius": 12.231429276256762,
    "minRadius": 11,
    "maxRadius": 12,
    "xPosition": 130.44491218691155,
    "yPosition": 588,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.3078573190641901
  },
  {
    "radius": 4.085113977749028,
    "minRadius": 3,
    "maxRadius": 5,
    "xPosition": 529.1643434385201,
    "yPosition": 588,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 78,
    "pulseDirection": "grow",
    "pulseRate": 0.5425569888745139
  },
  {
    "radius": 18.53023843053073,
    "minRadius": 14,
    "maxRadius": 22,
    "xPosition": 373.28891329671376,
    "yPosition": 588,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 23,
    "pulseDirection": "shrink",
    "pulseRate": 0.16179422966181145
  },
  {
    "radius": 14.636995011823506,
    "minRadius": 10,
    "maxRadius": 25,
    "xPosition": 271.3813351364947,
    "yPosition": 588,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 83,
    "pulseDirection": "shrink",
    "pulseRate": 0.3312139294159651
  },
  {
    "radius": 8.879221195906009,
    "minRadius": 3,
    "maxRadius": 11,
    "xPosition": 128.69558743472095,
    "yPosition": 588,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 56,
    "pulseDirection": "grow",
    "pulseRate": 0.3266233997725559
  },
  {
    "radius": 11,
    "minRadius": 11,
    "maxRadius": 4,
    "xPosition": 473.6015434757484,
    "yPosition": 588,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 62,
    "pulseDirection": "shrink",
    "pulseRate": 0.21617031118516752
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 14,
    "xPosition": 585.6007612525777,
    "yPosition": 588,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 24,
    "pulseDirection": "shrink",
    "pulseRate": 0.3942666053997432
  },
  {
    "radius": 19,
    "minRadius": 19,
    "maxRadius": 14,
    "xPosition": 551.2683962306478,
    "yPosition": 588,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 44,
    "pulseDirection": "shrink",
    "pulseRate": 0.21881660950258466
  },
  {
    "radius": 8.374261526868047,
    "minRadius": 8,
    "maxRadius": 13,
    "xPosition": 612.1879330642023,
    "yPosition": 588,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 26,
    "pulseDirection": "shrink",
    "pulseRate": 0.23742615268680456
  },
  {
    "radius": 26.098121490805454,
    "minRadius": 25,
    "maxRadius": 28,
    "xPosition": 407.39089202159784,
    "yPosition": 588,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 39,
    "pulseDirection": "grow",
    "pulseRate": 0.2745303727013637
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 493.1416339162623,
    "yPosition": 588,
    "color": "220deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.1658050335947029
  },
  {
    "radius": 14.528831736703012,
    "minRadius": 13,
    "maxRadius": 23,
    "xPosition": 318.7440361188361,
    "yPosition": 588,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 64,
    "pulseDirection": "grow",
    "pulseRate": 0.38220793417575294
  },
  {
    "radius": 21.133234959055226,
    "minRadius": 11,
    "maxRadius": 22,
    "xPosition": 346.2346259335884,
    "yPosition": 588,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 51,
    "pulseDirection": "grow",
    "pulseRate": 0.187652499241763
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 8,
    "xPosition": 181.979183300255,
    "yPosition": 588,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 61,
    "pulseDirection": "shrink",
    "pulseRate": 0.41230915236492605
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 12,
    "xPosition": 279.6597212054204,
    "yPosition": 588,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 36,
    "pulseDirection": "shrink",
    "pulseRate": 0.3161822487367727
  },
  {
    "radius": 7.598620555384468,
    "minRadius": 3,
    "maxRadius": 10,
    "xPosition": 366.6167246751994,
    "yPosition": 588,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 53,
    "pulseDirection": "grow",
    "pulseRate": 0.38321837961537236
  },
  {
    "radius": 6.635598438629998,
    "minRadius": 4,
    "maxRadius": 11,
    "xPosition": 236.94409905962755,
    "yPosition": 588,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 29,
    "pulseDirection": "shrink",
    "pulseRate": 0.06588996096574994
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 14,
    "xPosition": 337.07565793908395,
    "yPosition": 616,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 49,
    "pulseDirection": "shrink",
    "pulseRate": 0.458445957479463
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 16,
    "xPosition": 341.4931788232364,
    "yPosition": 616,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 87,
    "pulseDirection": "shrink",
    "pulseRate": 0.00007024091627166884
  },
  {
    "radius": 15,
    "minRadius": 15,
    "maxRadius": 17,
    "xPosition": 577.0551269457654,
    "yPosition": 616,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 30,
    "pulseDirection": "grow",
    "pulseRate": 0.07187861798927632
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 399.0738800504382,
    "yPosition": 616,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.05349355165558089
  },
  {
    "radius": 23,
    "minRadius": 23,
    "maxRadius": 23,
    "xPosition": 329.03077873462496,
    "yPosition": 616,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 71,
    "pulseDirection": "shrink",
    "pulseRate": 0.40097178768161906
  },
  {
    "radius": 17.910713047563924,
    "minRadius": 9,
    "maxRadius": 24,
    "xPosition": 622.6500724585704,
    "yPosition": 616,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 56,
    "pulseDirection": "shrink",
    "pulseRate": 0.495039613753551
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 12,
    "xPosition": 118.94089032223565,
    "yPosition": 616,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 57,
    "pulseDirection": "shrink",
    "pulseRate": 0.42153484699147153
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 2,
    "xPosition": 523.693554496562,
    "yPosition": 616,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 61,
    "pulseDirection": "shrink",
    "pulseRate": 0.1305810212624379
  },
  {
    "radius": 11,
    "minRadius": 11,
    "maxRadius": 12,
    "xPosition": 265.78325440265036,
    "yPosition": 616,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 75,
    "pulseDirection": "shrink",
    "pulseRate": 0.48930526450871004
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 7,
    "xPosition": 293.07148888235844,
    "yPosition": 616,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 67,
    "pulseDirection": "shrink",
    "pulseRate": 0.22870954800869003
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 3,
    "xPosition": 247.11316746873126,
    "yPosition": 616,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.40006267805038753
  },
  {
    "radius": 12.557220066135784,
    "minRadius": 11,
    "maxRadius": 16,
    "xPosition": 572.2397216970814,
    "yPosition": 616,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 84,
    "pulseDirection": "grow",
    "pulseRate": 0.12976833884464822
  },
  {
    "radius": 28,
    "minRadius": 28,
    "maxRadius": 24,
    "xPosition": 410.4354068956227,
    "yPosition": 616,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 32,
    "pulseDirection": "shrink",
    "pulseRate": 0.19647447543298782
  },
  {
    "radius": 5.869871073869129,
    "minRadius": 3,
    "maxRadius": 18,
    "xPosition": 379.04795405007195,
    "yPosition": 616,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 35,
    "pulseDirection": "shrink",
    "pulseRate": 0.15943728188161843
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 479.33826981988585,
    "yPosition": 616,
    "color": "220deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.0815068122797838
  },
  {
    "radius": 14.670313864842413,
    "minRadius": 10,
    "maxRadius": 15,
    "xPosition": 596.7288893549514,
    "yPosition": 616,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 76,
    "pulseDirection": "grow",
    "pulseRate": 0.21228699385647273
  },
  {
    "radius": 13.213081286418417,
    "minRadius": 11,
    "maxRadius": 17,
    "xPosition": 357.2613263519476,
    "yPosition": 616,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.276635160802302
  },
  {
    "radius": 8.89786495687373,
    "minRadius": 7,
    "maxRadius": 11,
    "xPosition": 215.55675984881424,
    "yPosition": 616,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 75,
    "pulseDirection": "shrink",
    "pulseRate": 0.18978649568737274
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 11,
    "xPosition": 360.41364961719086,
    "yPosition": 616,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 83,
    "pulseDirection": "shrink",
    "pulseRate": 0.18074271132819528
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 26,
    "xPosition": 186.606096012077,
    "yPosition": 616,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 48,
    "pulseDirection": "shrink",
    "pulseRate": 0.5174626292821177
  },
  {
    "radius": 5,
    "minRadius": 5,
    "maxRadius": 2,
    "xPosition": 568.8061928749146,
    "yPosition": 616,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 73,
    "pulseDirection": "shrink",
    "pulseRate": 0.49487388292493784
  },
  {
    "radius": 22.52716892415577,
    "minRadius": 8,
    "maxRadius": 28,
    "xPosition": 539.2447510603597,
    "yPosition": 616,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 73,
    "pulseDirection": "shrink",
    "pulseRate": 0.14823641759342596
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 15,
    "xPosition": 568.2449987754097,
    "yPosition": 644,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 87,
    "pulseDirection": "shrink",
    "pulseRate": 0.11424210132950642
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 5,
    "xPosition": 129.83837688766158,
    "yPosition": 644,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 49,
    "pulseDirection": "shrink",
    "pulseRate": 0.4817951009363287
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 3,
    "xPosition": 341.1060085678764,
    "yPosition": 644,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 86,
    "pulseDirection": "shrink",
    "pulseRate": 0.09080605968951838
  },
  {
    "radius": 20.989482155885895,
    "minRadius": 17,
    "maxRadius": 27,
    "xPosition": 423.5516496175453,
    "yPosition": 644,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 44,
    "pulseDirection": "grow",
    "pulseRate": 0.14248150556735184
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 15,
    "xPosition": 454.30383808720103,
    "yPosition": 644,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 33,
    "pulseDirection": "shrink",
    "pulseRate": 0.2245622696306924
  },
  {
    "radius": 24.16503904888185,
    "minRadius": 14,
    "maxRadius": 25,
    "xPosition": 394.481699634516,
    "yPosition": 644,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 61,
    "pulseDirection": "grow",
    "pulseRate": 0.05909906423768482
  },
  {
    "radius": 14.898893542598238,
    "minRadius": 9,
    "maxRadius": 15,
    "xPosition": 321.1239405858495,
    "yPosition": 644,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 68,
    "pulseDirection": "grow",
    "pulseRate": 0.421349538757017
  },
  {
    "radius": 3.6837915543908757,
    "minRadius": 3,
    "maxRadius": 4,
    "xPosition": 427.2177963397752,
    "yPosition": 644,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 62,
    "pulseDirection": "shrink",
    "pulseRate": 0.34189577719543807
  },
  {
    "radius": 26,
    "minRadius": 26,
    "maxRadius": 11,
    "xPosition": 467.07134409438254,
    "yPosition": 644,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 52,
    "pulseDirection": "shrink",
    "pulseRate": 0.25680753068476264
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 238.1734016728896,
    "yPosition": 644,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.03425635877247181
  },
  {
    "radius": 11,
    "minRadius": 11,
    "maxRadius": 8,
    "xPosition": 508.8764281174608,
    "yPosition": 644,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 44,
    "pulseDirection": "shrink",
    "pulseRate": 0.4061452218275477
  },
  {
    "radius": 14.000000000000002,
    "minRadius": 14,
    "maxRadius": 27,
    "xPosition": 300.559124450476,
    "yPosition": 644,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 48,
    "pulseDirection": "grow",
    "pulseRate": 0.30968839586731034
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 12,
    "xPosition": 231.34306560944225,
    "yPosition": 644,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 78,
    "pulseDirection": "shrink",
    "pulseRate": 0.32876680696141136
  },
  {
    "radius": 9.049896931382115,
    "minRadius": 7,
    "maxRadius": 17,
    "xPosition": 256.93178482181185,
    "yPosition": 644,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 64,
    "pulseDirection": "grow",
    "pulseRate": 0.5124742328455286
  },
  {
    "radius": 13.511506051748551,
    "minRadius": 8,
    "maxRadius": 25,
    "xPosition": 302.16919031346276,
    "yPosition": 644,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 50,
    "pulseDirection": "grow",
    "pulseRate": 0.04316957501004888
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 19,
    "xPosition": 469.4644030589396,
    "yPosition": 644,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 36,
    "pulseDirection": "shrink",
    "pulseRate": 0.12811762074310584
  },
  {
    "radius": 16.60983502282745,
    "minRadius": 12,
    "maxRadius": 22,
    "xPosition": 208.46680200775307,
    "yPosition": 644,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 59,
    "pulseDirection": "shrink",
    "pulseRate": 0.08865067351591233
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 18,
    "xPosition": 585.4146827705564,
    "yPosition": 644,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.5489088543353791
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 7,
    "xPosition": 539.7738493639256,
    "yPosition": 644,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 34,
    "pulseDirection": "shrink",
    "pulseRate": 0.14146962870003743
  },
  {
    "radius": 5.0687367375606165,
    "minRadius": 4,
    "maxRadius": 15,
    "xPosition": 376.58358854382806,
    "yPosition": 644,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 44,
    "pulseDirection": "shrink",
    "pulseRate": 0.5343683687803082
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 26,
    "xPosition": 292.336854158276,
    "yPosition": 644,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.39298669791386925
  },
  {
    "radius": 21.805369494850623,
    "minRadius": 18,
    "maxRadius": 26,
    "xPosition": 618.907158377611,
    "yPosition": 644,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.3805369494850629
  },
  {
    "radius": 10.45239263091818,
    "minRadius": 8,
    "maxRadius": 13,
    "xPosition": 425.36807657422094,
    "yPosition": 644,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 41,
    "pulseDirection": "grow",
    "pulseRate": 0.4087321051530296
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 8,
    "xPosition": 600.9241904857238,
    "yPosition": 672,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.49694220498780833
  },
  {
    "radius": 15,
    "minRadius": 15,
    "maxRadius": 13,
    "xPosition": 208.26988135005075,
    "yPosition": 672,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 43,
    "pulseDirection": "shrink",
    "pulseRate": 0.4106000046038905
  },
  {
    "radius": 13.28215747648834,
    "minRadius": 8,
    "maxRadius": 15,
    "xPosition": 603.5828266548982,
    "yPosition": 672,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 85,
    "pulseDirection": "shrink",
    "pulseRate": 0.5201541054634525
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 21,
    "xPosition": 558.268301446608,
    "yPosition": 672,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 69,
    "pulseDirection": "shrink",
    "pulseRate": 0.14913320363987942
  },
  {
    "radius": 14.723231000872245,
    "minRadius": 14,
    "maxRadius": 24,
    "xPosition": 581.1689346421283,
    "yPosition": 672,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 53,
    "pulseDirection": "grow",
    "pulseRate": 0.12053850014537408
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 577.3105624835545,
    "yPosition": 672,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.4738687954631219
  },
  {
    "radius": 11,
    "minRadius": 11,
    "maxRadius": 16,
    "xPosition": 168.27743137617688,
    "yPosition": 672,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 70,
    "pulseDirection": "shrink",
    "pulseRate": 0.5149740291557435
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 17,
    "xPosition": 589.9843238357705,
    "yPosition": 672,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 84,
    "pulseDirection": "shrink",
    "pulseRate": 0.030859183436637374
  },
  {
    "radius": 21.363461417920824,
    "minRadius": 17,
    "maxRadius": 22,
    "xPosition": 309.50285846936237,
    "yPosition": 672,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 86,
    "pulseDirection": "grow",
    "pulseRate": 0.145448713930694
  },
  {
    "radius": 24.130927869577754,
    "minRadius": 11,
    "maxRadius": 25,
    "xPosition": 601.7322550663309,
    "yPosition": 672,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 60,
    "pulseDirection": "grow",
    "pulseRate": 0.24316533091810633
  },
  {
    "radius": 10.160144503005483,
    "minRadius": 7,
    "maxRadius": 21,
    "xPosition": 201.83240886650316,
    "yPosition": 672,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 21,
    "pulseDirection": "grow",
    "pulseRate": 0.5266907505009133
  },
  {
    "radius": 5,
    "minRadius": 5,
    "maxRadius": 4,
    "xPosition": 114.18144895593537,
    "yPosition": 672,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 67,
    "pulseDirection": "shrink",
    "pulseRate": 0.480355303813473
  },
  {
    "radius": 2.7695285002270436,
    "minRadius": 2,
    "maxRadius": 19,
    "xPosition": 161.72508995632785,
    "yPosition": 672,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 67,
    "pulseDirection": "shrink",
    "pulseRate": 0.19238212505676025
  },
  {
    "radius": 13,
    "minRadius": 13,
    "maxRadius": 10,
    "xPosition": 592.4314653529541,
    "yPosition": 672,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 22,
    "pulseDirection": "shrink",
    "pulseRate": 0.17254043947235917
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 176.26499381873873,
    "yPosition": 672,
    "color": "220deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.20697843372827796
  },
  {
    "radius": 4.000000000000002,
    "minRadius": 4,
    "maxRadius": 17,
    "xPosition": 543.897683260632,
    "yPosition": 672,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 35,
    "pulseDirection": "shrink",
    "pulseRate": 0.4802259513734076
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 10,
    "xPosition": 544.4150637496269,
    "yPosition": 672,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 74,
    "pulseDirection": "shrink",
    "pulseRate": 0.18927252805282102
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 8,
    "xPosition": 414.835801291489,
    "yPosition": 672,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 69,
    "pulseDirection": "shrink",
    "pulseRate": 0.38208899689544956
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 4,
    "xPosition": 458.38380912263904,
    "yPosition": 672,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 51,
    "pulseDirection": "shrink",
    "pulseRate": 0.5312575202437104
  },
  {
    "radius": 16,
    "minRadius": 16,
    "maxRadius": 7,
    "xPosition": 202.42140045461315,
    "yPosition": 672,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 69,
    "pulseDirection": "shrink",
    "pulseRate": 0.30366111195847395
  },
  {
    "radius": 3,
    "minRadius": 3,
    "maxRadius": 2,
    "xPosition": 353.8234349589786,
    "yPosition": 672,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 27,
    "pulseDirection": "shrink",
    "pulseRate": 0.11962161877000373
  },
  {
    "radius": 6.584450782532384,
    "minRadius": 3,
    "maxRadius": 19,
    "xPosition": 104.2928973219731,
    "yPosition": 672,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 86,
    "pulseDirection": "shrink",
    "pulseRate": 0.3584450782532386
  },
  {
    "radius": 20,
    "minRadius": 20,
    "maxRadius": 13,
    "xPosition": 252.64299996266107,
    "yPosition": 672,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 51,
    "pulseDirection": "shrink",
    "pulseRate": 0.47173366998740945
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 11,
    "xPosition": 224.77857501060225,
    "yPosition": 672,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 21,
    "pulseDirection": "shrink",
    "pulseRate": 0.15499161689291252
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 16,
    "xPosition": 561.6926633502612,
    "yPosition": 700,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 50,
    "pulseDirection": "shrink",
    "pulseRate": 0.5073222640472036
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 12,
    "xPosition": 147.57268882080734,
    "yPosition": 700,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 58,
    "pulseDirection": "grow",
    "pulseRate": 0.5314419442939411
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 502.99123459281554,
    "yPosition": 700,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.2951217861291991
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 15,
    "xPosition": 594.5838483343653,
    "yPosition": 700,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 74,
    "pulseDirection": "shrink",
    "pulseRate": 0.16034210030687002
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 328.5544539962844,
    "yPosition": 700,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.1476057153742735
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 22,
    "xPosition": 255.98918308012583,
    "yPosition": 700,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 58,
    "pulseDirection": "grow",
    "pulseRate": 0.09377133141454348
  },
  {
    "radius": 14,
    "minRadius": 14,
    "maxRadius": 10,
    "xPosition": 128.39570188671348,
    "yPosition": 700,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.19574586757056206
  },
  {
    "radius": 20,
    "minRadius": 20,
    "maxRadius": 13,
    "xPosition": 369.030634093442,
    "yPosition": 700,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 67,
    "pulseDirection": "shrink",
    "pulseRate": 0.2785898091527584
  },
  {
    "radius": 7,
    "minRadius": 7,
    "maxRadius": 5,
    "xPosition": 282.25366674995416,
    "yPosition": 700,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 48,
    "pulseDirection": "shrink",
    "pulseRate": 0.4466086770418546
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 18,
    "xPosition": 398.54619734562567,
    "yPosition": 700,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 60,
    "pulseDirection": "shrink",
    "pulseRate": 0.2500540315643076
  },
  {
    "radius": 9,
    "minRadius": 9,
    "maxRadius": 4,
    "xPosition": 205.76686562236938,
    "yPosition": 700,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 51,
    "pulseDirection": "shrink",
    "pulseRate": 0.25165976458544503
  },
  {
    "radius": 13,
    "minRadius": 13,
    "maxRadius": 8,
    "xPosition": 575.8374749357552,
    "yPosition": 700,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 76,
    "pulseDirection": "shrink",
    "pulseRate": 0.400512454789396
  },
  {
    "radius": 11.705266459133298,
    "minRadius": 8,
    "maxRadius": 15,
    "xPosition": 503.7880106630447,
    "yPosition": 700,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 23,
    "pulseDirection": "shrink",
    "pulseRate": 0.23157915369583112
  },
  {
    "radius": 17.67845862114119,
    "minRadius": 9,
    "maxRadius": 24,
    "xPosition": 452.9099511349509,
    "yPosition": 700,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 77,
    "pulseDirection": "shrink",
    "pulseRate": 0.12397798030201661
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 106.78892555502671,
    "yPosition": 700,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.4454793873562812
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 19,
    "xPosition": 326.23910734697427,
    "yPosition": 700,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 79,
    "pulseDirection": "shrink",
    "pulseRate": 0.4826018614963983
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 3,
    "xPosition": 626.2265044407219,
    "yPosition": 700,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 72,
    "pulseDirection": "shrink",
    "pulseRate": 0.17501573161812956
  },
  {
    "radius": 7.627608770412818,
    "minRadius": 3,
    "maxRadius": 25,
    "xPosition": 180.0843494260052,
    "yPosition": 700,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 43,
    "pulseDirection": "shrink",
    "pulseRate": 0.23138043852064116
  },
  {
    "radius": 10.385129589178831,
    "minRadius": 9,
    "maxRadius": 20,
    "xPosition": 633.9892335345547,
    "yPosition": 700,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 62,
    "pulseDirection": "grow",
    "pulseRate": 0.007960514880337355
  },
  {
    "radius": 15,
    "minRadius": 15,
    "maxRadius": 3,
    "xPosition": 609.6133575047002,
    "yPosition": 700,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.055014716968328464
  },
  {
    "radius": 15.365054728291192,
    "minRadius": 11,
    "maxRadius": 17,
    "xPosition": 85.55507413992791,
    "yPosition": 700,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 24,
    "pulseDirection": "grow",
    "pulseRate": 0.16788672031889185
  },
  {
    "radius": 7.773214701170402,
    "minRadius": 4,
    "maxRadius": 26,
    "xPosition": 593.2952556167779,
    "yPosition": 700,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.23582591882315002
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 321.4706835424427,
    "yPosition": 700,
    "color": "220deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.47959258273779565
  },
  {
    "radius": 7.414336216594613,
    "minRadius": 8,
    "maxRadius": 13,
    "xPosition": 516.4032255221869,
    "yPosition": 700,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 57,
    "pulseDirection": "grow",
    "pulseRate": 0.17679202707432695
  },
  {
    "radius": 9.963300899273012,
    "minRadius": 8,
    "maxRadius": 17,
    "xPosition": 481.65349107538214,
    "yPosition": 700,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 21,
    "pulseDirection": "shrink",
    "pulseRate": 0.10429739208613231
  },
  {
    "radius": 20.756091762873048,
    "minRadius": 5,
    "maxRadius": 24,
    "xPosition": 555.3687811448609,
    "yPosition": 728,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.12914829313830345
  },
  {
    "radius": 11,
    "minRadius": 11,
    "maxRadius": 8,
    "xPosition": 196.03785795842884,
    "yPosition": 728,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 33,
    "pulseDirection": "shrink",
    "pulseRate": 0.3546121196685979
  },
  {
    "radius": 11.744892627539969,
    "minRadius": 11,
    "maxRadius": 13,
    "xPosition": 633.0028470555342,
    "yPosition": 728,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.09311157844249654
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 4,
    "xPosition": 469.22219907545195,
    "yPosition": 728,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 57,
    "pulseDirection": "shrink",
    "pulseRate": 0.16982032517405793
  },
  {
    "radius": 13,
    "minRadius": 13,
    "maxRadius": 8,
    "xPosition": 161.61175615692594,
    "yPosition": 728,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 48,
    "pulseDirection": "shrink",
    "pulseRate": 0.09849090451138186
  },
  {
    "radius": 14.04592721673044,
    "minRadius": 12,
    "maxRadius": 15,
    "xPosition": 447.05624746642263,
    "yPosition": 728,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 34,
    "pulseDirection": "grow",
    "pulseRate": 0.5114818041826096
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 8,
    "xPosition": 480.8180227612338,
    "yPosition": 728,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 24,
    "pulseDirection": "shrink",
    "pulseRate": 0.5382533230876031
  },
  {
    "radius": 15,
    "minRadius": 15,
    "maxRadius": 3,
    "xPosition": 426.78550238456796,
    "yPosition": 728,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 36,
    "pulseDirection": "shrink",
    "pulseRate": 0.24699283881228262
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 7,
    "xPosition": 164.45490997837362,
    "yPosition": 728,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 33,
    "pulseDirection": "shrink",
    "pulseRate": 0.010042083358031396
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 188.57381677939844,
    "yPosition": 728,
    "color": "0deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.20679963897894205
  },
  {
    "radius": 7,
    "minRadius": 7,
    "maxRadius": 5,
    "xPosition": 325.6919113097985,
    "yPosition": 728,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 44,
    "pulseDirection": "shrink",
    "pulseRate": 0.2453103260309969
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 462.82358734138194,
    "yPosition": 728,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.04767095315834936
  },
  {
    "radius": 23.249180044906893,
    "minRadius": 11,
    "maxRadius": 26,
    "xPosition": 572.5742648729446,
    "yPosition": 728,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 81,
    "pulseDirection": "shrink",
    "pulseRate": 0.10207650037422474
  },
  {
    "radius": 12.065863963648443,
    "minRadius": 8,
    "maxRadius": 21,
    "xPosition": 188.14011481058577,
    "yPosition": 728,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 50,
    "pulseDirection": "shrink",
    "pulseRate": 0.5054886636373698
  },
  {
    "radius": 8.9673490318815,
    "minRadius": 2,
    "maxRadius": 25,
    "xPosition": 617.8974856993821,
    "yPosition": 728,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 28,
    "pulseDirection": "shrink",
    "pulseRate": 0.4976677879915359
  },
  {
    "radius": 13.683217611859625,
    "minRadius": 11,
    "maxRadius": 21,
    "xPosition": 132.09599497943566,
    "yPosition": 728,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 23,
    "pulseDirection": "grow",
    "pulseRate": 0.13416088059298195
  },
  {
    "radius": 7,
    "minRadius": 7,
    "maxRadius": 4,
    "xPosition": 384.6712879082698,
    "yPosition": 728,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 79,
    "pulseDirection": "shrink",
    "pulseRate": 0.49812513106444134
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 16,
    "xPosition": 548.1171545791665,
    "yPosition": 728,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 83,
    "pulseDirection": "shrink",
    "pulseRate": 0.50352784045234
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 473.28050729613085,
    "yPosition": 728,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.45614523994740136
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 21,
    "xPosition": 399.1971477388969,
    "yPosition": 728,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 31,
    "pulseDirection": "shrink",
    "pulseRate": 0.2956073188647845
  },
  {
    "radius": 25.509196872752398,
    "minRadius": 25,
    "maxRadius": 26,
    "xPosition": 317.31717702106846,
    "yPosition": 728,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 30,
    "pulseDirection": "shrink",
    "pulseRate": 0.08486614545873267
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 380.8663781706437,
    "yPosition": 728,
    "color": "0deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.18912271706333425
  },
  {
    "radius": 19.72803028330651,
    "minRadius": 16,
    "maxRadius": 23,
    "xPosition": 202.7816870602378,
    "yPosition": 728,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 25,
    "pulseDirection": "shrink",
    "pulseRate": 0.23300189270665625
  },
  {
    "radius": 14.49869710486945,
    "minRadius": 13,
    "maxRadius": 23,
    "xPosition": 536.2428910640277,
    "yPosition": 728,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 39,
    "pulseDirection": "grow",
    "pulseRate": 0.3746742762173616
  },
  {
    "radius": 16,
    "minRadius": 16,
    "maxRadius": 17,
    "xPosition": 586.9204200854285,
    "yPosition": 728,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 84,
    "pulseDirection": "grow",
    "pulseRate": 0.5076251969048212
  },
  {
    "radius": 14,
    "minRadius": 14,
    "maxRadius": 9,
    "xPosition": 106.00299177735712,
    "yPosition": 728,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 22,
    "pulseDirection": "shrink",
    "pulseRate": 0.3759842856223208
  },
  {
    "radius": 9.879838029412973,
    "minRadius": 9,
    "maxRadius": 10,
    "xPosition": 660.3706338431135,
    "yPosition": 756,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 53,
    "pulseDirection": "shrink",
    "pulseRate": 0.21995950735324274
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 7,
    "xPosition": 571.4306114057683,
    "yPosition": 756,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 32,
    "pulseDirection": "shrink",
    "pulseRate": 0.012059340683582687
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 24,
    "xPosition": 227.45630842936833,
    "yPosition": 756,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 74,
    "pulseDirection": "shrink",
    "pulseRate": 0.38967962344119295
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 534.6910434716508,
    "yPosition": 756,
    "color": "220deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.10604964120956668
  },
  {
    "radius": 10,
    "minRadius": 10,
    "maxRadius": 7,
    "xPosition": 389.993618597246,
    "yPosition": 756,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 40,
    "pulseDirection": "shrink",
    "pulseRate": 0.16255152756243793
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 12,
    "xPosition": 379.94016330303384,
    "yPosition": 756,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 57,
    "pulseDirection": "shrink",
    "pulseRate": 0.22979954269123237
  },
  {
    "radius": 13.149148353800623,
    "minRadius": 12,
    "maxRadius": 14,
    "xPosition": 182.471840696767,
    "yPosition": 756,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 49,
    "pulseDirection": "grow",
    "pulseRate": 0.191524725633438
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 10,
    "xPosition": 624.611660710423,
    "yPosition": 756,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 63,
    "pulseDirection": "shrink",
    "pulseRate": 0.2515732349426036
  },
  {
    "radius": 15,
    "minRadius": 15,
    "maxRadius": 12,
    "xPosition": 121.4051938491308,
    "yPosition": 756,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 51,
    "pulseDirection": "shrink",
    "pulseRate": 0.34855035195531986
  },
  {
    "radius": 7,
    "minRadius": 7,
    "maxRadius": 8,
    "xPosition": 145.8841283392975,
    "yPosition": 756,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 63,
    "pulseDirection": "shrink",
    "pulseRate": 0.1616741432831884
  },
  {
    "radius": 6.6124871386545205,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 675.4474367780252,
    "yPosition": 756,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 88,
    "pulseDirection": "grow",
    "pulseRate": 0.1020811897757531
  },
  {
    "radius": 20.470192330163414,
    "minRadius": 11,
    "maxRadius": 25,
    "xPosition": 292.1988196841535,
    "yPosition": 756,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 48,
    "pulseDirection": "shrink",
    "pulseRate": 0.27853506853421767
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 669.0568435125728,
    "yPosition": 756,
    "color": "0deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.4642282731345139
  },
  {
    "radius": 9,
    "minRadius": 9,
    "maxRadius": 4,
    "xPosition": 201.79203514977286,
    "yPosition": 756,
    "color": "0deg 55.759929303066734%  97.23386413682329%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.5278427683576211
  },
  {
    "radius": 28,
    "minRadius": 28,
    "maxRadius": 14,
    "xPosition": 659.652754256524,
    "yPosition": 756,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 21,
    "pulseDirection": "shrink",
    "pulseRate": 0.03600644099091576
  },
  {
    "radius": 14.048208163210262,
    "minRadius": 14,
    "maxRadius": 22,
    "xPosition": 436.6120317283204,
    "yPosition": 756,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 67,
    "pulseDirection": "grow",
    "pulseRate": 0.0002802800186634369
  },
  {
    "radius": 21.290768425549473,
    "minRadius": 20,
    "maxRadius": 25,
    "xPosition": 322.7868130999454,
    "yPosition": 756,
    "color": "0deg 65.8799957034882%  92.47824947024873%",
    "opacity": 48,
    "pulseDirection": "grow",
    "pulseRate": 0.32269210638736845
  },
  {
    "radius": 5,
    "minRadius": 5,
    "maxRadius": 11,
    "xPosition": 154.03786432642653,
    "yPosition": 756,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 37,
    "pulseDirection": "grow",
    "pulseRate": 0.07083887733520729
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 26,
    "xPosition": 441.5142718208105,
    "yPosition": 756,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 48,
    "pulseDirection": "shrink",
    "pulseRate": 0.29640262272506845
  },
  {
    "radius": 8.041925511701088,
    "minRadius": 2,
    "maxRadius": 25,
    "xPosition": 114.7395730577955,
    "yPosition": 756,
    "color": "119.07845085614207deg 59.48441674645477%  43.49974192919698%",
    "opacity": 37,
    "pulseDirection": "shrink",
    "pulseRate": 0.2323817504500419
  },
  {
    "radius": 19.247536281623233,
    "minRadius": 17,
    "maxRadius": 21,
    "xPosition": 572.4833903727844,
    "yPosition": 756,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 74,
    "pulseDirection": "grow",
    "pulseRate": 0.37458938027054023
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 5,
    "xPosition": 687.6111106559292,
    "yPosition": 756,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 83,
    "pulseDirection": "shrink",
    "pulseRate": 0.25604381134377385
  },
  {
    "radius": 15.129598590964093,
    "minRadius": 13,
    "maxRadius": 20,
    "xPosition": 588.0323492953772,
    "yPosition": 756,
    "color": "107.7983465012721deg 52.3406937526447%  55.48334820119059%",
    "opacity": 57,
    "pulseDirection": "shrink",
    "pulseRate": 0.5323996477410226
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 420.6333846116531,
    "yPosition": 756,
    "color": "0deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.3612335469996673
  },
  {
    "radius": 21.400672162673033,
    "minRadius": 19,
    "maxRadius": 27,
    "xPosition": 432.36376930957357,
    "yPosition": 756,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 85,
    "pulseDirection": "grow",
    "pulseRate": 0.4001120271121715
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 8,
    "xPosition": 468.5349197201388,
    "yPosition": 756,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 44,
    "pulseDirection": "shrink",
    "pulseRate": 0.4796934308216315
  },
  {
    "radius": 5.4780309197928005,
    "minRadius": 5,
    "maxRadius": 7,
    "xPosition": 614.4380330651683,
    "yPosition": 756,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 74,
    "pulseDirection": "shrink",
    "pulseRate": 0.1195077299481998
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 9,
    "xPosition": 488.80068478799205,
    "yPosition": 784,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 23,
    "pulseDirection": "shrink",
    "pulseRate": 0.39770646019973416
  },
  {
    "radius": 14.668654984376609,
    "minRadius": 11,
    "maxRadius": 20,
    "xPosition": 435.526561394786,
    "yPosition": 784,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 40,
    "pulseDirection": "grow",
    "pulseRate": 0.021329389444050318
  },
  {
    "radius": 23.29773183127135,
    "minRadius": 13,
    "maxRadius": 23,
    "xPosition": 130.167803182228,
    "yPosition": 784,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 36,
    "pulseDirection": "shrink",
    "pulseRate": 0.3028744656256272
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 4,
    "xPosition": 438.08723012810174,
    "yPosition": 784,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 60,
    "pulseDirection": "shrink",
    "pulseRate": 0.022028133284231744
  },
  {
    "radius": 14.28761824064319,
    "minRadius": 4,
    "maxRadius": 26,
    "xPosition": 56.89238691479727,
    "yPosition": 784,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 52,
    "pulseDirection": "grow",
    "pulseRate": 0.05912424276231679
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 70.99472464551695,
    "yPosition": 784,
    "color": "0deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.5425353272317016
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 7,
    "xPosition": 368.8996957028361,
    "yPosition": 784,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 51,
    "pulseDirection": "shrink",
    "pulseRate": 0.14981274499059866
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 47.197155734579155,
    "yPosition": 784,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.024017031297174665
  },
  {
    "radius": 19,
    "minRadius": 19,
    "maxRadius": 11,
    "xPosition": 199.82596774251783,
    "yPosition": 784,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 67,
    "pulseDirection": "shrink",
    "pulseRate": 0.2556584311609009
  },
  {
    "radius": 20.788547649031727,
    "minRadius": 18,
    "maxRadius": 24,
    "xPosition": 172.8624247328528,
    "yPosition": 784,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 72,
    "pulseDirection": "shrink",
    "pulseRate": 0.2788547649031745
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 138.54585964155672,
    "yPosition": 784,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.3873940246141648
  },
  {
    "radius": 10.657705073260672,
    "minRadius": 3,
    "maxRadius": 13,
    "xPosition": 214.36220139549215,
    "yPosition": 784,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 55,
    "pulseDirection": "shrink",
    "pulseRate": 0.3190710447191946
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 11,
    "xPosition": 226.90150118214387,
    "yPosition": 784,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 69,
    "pulseDirection": "shrink",
    "pulseRate": 0.45929002785545087
  },
  {
    "radius": 14.93867237006495,
    "minRadius": 12,
    "maxRadius": 26,
    "xPosition": 697.8516873678618,
    "yPosition": 784,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 73,
    "pulseDirection": "shrink",
    "pulseRate": 0.14693361850324738
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 18,
    "xPosition": 171.76315001361877,
    "yPosition": 784,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 77,
    "pulseDirection": "shrink",
    "pulseRate": 0.29973051990919497
  },
  {
    "radius": 16,
    "minRadius": 16,
    "maxRadius": 14,
    "xPosition": 376.9511245062272,
    "yPosition": 784,
    "color": "0deg 51.63137145448386%  93.92639352741541%",
    "opacity": 67,
    "pulseDirection": "shrink",
    "pulseRate": 0.26862738822365323
  },
  {
    "radius": 4,
    "minRadius": 4,
    "maxRadius": 5,
    "xPosition": 286.3093063860191,
    "yPosition": 784,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 59,
    "pulseDirection": "shrink",
    "pulseRate": 0.42732543370710385
  },
  {
    "radius": 15,
    "minRadius": 15,
    "maxRadius": 4,
    "xPosition": 544.4725426752784,
    "yPosition": 784,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.41060185840242697
  },
  {
    "radius": 9,
    "minRadius": 9,
    "maxRadius": 11,
    "xPosition": 473.1705155417631,
    "yPosition": 784,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 80,
    "pulseDirection": "shrink",
    "pulseRate": 0.20219854733798429
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 17,
    "xPosition": 56.111001735299396,
    "yPosition": 784,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 53,
    "pulseDirection": "shrink",
    "pulseRate": 0.54975108692688
  },
  {
    "radius": 7,
    "minRadius": 7,
    "maxRadius": 3,
    "xPosition": 489.8270934876957,
    "yPosition": 784,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 49,
    "pulseDirection": "shrink",
    "pulseRate": 0.5123730279616481
  },
  {
    "radius": 12.166584468030424,
    "minRadius": 10,
    "maxRadius": 16,
    "xPosition": 673.9598238407493,
    "yPosition": 784,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 62,
    "pulseDirection": "grow",
    "pulseRate": 0.08333017184732354
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 12,
    "xPosition": 354.1895646701638,
    "yPosition": 784,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 83,
    "pulseDirection": "shrink",
    "pulseRate": 0.4522368172357223
  },
  {
    "radius": 19,
    "minRadius": 19,
    "maxRadius": 8,
    "xPosition": 180.4988779680334,
    "yPosition": 784,
    "color": "123.67362039317051deg 55.1772086400206%  51.2218469766714%",
    "opacity": 53,
    "pulseDirection": "shrink",
    "pulseRate": 0.23937930944814156
  },
  {
    "radius": 24.905853040540926,
    "minRadius": 22,
    "maxRadius": 28,
    "xPosition": 174.94433302844027,
    "yPosition": 784,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 75,
    "pulseDirection": "grow",
    "pulseRate": 0.4843088400901542
  },
  {
    "radius": 11.20829299195119,
    "minRadius": 10,
    "maxRadius": 18,
    "xPosition": 115.4826321405684,
    "yPosition": 784,
    "color": "0deg 45.69882252391706%  91.08465011705404%",
    "opacity": 89,
    "pulseDirection": "shrink",
    "pulseRate": 0.08630664228222774
  },
  {
    "radius": 16.560667671337505,
    "minRadius": 8,
    "maxRadius": 21,
    "xPosition": 334.9476430487388,
    "yPosition": 784,
    "color": "123.30692095582991deg 50.13105100941605%  45.460531315346955%",
    "opacity": 36,
    "pulseDirection": "shrink",
    "pulseRate": 0.25178434327463334
  },
  {
    "radius": 28,
    "minRadius": 28,
    "maxRadius": 9,
    "xPosition": 170.2761216532184,
    "yPosition": 784,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 34,
    "pulseDirection": "shrink",
    "pulseRate": 0.4663994636244608
  },
  {
    "radius": 10,
    "minRadius": 10,
    "maxRadius": 9,
    "xPosition": 191.36824487419995,
    "yPosition": 812,
    "color": "0deg 62.45127944743773%  95.33695710684607%",
    "opacity": 87,
    "pulseDirection": "shrink",
    "pulseRate": 0.18487362824107492
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 656.9811104953069,
    "yPosition": 812,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.41615304064998354
  },
  {
    "radius": 26,
    "minRadius": 26,
    "maxRadius": 3,
    "xPosition": 682.9607558364186,
    "yPosition": 812,
    "color": "101.05756126592475deg 49.68162269273026%  44.52267976915492%",
    "opacity": 38,
    "pulseDirection": "shrink",
    "pulseRate": 0.19604856241461774
  },
  {
    "radius": 13.557139617148511,
    "minRadius": 5,
    "maxRadius": 14,
    "xPosition": 366.1137703337136,
    "yPosition": 812,
    "color": "40deg 66.99085788897199%  97.12791699505918%",
    "opacity": 31,
    "pulseDirection": "grow",
    "pulseRate": 0.04975081172760806
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 313.03554178316926,
    "yPosition": 812,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.28569049019943554
  },
  {
    "radius": 13,
    "minRadius": 13,
    "maxRadius": 2,
    "xPosition": 614.2044256354217,
    "yPosition": 812,
    "color": "106.41362091430369deg 64.7077023937112%  59.72431443707483%",
    "opacity": 30,
    "pulseDirection": "shrink",
    "pulseRate": 0.18261980297281744
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 525.8143238679178,
    "yPosition": 812,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.44567115354484865
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 133.18527580989974,
    "yPosition": 812,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.4501593361856769
  },
  {
    "radius": 17,
    "minRadius": 17,
    "maxRadius": 16,
    "xPosition": 676.0041517507822,
    "yPosition": 812,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 23,
    "pulseDirection": "shrink",
    "pulseRate": 0.1350565190200927
  },
  {
    "radius": 22.73602052546888,
    "minRadius": 19,
    "maxRadius": 26,
    "xPosition": 71.11342348535027,
    "yPosition": 812,
    "color": "0deg 45.792047584110755%  94.89904859082304%",
    "opacity": 31,
    "pulseDirection": "shrink",
    "pulseRate": 0.1436930971334178
  },
  {
    "radius": 21,
    "minRadius": 21,
    "maxRadius": 17,
    "xPosition": 422.162669132154,
    "yPosition": 812,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 34,
    "pulseDirection": "shrink",
    "pulseRate": 0.32007866185712586
  },
  {
    "radius": 12.501608207156904,
    "minRadius": 10,
    "maxRadius": 28,
    "xPosition": 116.46615758394773,
    "yPosition": 812,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 62,
    "pulseDirection": "shrink",
    "pulseRate": 0.4169347011928178
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 4,
    "xPosition": 235.18461719996554,
    "yPosition": 812,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 64,
    "pulseDirection": "shrink",
    "pulseRate": 0.2958305486726294
  },
  {
    "radius": 27,
    "minRadius": 27,
    "maxRadius": 4,
    "xPosition": 101.72239794845439,
    "yPosition": 812,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 22,
    "pulseDirection": "shrink",
    "pulseRate": 0.5260565967229645
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 57.82729717172333,
    "yPosition": 812,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.19994371340508815
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 51.73916540771995,
    "yPosition": 812,
    "color": "50deg 40.506531551923786%  50.655833590551296%",
    "opacity": 100,
    "pulseDirection": "shrink",
    "pulseRate": 0.3729512673343885
  },
  {
    "radius": 25,
    "minRadius": 25,
    "maxRadius": 4,
    "xPosition": 198.51818875293304,
    "yPosition": 812,
    "color": "0deg 54.438474975376884%  90.4219506848536%",
    "opacity": 47,
    "pulseDirection": "shrink",
    "pulseRate": 0.3302379383546374
  },
  {
    "radius": 9.794620712912959,
    "minRadius": 3,
    "maxRadius": 18,
    "xPosition": 629.9473194323239,
    "yPosition": 812,
    "color": "115.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 54,
    "pulseDirection": "shrink",
    "pulseRate": 0.13589241425825915
  },
  {
    "radius": 18,
    "minRadius": 18,
    "maxRadius": 15,
    "xPosition": 545.271085690662,
    "yPosition": 812,
    "color": "0deg 57.90098210321452%  99.22441916468446%",
    "opacity": 62,
    "pulseDirection": "shrink",
    "pulseRate": 0.15582464044015845
  },
  {
    "radius": 8,
    "minRadius": 8,
    "maxRadius": 8,
    "xPosition": 341.7641517435943,
    "yPosition": 812,
    "color": "50deg 51.873614175952234%  50.51025524342779%",
    "opacity": 100,
    "pulseDirection": "grow",
    "pulseRate": 0.09823632767975954
  },
  {
    "radius": 22.1205095622497,
    "minRadius": 13,
    "maxRadius": 26,
    "xPosition": 67.09613878438404,
    "yPosition": 812,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 65,
    "pulseDirection": "shrink",
    "pulseRate": 0.41456861646589516
  },
  {
    "radius": 5,
    "minRadius": 5,
    "maxRadius": 3,
    "xPosition": 334.0966514187793,
    "yPosition": 812,
    "color": "0deg 48.746176194629754%  91.7177011895702%",
    "opacity": 82,
    "pulseDirection": "shrink",
    "pulseRate": 0.1339379639575137
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 5,
    "xPosition": 203.00430135181023,
    "yPosition": 812,
    "color": "40.30281904608316deg 66.391855020869%  46.05582041796425%",
    "opacity": 46,
    "pulseDirection": "shrink",
    "pulseRate": 0.47950431705940294
  },
  {
    "radius": 24,
    "minRadius": 24,
    "maxRadius": 24,
    "xPosition": 550.2802482125329,
    "yPosition": 812,
    "color": "0deg 66.99085788897199%  97.12791699505918%",
    "opacity": 79,
    "pulseDirection": "grow",
    "pulseRate": 0.4930771017961423
  },
  {
    "radius": 22,
    "minRadius": 22,
    "maxRadius": 7,
    "xPosition": 155.33638371339532,
    "yPosition": 812,
    "color": "118.52403052181303deg 65.82418281229899%  42.250178740463134%",
    "opacity": 60,
    "pulseDirection": "shrink",
    "pulseRate": 0.2756355947786088
  },
  {
    "radius": 13.571809125245451,
    "minRadius": 12,
    "maxRadius": 14,
    "xPosition": 319.7597517458867,
    "yPosition": 812,
    "color": "0deg 55.57820412831627%  92.19889108666375%",
    "opacity": 86,
    "pulseDirection": "grow",
    "pulseRate": 0.3929522813113636
  },
  {
    "radius": 9.779890494116373,
    "minRadius": 8,
    "maxRadius": 10,
    "xPosition": 113.06994036769242,
    "yPosition": 812,
    "color": "120.15970767330093deg 64.90928365555001%  42.12066266381556%",
    "opacity": 79,
    "pulseDirection": "grow",
    "pulseRate": 0.44497262352909367
  },
  {
    "radius": 11.923693265830345,
    "minRadius": 10,
    "maxRadius": 15,
    "xPosition": 442.66157189628314,
    "yPosition": 812,
    "color": "0deg 58.6360751709761%  96.52065921875122%",
    "opacity": 54,
    "pulseDirection": "grow",
    "pulseRate": 0.4809233164575856
  },
  {
    "radius": 12,
    "minRadius": 12,
    "maxRadius": 10,
    "xPosition": 132.29955100122243,
    "yPosition": 812,
    "color": "107.16513276254278deg 44.87556495381089%  53.280388687400375%",
    "opacity": 55,
    "pulseDirection": "shrink",
    "pulseRate": 0.16751478790636287
  }
];


// const getColor = () => {
//   const randomGreen = `${getRandomArbitrary(100, 130)}deg ${getRandomArbitrary(40, 70)}%  ${getRandomArbitrary(40, 60)}%`;
//   const randomWhite = `0deg ${getRandomArbitrary(40, 70)}%  ${getRandomArbitrary(90, 100)}%`;
//
//   switch (Math.floor(getRandomArbitrary(1, 12))) {
//     case 1:
//     case 2:
//     case 3:
//     case 4:
//     case 5:
//       return randomGreen;
//     case 8:
//       return randomGreen;
//     default:
//       return randomWhite;
//   }
// }

onMounted(() => {
  const canvas = document.getElementById('tree')! as HTMLCanvasElement;
  const canvasWidth = parseInt(canvas.getAttribute('width')!, 10);
  const canvasHeight = parseInt(canvas.getAttribute('height')!, 10);
  // const canvasCenterX = canvasWidth / 2;
  const ctx = canvas.getContext('2d')!;
  // const minPulseRadius = 2;
  // const maxPulseRadius = canvasHeight / 32;

  // const colors = [
  //   getColor(), getColor(), getColor(), getColor(),
  //   getColor(), getColor(), getColor(), getColor(),
  //   getColor(), getColor(), getColor(), getColor(),
  //   getColor(), getColor(), getColor(), getColor(),
  //   getColor(), getColor(), getColor(), getColor(),
  //   getColor(), getColor(), getColor(), getColor(),
  // ];

  //
  // const circles: {
  //   radius: number;
  //   minRadius: number;
  //   maxRadius: number;
  //   xPosition: any;
  //   yPosition: number;
  //   color: string;
  //   opacity: number;
  //   pulseDirection: string;
  //   pulseRate: any
  // }[] = [];
  //
  // for (let y = 1; y < 30; y++) {
  //   const yPosition = 28 * y;
  //   const xPositionVariance = y * 12;
  //   for (let i = 0; i < y; i++) {
  //     const startRadius = Math.round(getRandomArbitrary(minPulseRadius, maxPulseRadius));
  //     const maxRadius = Math.round(getRandomArbitrary(minPulseRadius, maxPulseRadius));
  //     const xPosition = getRandomArbitrary(canvasCenterX + xPositionVariance, canvasCenterX - xPositionVariance);
  //     const colorValueIndex = y === 1 ? 17 : Math.round(getRandomArbitrary(0, colors.length - 1));
  //     const opacity = Math.round(getRandomArbitrary(0.2, 0.9) * 100);
  //
  //     const circle = {
  //       radius: startRadius,
  //       minRadius: startRadius,
  //       maxRadius: maxRadius,
  //       xPosition: xPosition,
  //       yPosition: yPosition,
  //       color: colors[colorValueIndex],
  //       opacity: opacity,
  //       pulseDirection: i % 2 === 0 ? 'grow' : 'shrink',
  //       pulseRate: getRandomArbitrary(0, 0.55)
  //     }
  //     circles.push(circle);
  //   }
  // }

  const pulse = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    circles.forEach(function (c) {
      if (c.pulseDirection === 'grow') {
        c.radius = c.radius + c.pulseRate;
        if (c.radius > c.maxRadius) {
          c.pulseDirection = 'shrink';
        }
      } else {
        c.radius = c.radius - c.pulseRate;
        if (c.radius < c.minRadius) {
          c.pulseDirection = 'grow';
        }
      }
      ctx.beginPath();
      ctx.fillStyle = 'hsl(' + c.color + '/' + c.opacity + '%)';
      ctx.arc(c.xPosition, c.yPosition, c.radius, 0, (Math.PI / 180) * 360);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
    window.requestAnimationFrame(pulse);
  }

  window.requestAnimationFrame(pulse);

});

</script>

<template>

  <canvas
      :data-sidebar="sidebar"
      id="tree"
      width="730" height="900"
      class="fixed bottom-0 top-2/3 w-64 h-available -mb-6 -translate-x-full sidebar-open:translate-x-0 duration-300 transition-all delay-300"
  ></canvas>
</template>

<style scoped>

</style>