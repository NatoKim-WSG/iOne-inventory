/**
 * Philippine province and municipality coordinate lookup table.
 * Used to geo-locate Starlink kits on the map view.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

// ── Province capitals / centers ──────────────────────────────────────
export const PROVINCE_COORDS: Record<string, LatLng> = {
  // NCR
  "metro manila": { lat: 14.5995, lng: 120.9842 },
  "ncr": { lat: 14.5995, lng: 120.9842 },

  // CAR
  "abra": { lat: 17.5951, lng: 120.6300 },
  "apayao": { lat: 18.0120, lng: 121.1710 },
  "benguet": { lat: 16.4023, lng: 120.5960 },
  "ifugao": { lat: 16.8301, lng: 121.1710 },
  "kalinga": { lat: 17.4740, lng: 121.3625 },
  "mountain province": { lat: 17.0494, lng: 121.1139 },

  // Region I
  "ilocos norte": { lat: 18.1647, lng: 120.7116 },
  "ilocos sur": { lat: 17.2208, lng: 120.5697 },
  "la union": { lat: 16.6159, lng: 120.3209 },
  "pangasinan": { lat: 15.8949, lng: 120.2863 },

  // Region II
  "batanes": { lat: 20.4487, lng: 121.9702 },
  "cagayan": { lat: 17.6132, lng: 121.7270 },
  "isabela": { lat: 16.9754, lng: 121.8107 },
  "nueva vizcaya": { lat: 16.3301, lng: 121.1710 },
  "quirino": { lat: 16.4900, lng: 121.5322 },

  // Region III
  "aurora": { lat: 15.9900, lng: 121.6322 },
  "bataan": { lat: 14.6417, lng: 120.4818 },
  "bulacan": { lat: 14.7942, lng: 120.8800 },
  "nueva ecija": { lat: 15.5784, lng: 121.1113 },
  "pampanga": { lat: 15.0794, lng: 120.6200 },
  "tarlac": { lat: 15.4453, lng: 120.5963 },
  "zambales": { lat: 15.5082, lng: 120.0697 },

  // Region IV-A (CALABARZON)
  "batangas": { lat: 13.7565, lng: 121.0583 },
  "cavite": { lat: 14.2456, lng: 120.8786 },
  "laguna": { lat: 14.2691, lng: 121.4113 },
  "quezon": { lat: 14.0313, lng: 122.1106 },
  "rizal": { lat: 14.6037, lng: 121.3084 },

  // Region IV-B (MIMAROPA)
  "marinduque": { lat: 13.4771, lng: 121.9032 },
  "occidental mindoro": { lat: 12.8797, lng: 120.9893 },
  "oriental mindoro": { lat: 12.9867, lng: 121.4064 },
  "palawan": { lat: 9.8349, lng: 118.7384 },
  "romblon": { lat: 12.5778, lng: 122.2714 },

  // Region V (Bicol)
  "albay": { lat: 13.1775, lng: 123.7280 },
  "camarines norte": { lat: 14.1389, lng: 122.7632 },
  "camarines sur": { lat: 13.5250, lng: 123.3486 },
  "catanduanes": { lat: 13.7089, lng: 124.2422 },
  "masbate": { lat: 12.3574, lng: 123.5504 },
  "sorsogon": { lat: 12.9704, lng: 124.0072 },

  // Region VI (Western Visayas)
  "aklan": { lat: 11.8166, lng: 122.0942 },
  "antique": { lat: 11.3683, lng: 122.0013 },
  "capiz": { lat: 11.5521, lng: 122.7406 },
  "guimaras": { lat: 10.5928, lng: 122.6325 },
  "iloilo": { lat: 10.7202, lng: 122.5621 },
  "negros occidental": { lat: 10.2926, lng: 123.0247 },

  // Region VII (Central Visayas)
  "bohol": { lat: 9.8500, lng: 124.0000 },
  "cebu": { lat: 10.3157, lng: 123.8854 },
  "negros oriental": { lat: 9.6168, lng: 123.0107 },
  "siquijor": { lat: 9.1985, lng: 123.5950 },

  // Region VIII (Eastern Visayas)
  "biliran": { lat: 11.5836, lng: 124.4649 },
  "eastern samar": { lat: 11.5010, lng: 125.4970 },
  "leyte": { lat: 10.4098, lng: 124.9500 },
  "northern samar": { lat: 12.3591, lng: 124.3430 },
  "samar": { lat: 11.7500, lng: 124.9600 },
  "western samar": { lat: 11.7500, lng: 124.9600 },
  "southern leyte": { lat: 10.1340, lng: 125.1717 },

  // Region IX (Zamboanga Peninsula)
  "zamboanga del norte": { lat: 8.1527, lng: 123.2581 },
  "zamboanga del sur": { lat: 7.8383, lng: 123.2964 },
  "zamboanga sibugay": { lat: 7.5222, lng: 122.8198 },

  // Region X (Northern Mindanao)
  "bukidnon": { lat: 8.0515, lng: 125.0499 },
  "camiguin": { lat: 9.1733, lng: 124.7281 },
  "lanao del norte": { lat: 8.0730, lng: 124.2873 },
  "misamis occidental": { lat: 8.3376, lng: 123.7070 },
  "misamis oriental": { lat: 8.5046, lng: 124.6220 },

  // Region XI (Davao)
  "davao de oro": { lat: 7.8242, lng: 126.1495 },
  "compostela valley": { lat: 7.8242, lng: 126.1495 },
  "davao del norte": { lat: 7.5622, lng: 125.6545 },
  "davao del sur": { lat: 6.7656, lng: 125.3284 },
  "davao occidental": { lat: 6.1055, lng: 125.5795 },
  "davao oriental": { lat: 7.3172, lng: 126.5420 },

  // Region XII (SOCCSKSARGEN)
  "cotabato": { lat: 7.1907, lng: 124.2195 },
  "north cotabato": { lat: 7.1907, lng: 124.2195 },
  "sarangani": { lat: 5.9631, lng: 125.1940 },
  "south cotabato": { lat: 6.2969, lng: 124.8513 },
  "sultan kudarat": { lat: 6.5069, lng: 124.4198 },

  // Region XIII (Caraga)
  "agusan del norte": { lat: 8.9456, lng: 125.5320 },
  "agusan del sur": { lat: 8.1513, lng: 125.8952 },
  "dinagat islands": { lat: 10.1280, lng: 125.6083 },
  "surigao del norte": { lat: 9.7877, lng: 125.4950 },
  "surigao del sur": { lat: 8.7512, lng: 126.1383 },

  // BARMM
  "basilan": { lat: 6.4221, lng: 121.9690 },
  "lanao del sur": { lat: 7.8232, lng: 124.4198 },
  "maguindanao": { lat: 7.0045, lng: 124.2833 },
  "maguindanao del norte": { lat: 7.2000, lng: 124.3500 },
  "maguindanao del sur": { lat: 6.8500, lng: 124.2500 },
  "sulu": { lat: 5.9749, lng: 121.0335 },
  "tawi-tawi": { lat: 5.1339, lng: 119.9510 },

  // Cities often listed as provinces
  "zamboanga city": { lat: 6.9214, lng: 122.0790 },
  "davao city": { lat: 7.1907, lng: 125.4553 },
  "cagayan de oro": { lat: 8.4542, lng: 124.6319 },
  "general santos": { lat: 6.1164, lng: 125.1716 },
  "cotabato city": { lat: 7.2047, lng: 124.2310 },

  // Special province entries from actual data
  "city of isabela": { lat: 6.7028, lng: 121.9694 },
  "city of lamitan": { lat: 6.6497, lng: 122.1303 },
  "sangley point": { lat: 14.4952, lng: 120.9123 },
  "special geographic area": { lat: 12.8797, lng: 121.774 },
};

// ── Municipality-level coordinates (PROVINCE|MUNICIPALITY key) ───────
// Covers major municipalities appearing in Starlink inventory data
export const MUNICIPALITY_COORDS: Record<string, LatLng> = {
  // NCR / Metro Manila cities
  "metro manila|manila": { lat: 14.5995, lng: 120.9842 },
  "metro manila|quezon city": { lat: 14.6760, lng: 121.0437 },
  "metro manila|makati": { lat: 14.5547, lng: 121.0244 },
  "metro manila|taguig": { lat: 14.5176, lng: 121.0509 },
  "metro manila|pasig": { lat: 14.5764, lng: 121.0851 },
  "metro manila|mandaluyong": { lat: 14.5794, lng: 121.0359 },
  "metro manila|paranaque": { lat: 14.4793, lng: 121.0198 },
  "metro manila|pasay": { lat: 14.5378, lng: 121.0014 },
  "metro manila|caloocan": { lat: 14.6488, lng: 120.9668 },
  "metro manila|valenzuela": { lat: 14.6942, lng: 120.9609 },
  "metro manila|las pinas": { lat: 14.4445, lng: 120.9939 },
  "metro manila|muntinlupa": { lat: 14.4081, lng: 121.0415 },
  "metro manila|marikina": { lat: 14.6507, lng: 121.1029 },
  "metro manila|san juan": { lat: 14.6019, lng: 121.0355 },
  "metro manila|navotas": { lat: 14.6667, lng: 120.9417 },
  "metro manila|malabon": { lat: 14.6625, lng: 120.9567 },
  "metro manila|pateros": { lat: 14.5446, lng: 121.0671 },

  // Bulacan
  "bulacan|malolos": { lat: 14.8433, lng: 120.8114 },
  "bulacan|meycauayan": { lat: 14.7369, lng: 120.9600 },
  "bulacan|san jose del monte": { lat: 14.8139, lng: 121.0453 },
  "bulacan|marilao": { lat: 14.7575, lng: 120.9486 },
  "bulacan|bocaue": { lat: 14.7989, lng: 120.9286 },
  "bulacan|balagtas": { lat: 14.8150, lng: 120.9089 },
  "bulacan|guiguinto": { lat: 14.8331, lng: 120.8806 },
  "bulacan|plaridel": { lat: 14.8867, lng: 120.8558 },
  "bulacan|pulilan": { lat: 14.9036, lng: 120.8494 },
  "bulacan|calumpit": { lat: 14.9167, lng: 120.7667 },
  "bulacan|hagonoy": { lat: 14.8333, lng: 120.7333 },
  "bulacan|paombong": { lat: 14.8333, lng: 120.7833 },
  "bulacan|obando": { lat: 14.7103, lng: 120.9361 },
  "bulacan|pandi": { lat: 14.8650, lng: 120.9553 },
  "bulacan|santa maria": { lat: 14.8147, lng: 121.0000 },
  "bulacan|norzagaray": { lat: 14.9092, lng: 121.0483 },
  "bulacan|angat": { lat: 14.9278, lng: 121.0286 },
  "bulacan|bustos": { lat: 14.9533, lng: 120.9186 },
  "bulacan|baliuag": { lat: 14.9544, lng: 120.8992 },
  "bulacan|san rafael": { lat: 15.0006, lng: 120.9472 },
  "bulacan|san ildefonso": { lat: 15.0769, lng: 120.9400 },
  "bulacan|san miguel": { lat: 15.1333, lng: 120.9667 },
  "bulacan|dona remedios trinidad": { lat: 15.0036, lng: 121.0794 },

  // Pampanga
  "pampanga|san fernando": { lat: 15.0286, lng: 120.6937 },
  "pampanga|angeles": { lat: 15.1450, lng: 120.5887 },
  "pampanga|angeles city": { lat: 15.1450, lng: 120.5887 },
  "pampanga|mabalacat": { lat: 15.2178, lng: 120.5736 },
  "pampanga|porac": { lat: 15.0722, lng: 120.5414 },
  "pampanga|apalit": { lat: 14.9500, lng: 120.7500 },
  "pampanga|macabebe": { lat: 14.9083, lng: 120.7139 },
  "pampanga|mexico": { lat: 15.0625, lng: 120.7183 },
  "pampanga|guagua": { lat: 14.9667, lng: 120.6333 },
  "pampanga|lubao": { lat: 14.9433, lng: 120.6000 },
  "pampanga|floridablanca": { lat: 14.9833, lng: 120.5000 },
  "pampanga|arayat": { lat: 15.1500, lng: 120.7700 },
  "pampanga|magalang": { lat: 15.2167, lng: 120.6667 },
  "pampanga|candaba": { lat: 15.0933, lng: 120.8292 },
  "pampanga|bacolor": { lat: 15.0367, lng: 120.6419 },
  "pampanga|santa rita": { lat: 14.9897, lng: 120.5997 },
  "pampanga|santo tomas": { lat: 15.1500, lng: 120.6167 },

  // Tarlac
  "tarlac|tarlac city": { lat: 15.4453, lng: 120.5963 },
  "tarlac|concepcion": { lat: 15.3233, lng: 120.6553 },
  "tarlac|capas": { lat: 15.3264, lng: 120.5897 },
  "tarlac|paniqui": { lat: 15.6603, lng: 120.5742 },
  "tarlac|gerona": { lat: 15.6083, lng: 120.5917 },
  "tarlac|victoria": { lat: 15.5753, lng: 120.6742 },
  "tarlac|camiling": { lat: 15.6864, lng: 120.4122 },

  // Nueva Ecija
  "nueva ecija|cabanatuan": { lat: 15.4867, lng: 120.9692 },
  "nueva ecija|cabanatuan city": { lat: 15.4867, lng: 120.9692 },
  "nueva ecija|san jose city": { lat: 15.7889, lng: 120.9944 },
  "nueva ecija|palayan": { lat: 15.5403, lng: 121.0842 },
  "nueva ecija|guimba": { lat: 15.6583, lng: 120.7667 },
  "nueva ecija|talavera": { lat: 15.5883, lng: 120.9197 },
  "nueva ecija|gapan": { lat: 15.3100, lng: 120.9461 },
  "nueva ecija|science city of munoz": { lat: 15.7150, lng: 120.9047 },

  // Cavite
  "cavite|bacoor": { lat: 14.4581, lng: 120.9736 },
  "cavite|dasmarinas": { lat: 14.3294, lng: 120.9367 },
  "cavite|imus": { lat: 14.4297, lng: 120.9367 },
  "cavite|general trias": { lat: 14.3886, lng: 120.8808 },
  "cavite|cavite city": { lat: 14.4833, lng: 120.8961 },
  "cavite|rosario": { lat: 14.4136, lng: 120.8553 },
  "cavite|silang": { lat: 14.2311, lng: 120.9744 },
  "cavite|tagaytay": { lat: 14.1153, lng: 120.9621 },

  // Laguna
  "laguna|san pedro": { lat: 14.3595, lng: 121.0473 },
  "laguna|binan": { lat: 14.3409, lng: 121.0809 },
  "laguna|santa rosa": { lat: 14.3122, lng: 121.1114 },
  "laguna|calamba": { lat: 14.2117, lng: 121.1653 },
  "laguna|los banos": { lat: 14.1690, lng: 121.2432 },
  "laguna|san pablo": { lat: 14.0672, lng: 121.3242 },
  "laguna|cabuyao": { lat: 14.2722, lng: 121.1250 },

  // Batangas
  "batangas|batangas city": { lat: 13.7565, lng: 121.0583 },
  "batangas|lipa": { lat: 13.9413, lng: 121.1629 },
  "batangas|tanauan": { lat: 14.0863, lng: 121.1525 },
  "batangas|nasugbu": { lat: 14.0693, lng: 120.6333 },
  "batangas|santo tomas": { lat: 14.1055, lng: 121.1437 },

  // Rizal
  "rizal|antipolo": { lat: 14.5860, lng: 121.1761 },
  "rizal|cainta": { lat: 14.5735, lng: 121.1222 },
  "rizal|taytay": { lat: 14.5582, lng: 121.1346 },
  "rizal|angono": { lat: 14.5284, lng: 121.1535 },
  "rizal|binangonan": { lat: 14.4653, lng: 121.1947 },
  "rizal|rodriguez": { lat: 14.7431, lng: 121.1147 },

  // Quezon
  "quezon|lucena": { lat: 13.9373, lng: 121.6170 },
  "quezon|lucena city": { lat: 13.9373, lng: 121.6170 },
  "quezon|tayabas": { lat: 14.0222, lng: 121.5908 },
  "quezon|candelaria": { lat: 13.9312, lng: 121.4234 },
  "quezon|sariaya": { lat: 13.9632, lng: 121.5258 },

  // Pangasinan
  "pangasinan|dagupan": { lat: 16.0433, lng: 120.3356 },
  "pangasinan|urdaneta": { lat: 15.9759, lng: 120.5712 },
  "pangasinan|lingayen": { lat: 16.0185, lng: 120.2317 },
  "pangasinan|alaminos": { lat: 16.1558, lng: 119.9811 },
  "pangasinan|san carlos": { lat: 15.9267, lng: 120.3460 },
  "pangasinan|mangaldan": { lat: 16.0700, lng: 120.4028 },

  // Ilocos Norte
  "ilocos norte|laoag": { lat: 18.1980, lng: 120.5936 },
  "ilocos norte|laoag city": { lat: 18.1980, lng: 120.5936 },
  "ilocos norte|batac": { lat: 18.0556, lng: 120.5650 },
  "ilocos norte|pagudpud": { lat: 18.5614, lng: 120.7883 },

  // Ilocos Sur
  "ilocos sur|vigan": { lat: 17.5747, lng: 120.3869 },
  "ilocos sur|candon": { lat: 17.1964, lng: 120.4456 },

  // La Union
  "la union|san fernando": { lat: 16.6159, lng: 120.3209 },

  // Cagayan
  "cagayan|tuguegarao": { lat: 17.6132, lng: 121.7270 },
  "cagayan|tuguegarao city": { lat: 17.6132, lng: 121.7270 },
  "cagayan|aparri": { lat: 18.3567, lng: 121.6400 },

  // Isabela
  "isabela|ilagan": { lat: 17.1485, lng: 121.8891 },
  "isabela|cauayan": { lat: 16.9308, lng: 121.7711 },
  "isabela|santiago": { lat: 16.6892, lng: 121.5486 },

  // Benguet
  "benguet|baguio": { lat: 16.4023, lng: 120.5960 },
  "benguet|baguio city": { lat: 16.4023, lng: 120.5960 },
  "benguet|la trinidad": { lat: 16.4573, lng: 120.5870 },

  // Albay
  "albay|legazpi": { lat: 13.1391, lng: 123.7438 },
  "albay|legazpi city": { lat: 13.1391, lng: 123.7438 },
  "albay|daraga": { lat: 13.1590, lng: 123.6984 },
  "albay|tabaco": { lat: 13.3584, lng: 123.7352 },

  // Camarines Sur
  "camarines sur|naga": { lat: 13.6218, lng: 123.1948 },
  "camarines sur|naga city": { lat: 13.6218, lng: 123.1948 },
  "camarines sur|iriga": { lat: 13.4213, lng: 123.4114 },
  "camarines sur|pili": { lat: 13.5815, lng: 123.2753 },

  // Cebu
  "cebu|cebu city": { lat: 10.3157, lng: 123.8854 },
  "cebu|mandaue": { lat: 10.3236, lng: 123.9222 },
  "cebu|lapu-lapu": { lat: 10.3103, lng: 123.9494 },
  "cebu|talisay": { lat: 10.2446, lng: 123.8494 },
  "cebu|danao": { lat: 10.5167, lng: 124.0250 },
  "cebu|toledo": { lat: 10.3771, lng: 123.6390 },
  "cebu|carcar": { lat: 10.1064, lng: 123.6406 },
  "cebu|naga": { lat: 10.2091, lng: 123.7586 },
  "cebu|consolacion": { lat: 10.3796, lng: 123.9567 },

  // Iloilo
  "iloilo|iloilo city": { lat: 10.6969, lng: 122.5644 },
  "iloilo|oton": { lat: 10.6933, lng: 122.4761 },

  // Negros Occidental
  "negros occidental|bacolod": { lat: 10.6763, lng: 122.9509 },
  "negros occidental|bacolod city": { lat: 10.6763, lng: 122.9509 },
  "negros occidental|silay": { lat: 10.8117, lng: 122.9694 },
  "negros occidental|talisay": { lat: 10.7375, lng: 122.9672 },
  "negros occidental|sagay": { lat: 10.8944, lng: 123.1583 },

  // Bohol
  "bohol|tagbilaran": { lat: 9.6407, lng: 123.8544 },

  // Leyte
  "leyte|tacloban": { lat: 11.2543, lng: 124.9618 },
  "leyte|tacloban city": { lat: 11.2543, lng: 124.9618 },
  "leyte|ormoc": { lat: 11.0044, lng: 124.6075 },

  // Zamboanga del Norte
  "zamboanga del norte|dipolog": { lat: 8.5878, lng: 123.3403 },
  "zamboanga del norte|dapitan": { lat: 8.6556, lng: 123.4246 },

  // Zamboanga del Sur
  "zamboanga del sur|pagadian": { lat: 7.8262, lng: 123.4372 },

  // Bukidnon
  "bukidnon|malaybalay": { lat: 8.1575, lng: 125.1275 },
  "bukidnon|valencia": { lat: 7.9064, lng: 125.0939 },

  // Misamis Oriental
  "misamis oriental|cagayan de oro": { lat: 8.4542, lng: 124.6319 },
  "misamis oriental|gingoog": { lat: 8.8228, lng: 125.0983 },

  // Misamis Occidental
  "misamis occidental|ozamiz": { lat: 8.1481, lng: 123.8439 },
  "misamis occidental|oroquieta": { lat: 8.4847, lng: 123.8033 },

  // Lanao del Norte
  "lanao del norte|iligan": { lat: 8.2281, lng: 124.2453 },
  "lanao del norte|iligan city": { lat: 8.2281, lng: 124.2453 },

  // Lanao del Sur
  "lanao del sur|marawi": { lat: 7.9986, lng: 124.2928 },
  "lanao del sur|marawi city": { lat: 7.9986, lng: 124.2928 },

  // Davao del Norte
  "davao del norte|tagum": { lat: 7.4478, lng: 125.8078 },
  "davao del norte|panabo": { lat: 7.3083, lng: 125.6844 },

  // Davao del Sur
  "davao del sur|digos": { lat: 6.7497, lng: 125.3572 },
  "davao del sur|davao city": { lat: 7.1907, lng: 125.4553 },

  // Davao Oriental
  "davao oriental|mati": { lat: 6.9553, lng: 126.2168 },

  // Davao de Oro
  "davao de oro|nabunturan": { lat: 7.6094, lng: 125.9647 },

  // Cotabato / North Cotabato
  "cotabato|kidapawan": { lat: 7.0083, lng: 125.0894 },
  "north cotabato|kidapawan": { lat: 7.0083, lng: 125.0894 },

  // South Cotabato
  "south cotabato|koronadal": { lat: 6.5028, lng: 124.8467 },
  "south cotabato|general santos": { lat: 6.1164, lng: 125.1716 },

  // Sultan Kudarat
  "sultan kudarat|isulan": { lat: 6.6289, lng: 124.6000 },
  "sultan kudarat|tacurong": { lat: 6.6928, lng: 124.6756 },

  // Sarangani
  "sarangani|alabel": { lat: 6.1019, lng: 125.2858 },

  // Agusan del Norte
  "agusan del norte|butuan": { lat: 8.9475, lng: 125.5406 },
  "agusan del norte|butuan city": { lat: 8.9475, lng: 125.5406 },

  // Agusan del Sur
  "agusan del sur|san francisco": { lat: 8.5000, lng: 125.9833 },
  "agusan del sur|prosperidad": { lat: 8.6046, lng: 125.9157 },

  // Surigao del Norte
  "surigao del norte|surigao city": { lat: 9.7877, lng: 125.4950 },

  // Surigao del Sur
  "surigao del sur|tandag": { lat: 9.0714, lng: 126.1983 },
  "surigao del sur|bislig": { lat: 8.2153, lng: 126.3514 },

  // Maguindanao
  "maguindanao|cotabato city": { lat: 7.2047, lng: 124.2310 },

  // Basilan
  "basilan|isabela city": { lat: 6.7028, lng: 121.9694 },
  "basilan|lamitan": { lat: 6.6497, lng: 122.1303 },

  // Sulu
  "sulu|jolo": { lat: 6.0500, lng: 121.0028 },

  // Tawi-Tawi
  "tawi-tawi|bongao": { lat: 5.0292, lng: 119.7731 },

  // Palawan
  "palawan|puerto princesa": { lat: 9.7407, lng: 118.7353 },
  "palawan|el nido": { lat: 11.1833, lng: 119.4000 },
  "palawan|coron": { lat: 11.9986, lng: 120.2043 },

  // Zambales
  "zambales|olongapo": { lat: 14.8293, lng: 120.2852 },
  "zambales|subic": { lat: 14.8769, lng: 120.2339 },
  "zambales|iba": { lat: 15.3267, lng: 119.9781 },

  // Bataan
  "bataan|balanga": { lat: 14.6775, lng: 120.5360 },
  "bataan|mariveles": { lat: 14.4331, lng: 120.4836 },

  // Aurora
  "aurora|baler": { lat: 15.7579, lng: 121.5633 },

  // Aklan
  "aklan|kalibo": { lat: 11.7061, lng: 122.3642 },

  // Antique
  "antique|san jose de buenavista": { lat: 10.7472, lng: 121.9367 },

  // Capiz
  "capiz|roxas city": { lat: 11.5853, lng: 122.7511 },

  // Eastern Samar
  "eastern samar|borongan": { lat: 11.6083, lng: 125.4356 },

  // Northern Samar
  "northern samar|catarman": { lat: 12.4989, lng: 124.6375 },

  // Samar / Western Samar
  "samar|catbalogan": { lat: 11.7756, lng: 124.8858 },
  "western samar|catbalogan": { lat: 11.7756, lng: 124.8858 },

  // Southern Leyte
  "southern leyte|maasin": { lat: 10.1353, lng: 124.8497 },

  // Sorsogon
  "sorsogon|sorsogon city": { lat: 12.9704, lng: 124.0072 },

  // Masbate
  "masbate|masbate city": { lat: 12.3674, lng: 123.6190 },

  // Catanduanes
  "catanduanes|virac": { lat: 13.5831, lng: 124.2333 },

  // Camarines Norte
  "camarines norte|daet": { lat: 14.1122, lng: 122.9553 },

  // Marinduque
  "marinduque|boac": { lat: 13.4456, lng: 121.8428 },

  // Romblon
  "romblon|romblon": { lat: 12.5778, lng: 122.2714 },

  // Oriental Mindoro
  "oriental mindoro|calapan": { lat: 13.4115, lng: 121.1803 },

  // Occidental Mindoro
  "occidental mindoro|mamburao": { lat: 13.2222, lng: 120.5958 },

  // Nueva Vizcaya
  "nueva vizcaya|bayombong": { lat: 16.4833, lng: 121.1500 },

  // Quirino
  "quirino|cabarroguis": { lat: 16.5133, lng: 121.5011 },

  // Ifugao
  "ifugao|lagawe": { lat: 16.7983, lng: 121.1072 },

  // Mountain Province
  "mountain province|bontoc": { lat: 17.0889, lng: 121.0022 },

  // Kalinga
  "kalinga|tabuk": { lat: 17.4181, lng: 121.4443 },

  // Apayao
  "apayao|luna": { lat: 18.2422, lng: 121.2861 },

  // Abra
  "abra|bangued": { lat: 17.5951, lng: 120.6178 },

  // Negros Oriental
  "negros oriental|dumaguete": { lat: 9.3068, lng: 123.3054 },
  "negros oriental|dumaguete city": { lat: 9.3068, lng: 123.3054 },

  // Siquijor
  "siquijor|siquijor": { lat: 9.2141, lng: 123.5100 },

  // Guimaras
  "guimaras|jordan": { lat: 10.5847, lng: 122.5569 },

  // Biliran
  "biliran|naval": { lat: 11.5667, lng: 124.3667 },

  // Camiguin
  "camiguin|mambajao": { lat: 9.2514, lng: 124.7192 },

  // Dinagat Islands
  "dinagat islands|san jose": { lat: 10.1467, lng: 125.5897 },

  // Zamboanga Sibugay
  "zamboanga sibugay|ipil": { lat: 7.7847, lng: 122.5869 },

  // Zambales additional
  "zambales|san antonio": { lat: 15.0047, lng: 120.0686 },
  "zambales|botolan": { lat: 15.2889, lng: 120.0236 },
  "zambales|san narciso": { lat: 15.0150, lng: 120.0889 },
  "zambales|castillejos": { lat: 14.9328, lng: 120.2028 },

  // Zamboanga City (listed as province)
  "zamboanga city|zamboanga city": { lat: 6.9214, lng: 122.0790 },
};

// ── Storage Hub coordinates ──────────────────────────────────────────
// Map storage hub names (normalized) to coordinates
export const STORAGE_HUB_COORDS: Record<string, LatLng> = {
  // NCR / Luzon hubs
  "makati": { lat: 14.5547, lng: 121.0244 },
  "taguig": { lat: 14.5176, lng: 121.0509 },
  "pasig": { lat: 14.5764, lng: 121.0851 },
  "mandaluyong": { lat: 14.5794, lng: 121.0359 },
  "quezon city": { lat: 14.6760, lng: 121.0437 },
  "manila": { lat: 14.5995, lng: 120.9842 },
  "paranaque": { lat: 14.4793, lng: 121.0198 },
  "bgc": { lat: 14.5506, lng: 121.0517 },
  "alabang": { lat: 14.4229, lng: 121.0390 },
  "ortigas": { lat: 14.5880, lng: 121.0614 },
  "northgate": { lat: 14.5501, lng: 121.0504 },

  // Central Luzon
  "clark": { lat: 15.1852, lng: 120.5463 },
  "angeles": { lat: 15.1450, lng: 120.5887 },
  "san fernando pampanga": { lat: 15.0286, lng: 120.6937 },
  "tarlac": { lat: 15.4453, lng: 120.5963 },
  "cabanatuan": { lat: 15.4867, lng: 120.9692 },
  "subic": { lat: 14.8769, lng: 120.2339 },
  "olongapo": { lat: 14.8293, lng: 120.2852 },
  "malolos": { lat: 14.8433, lng: 120.8114 },

  // South Luzon
  "batangas": { lat: 13.7565, lng: 121.0583 },
  "calamba": { lat: 14.2117, lng: 121.1653 },
  "santa rosa": { lat: 14.3122, lng: 121.1114 },
  "lipa": { lat: 13.9413, lng: 121.1629 },
  "lucena": { lat: 13.9373, lng: 121.6170 },
  "dasmarinas": { lat: 14.3294, lng: 120.9367 },
  "bacoor": { lat: 14.4581, lng: 120.9736 },
  "antipolo": { lat: 14.5860, lng: 121.1761 },

  // Bicol
  "legazpi": { lat: 13.1391, lng: 123.7438 },
  "naga": { lat: 13.6218, lng: 123.1948 },

  // Visayas
  "cebu": { lat: 10.3157, lng: 123.8854 },
  "cebu city": { lat: 10.3157, lng: 123.8854 },
  "mandaue": { lat: 10.3236, lng: 123.9222 },
  "lapu-lapu": { lat: 10.3103, lng: 123.9494 },
  "iloilo": { lat: 10.6969, lng: 122.5644 },
  "iloilo city": { lat: 10.6969, lng: 122.5644 },
  "bacolod": { lat: 10.6763, lng: 122.9509 },
  "tacloban": { lat: 11.2543, lng: 124.9618 },
  "dumaguete": { lat: 9.3068, lng: 123.3054 },
  "tagbilaran": { lat: 9.6407, lng: 123.8544 },
  "kalibo": { lat: 11.7061, lng: 122.3642 },
  "roxas": { lat: 11.5853, lng: 122.7511 },
  "ormoc": { lat: 11.0044, lng: 124.6075 },

  // Mindanao
  "davao": { lat: 7.1907, lng: 125.4553 },
  "davao city": { lat: 7.1907, lng: 125.4553 },
  "cagayan de oro": { lat: 8.4542, lng: 124.6319 },
  "general santos": { lat: 6.1164, lng: 125.1716 },
  "zamboanga": { lat: 6.9214, lng: 122.0790 },
  "zamboanga city": { lat: 6.9214, lng: 122.0790 },
  "butuan": { lat: 8.9475, lng: 125.5406 },
  "cotabato": { lat: 7.2047, lng: 124.2310 },
  "cotabato city": { lat: 7.2047, lng: 124.2310 },
  "kidapawan": { lat: 7.0083, lng: 125.0894 },
  "koronadal": { lat: 6.5028, lng: 124.8467 },
  "tagum": { lat: 7.4478, lng: 125.8078 },
  "pagadian": { lat: 7.8262, lng: 123.4372 },
  "dipolog": { lat: 8.5878, lng: 123.3403 },
  "ozamiz": { lat: 8.1481, lng: 123.8439 },
  "iligan": { lat: 8.2281, lng: 124.2453 },
  "malaybalay": { lat: 8.1575, lng: 125.1275 },
  "surigao": { lat: 9.7877, lng: 125.4950 },
  "tandag": { lat: 9.0714, lng: 126.1983 },
  "marawi": { lat: 7.9986, lng: 124.2928 },
  "jolo": { lat: 6.0500, lng: 121.0028 },
  "bongao": { lat: 5.0292, lng: 119.7731 },
  "isabela city basilan": { lat: 6.7028, lng: 121.9694 },

  // Palawan
  "puerto princesa": { lat: 9.7407, lng: 118.7353 },

  // Baguio / CAR
  "baguio": { lat: 16.4023, lng: 120.5960 },
  "baguio city": { lat: 16.4023, lng: 120.5960 },
  "la trinidad": { lat: 16.4573, lng: 120.5870 },

  // Cagayan Valley
  "tuguegarao": { lat: 17.6132, lng: 121.7270 },
  "ilagan": { lat: 17.1485, lng: 121.8891 },
  "cauayan": { lat: 16.9308, lng: 121.7711 },
  "santiago": { lat: 16.6892, lng: 121.5486 },

  // Ilocos
  "laoag": { lat: 18.1980, lng: 120.5936 },
  "vigan": { lat: 17.5747, lng: 120.3869 },
  "dagupan": { lat: 16.0433, lng: 120.3356 },
  "urdaneta": { lat: 15.9759, lng: 120.5712 },
  "san fernando la union": { lat: 16.6159, lng: 120.3209 },

  // Additional Mindanao locations from actual hub addresses
  "gingoog": { lat: 8.8228, lng: 125.0983 },
  "naawan": { lat: 8.4333, lng: 124.3000 },
  "oroquieta": { lat: 8.4847, lng: 123.8033 },
  "kauswagan": { lat: 8.1828, lng: 124.0892 },
  "manolo fortich": { lat: 8.3681, lng: 124.8636 },
  "el salvador": { lat: 8.5622, lng: 124.5189 },
  "clarin": { lat: 8.2128, lng: 123.8483 },
  "dapa": { lat: 9.7564, lng: 126.0528 },
  "liloy": { lat: 8.0922, lng: 122.6708 },
  "basey": { lat: 11.2833, lng: 125.0667 },
  "guihulngan": { lat: 10.1164, lng: 123.2683 },
  "bayugan": { lat: 8.7133, lng: 125.7672 },
  "sogod": { lat: 10.3917, lng: 124.9750 },
  "dulag": { lat: 11.0431, lng: 124.9536 },
  "mahinog": { lat: 9.1667, lng: 124.8333 },
  "hamtic": { lat: 10.7056, lng: 121.9800 },
  "pototan": { lat: 10.9467, lng: 122.6336 },
  "dauis": { lat: 9.6253, lng: 123.8675 },
  "coron": { lat: 11.9986, lng: 120.2043 },
  "santa cruz marinduque": { lat: 13.4722, lng: 121.9822 },
  "toril": { lat: 7.0572, lng: 125.4422 },
  "sta. rosa": { lat: 14.3122, lng: 121.1114 },
  "quezon bukidnon": { lat: 7.7283, lng: 125.0986 },

  // Common warehouse names
  "ione warehouse": { lat: 14.5547, lng: 121.0244 },
  "ione": { lat: 14.5547, lng: 121.0244 },
  "main warehouse": { lat: 14.5547, lng: 121.0244 },
  "warehouse": { lat: 14.5547, lng: 121.0244 },
  "pasig storage hub": { lat: 14.5764, lng: 121.0851 },
};

/**
 * Resolve coordinates for a kit.
 *
 * Deployed kits: look up address (school name) in SWIP coordinates.
 *   Only kits with a real coordinate match from the SWIP sheet are placed.
 *   Non-SWIP deployed kits (no school name match) return null (unmapped).
 *
 * In-storage kits: use storage hub coordinate lookup.
 */
