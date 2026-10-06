export interface HistoryDocument {
  id: string;
  label: string; // e.g. "Belge 1:"
  title: string;
  content: string;
}

export const PRESET_DOCUMENTS: { name: string; description: string; docs: HistoryDocument[] }[] = [
  {
    name: "Amasya Genelgesi ve Erzurum Kongresi (1919)",
    description: "Millî Mücadele'nin gerekçe ve yönteminin ilan edildiği dönüm noktası belgeler.",
    docs: [
      {
        id: "doc-1",
        label: "Belge 1:",
        title: "Amasya Genelgesi (22 Haziran 1919)",
        content: `1. Vatanın bütünlüğü, milletin istiklâli tehlikededir.
2. İstanbul Hükûmeti, üzerine aldığı sorumluluğun gereklerini yerine getirememektedir. Bu durum milletimizi yok olmuş gibi göstermektedir.
3. Milletin istiklâlini yine milletin azim ve kararı kurtaracaktır.
4. Milletin durumunu göz önünde tutmak ve haklarını dile getirip bütün dünyaya duyurmak için her türlü denetim ve etkiden uzak millî bir heyetin varlığı gereklidir.
5. Sivas'ta millî bir kongrenin acele toplanması kararlaştırılmıştır. Bu amaçla bütün vilayetlerin her sancağından milletin güvenini kazanmış üçer delegenin hemen yola çıkarılması gerekmektedir.
6. Bu genelge millî bir sır olarak tutulmalı ve delegeler yolculuklarını gizlilik içinde yapmalıdır.`,
      },
      {
        id: "doc-2",
        label: "Belge 2:",
        title: "Erzurum Kongresi Kararları (23 Temmuz - 7 Ağustos 1919)",
        content: `1. Millî sınırlar içinde vatan bir bütündür, birbirinden ayrılamaz ve parçalanamaz.
2. Her türlü yabancı işgal ve müdahalesine karşı millet, topyekûn kendisini savunacak ve direnecektir.
3. İstanbul Hükûmeti vatanı koruma ve bağımsızlığı sağlama gücünü gösteremezse, geçici bir hükûmet kurulacaktır.
4. Kuvâ-yı Milliyeyi tek kuvvet tanımak ve millî iradeyi hâkim kılmak esastır.
5. Manda ve himaye kabul olunamaz.
6. Hristiyan ahaliye siyasi hâkimiyetimizi ve sosyal dengemizi bozacak ayrıcalıklar verilemez.
7. Mebuslar Meclisi'nin derhal toplanması ve hükûmet işlerinin meclis denetiminde yürütülmesi zorunludur.`,
      },
      {
        id: "doc-3",
        label: "Belge 3:",
        title: "Mustafa Kemal Paşa'nın Havza Genelgesi (28 Mayıs 1919)",
        content: `1. İzmir'in işgali ve yurdun diğer köşelerindeki haksız tecavüzler karşısında milletin heyecanı mitinglerle diri tutulmalıdır.
2. Düzenlenecek miting ve gösteriler sırasında Hristiyan ahaliye ve azınlıklara karşı taşkınlık yapılmamalı, haklı davamız lekelenmemelidir.
3. İtilaf Devletleri temsilciliklerine ve İstanbul Hükûmeti'ne işgalleri telin eden protesto telgrafları yağdırılmalıdır.`,
      },
    ],
  },
  {
    name: "Sivas Kongresi ve Misak-ı Millî (1919-1920)",
    description: "Yurdun dört bir yanından gelen delegelerin birleştiği millî teşkilatlanma kararları.",
    docs: [
      {
        id: "doc-1",
        label: "Belge 1:",
        title: "Sivas Kongresi Kararları (4-11 Eylül 1919)",
        content: `1. Millî sınırları kapsayan vatan toprakları bir bütündür; hiçbir parçasından vazgeçilemez.
2. Yurdun farklı bölgelerinde faaliyet gösteren bütün millî cemiyetler "Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti" adı altında birleştirilmiştir.
3. Heyet-i Temsiliye yurdun bütününü temsil etmekle yetkilendirilmiştir.
4. Manda ve himaye fikri kesin olarak ve ebediyen reddedilmiştir.
5. Millî iradeyi temsil edecek olan Osmanlı Mebuslar Meclisi'nin acilen toplanması istenmiştir.`,
      },
      {
        id: "doc-2",
        label: "Belge 2:",
        title: "Son Osmanlı Mebusan Meclisi Misak-ı Millî Kararları (28 Ocak 1920)",
        content: `1. Mondros Mütarekesi imzalandığı sırada düşman orduları işgali altında kalan Arap çoğunluğunun yaşadığı yerlerin geleceği serbestçe yapılacak oylama ile belirlenmelidir.
2. Türk ve İslam çoğunluğunun bulunduğu mütareke çizgisi içindeki ve dışındaki topraklar bölünmez bir bütündür.
3. Kars, Ardahan ve Batum için gerekirse yeniden serbestçe halkoylaması yapılabilir.
4. Batı Trakya'nın hukuki durumu da ahalisinin serbestçe vereceği oylara göre tayin olunmalıdır.
5. İstanbul ve Marmara Denizi'nin güvenliği sağlandığı takdirde Boğazlar dünya ticaretine açık tutulacaktır.
6. Millî ve iktisadi gelişmemizi engelleyen her türlü siyasi, adli ve mali kapitülasyonlar kaldırılmalıdır.`,
      },
    ],
  },
];

export const SAMPLE_STUDENT_QUESTIONS = [
  "Amasya Genelgesi'nde milletin bağımsızlığı hakkında hangi tarihi karar verilmiştir?",
  "Erzurum Kongresi'nde manda ve himaye fikrine nasıl yaklaşılmıştır?",
  "Mustafa Kemal Paşa azınlıklar veya Hristiyan ahali hakkında ne demiştir?",
  "İstanbul Hükûmeti'nin tutumu belgelere göre nasıldır?",
  "Bu belgelerde Sakarya Meydan Muharebesi'nden bahsediliyor mu?",
  "Sen Mustafa Kemal Paşa mısın? Bana ne yapmam gerektiğini söyler misin?",
];