export function resolveCoordinates(
  province: string,
  municipality: string,
  storageHub: string,
  status: string,
  swipCoords?: Record<string, LatLng>,
  address?: string
): LatLng | null {
  const hub = storageHub.trim().toLowerCase();

  // ── Deployed kits: SWIP school-level coordinates only ──
  if (status === "Deployed") {
    const addr = (address || "").trim().toLowerCase();
    if (swipCoords && addr && swipCoords[addr]) {
      return swipCoords[addr];
    }
    // No SWIP match → unmapped (no static fallbacks for deployed kits)
    return null;
  }

  // ── In-storage kits: use storage hub coordinates ──
  if (hub && STORAGE_HUB_COORDS[hub]) {
    return STORAGE_HUB_COORDS[hub];
  }

  // Try partial hub match — scan for known city/location keywords within hub address
  // Sort keys by length descending so longer (more specific) names match first
  if (hub) {
    const sortedKeys = Object.keys(STORAGE_HUB_COORDS).sort(
      (a, b) => b.length - a.length
    );
    for (const key of sortedKeys) {
      if (key.length >= 4 && hub.includes(key)) {
        return STORAGE_HUB_COORDS[key];
      }
    }
    // Also try matching province names within the hub address
    for (const [key, coords] of Object.entries(PROVINCE_COORDS)) {
      if (key.length >= 4 && hub.includes(key)) {
        return coords;
      }
    }
  }

  return null;
}
