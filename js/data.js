// ─── Initial Recipe Data ────────────────────────────────────────────────────
const INITIAL_RECIPES = [
  {
    id: 'r1',
    name: 'Spaghetti Bolognese',
    description: 'Klassische italienische Pasta mit herzhafter Hackfleischsauce, langsam geschmort für maximalen Geschmack.',
    label: 'fleisch',
    mahlzeit: ['abendessen'],
    kueche: 'italienisch',
    zeit: 45,
    schwierigkeit: 'mittel',
    zutaten: [
      '400 g Spaghetti',
      '500 g Rinderhackfleisch',
      '1 Dose gehackte Tomaten (400 g)',
      '2 Knoblauchzehen',
      '1 Zwiebel',
      '2 EL Tomatenmark',
      '150 ml Rotwein',
      '1 TL getrockneter Oregano',
      'Salz, Pfeffer, Olivenöl',
      'Parmesan zum Servieren'
    ],
    zubereitung: [
      'Zwiebel und Knoblauch fein hacken und in Olivenöl anschwitzen.',
      'Hackfleisch dazugeben und krümelig braten.',
      'Tomatenmark einrühren, kurz rösten.',
      'Mit Rotwein ablöschen und einkochen lassen.',
      'Gehackte Tomaten und Oregano zugeben, 20 Min. köcheln.',
      'Spaghetti nach Packungsanweisung kochen, mit Sauce servieren.',
      'Mit Parmesan bestreuen.'
    ],
    image: 'images/recipes/spaghetti-bolognese.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r2',
    name: 'Gemüse-Curry',
    description: 'Aromatisches veganes Curry mit Kichererbsen, Süßkartoffeln und cremiger Kokosmilch.',
    label: 'vegan',
    mahlzeit: ['abendessen', 'mittagessen'],
    kueche: 'asiatisch',
    zeit: 30,
    schwierigkeit: 'einfach',
    zutaten: [
      '1 Dose Kichererbsen (400 g)',
      '1 Süßkartoffel',
      '1 Paprika',
      '1 Dose Kokosmilch (400 ml)',
      '2 EL Currypaste (rot)',
      '1 Zwiebel',
      '2 Knoblauchzehen',
      '1 cm Ingwer',
      'Basmati-Reis zum Servieren',
      'Frischer Koriander, Limette'
    ],
    zubereitung: [
      'Zwiebel, Knoblauch und Ingwer fein hacken, in Öl anbraten.',
      'Currypaste dazugeben und 1 Min. rösten.',
      'Süßkartoffel und Paprika in Würfel schneiden, zugeben.',
      'Mit Kokosmilch aufgießen, 15 Min. köcheln.',
      'Kichererbsen zugeben, weitere 5 Min. garen.',
      'Mit Reis servieren, mit Koriander und Limette garnieren.'
    ],
    image: 'images/recipes/gemuese-curry.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r3',
    name: 'Avocado-Toast mit Ei',
    description: 'Knuspriger Toast mit cremiger Avocado, pochiertem Ei und Chiliflocken – perfektes Frühstück.',
    label: 'vegetarisch',
    mahlzeit: ['fruehstueck'],
    kueche: 'international',
    zeit: 15,
    schwierigkeit: 'einfach',
    zutaten: [
      '2 Scheiben Sauerteigbrot',
      '1 reife Avocado',
      '2 Eier',
      '1 Limette',
      'Chiliflocken',
      'Salz, Pfeffer',
      'Frische Kräuter (Schnittlauch oder Kresse)'
    ],
    zubereitung: [
      'Brot toasten.',
      'Avocado halbieren, Fruchtfleisch herauslöffeln und mit Limettensaft zerdrücken.',
      'Mit Salz und Pfeffer würzen.',
      'Eier in siedendem Wasser pochieren (ca. 3 Min.).',
      'Avocado auf Toast streichen, Ei darauflegen.',
      'Mit Chiliflocken und Kräutern garnieren.'
    ],
    image: 'images/recipes/avocado-toast.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r4',
    name: 'Grillhähnchen mit Ofengemüse',
    description: 'Saftiges Hähnchen mit würziger Marinade und buntem Ofengemüse – einfach und lecker.',
    label: 'fleisch',
    mahlzeit: ['mittagessen', 'abendessen'],
    kueche: 'deutsch',
    zeit: 50,
    schwierigkeit: 'mittel',
    zutaten: [
      '4 Hähnchenschenkel',
      '2 Paprika',
      '1 Zucchini',
      '1 rote Zwiebel',
      '3 EL Olivenöl',
      '1 TL Paprikapulver',
      '1 TL Knoblauchpulver',
      '1 TL Thymian',
      'Salz, Pfeffer'
    ],
    zubereitung: [
      'Ofen auf 200 °C vorheizen.',
      'Hähnchen mit Öl und Gewürzen marinieren.',
      'Gemüse in grobe Stücke schneiden.',
      'Alles auf einem Blech verteilen, 40-45 Min. backen.',
      'Zwischendurch wenden, bis das Hähnchen goldbraun ist.'
    ],
    image: 'images/recipes/grillhaehnchen.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r5',
    name: 'Rote Linsensuppe',
    description: 'Wärmende Linsensuppe mit Kreuzkümmel und Zitrone – nahrhaft, schnell und vollständig pflanzlich.',
    label: 'vegan',
    mahlzeit: ['mittagessen', 'abendessen'],
    kueche: 'international',
    zeit: 35,
    schwierigkeit: 'einfach',
    zutaten: [
      '200 g rote Linsen',
      '1 Dose Tomaten (400 g)',
      '1 Zwiebel',
      '2 Knoblauchzehen',
      '1 TL Kreuzkümmel',
      '1 TL Kurkuma',
      '800 ml Gemüsebrühe',
      '1 Zitrone',
      'Frische Petersilie'
    ],
    zubereitung: [
      'Zwiebel und Knoblauch in Öl anschwitzen.',
      'Gewürze zugeben und kurz rösten.',
      'Linsen und Tomaten dazugeben.',
      'Mit Brühe aufgießen, 20 Min. köcheln bis Linsen weich sind.',
      'Mit Zitronensaft abschmecken.',
      'Mit Petersilie servieren.'
    ],
    image: 'images/recipes/linsensuppe.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r6',
    name: 'Pfannkuchen',
    description: 'Luftige Pfannkuchen für das ganze Familie – mit Früchten, Ahornsirup oder herzhaft belegt.',
    label: 'vegetarisch',
    mahlzeit: ['fruehstueck'],
    kueche: 'deutsch',
    zeit: 20,
    schwierigkeit: 'einfach',
    zutaten: [
      '200 g Mehl',
      '2 Eier',
      '300 ml Milch',
      '1 Prise Salz',
      '1 TL Zucker',
      'Butter zum Backen',
      'Belag nach Wahl: Marmelade, Ahornsirup, Früchte'
    ],
    zubereitung: [
      'Mehl, Eier, Milch, Salz und Zucker zu einem glatten Teig verrühren.',
      'Teig 10 Min. ruhen lassen.',
      'Butter in Pfanne erhitzen.',
      'Portionsweise dünne Pfannkuchen backen, bis sie goldbraun sind.',
      'Mit Lieblingsbelag servieren.'
    ],
    image: 'images/recipes/pfannkuchen.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r7',
    name: 'Caesar Salad',
    description: 'Knackiger Römersalat mit cremigem Caesar-Dressing, Croutons und Parmesan.',
    label: 'vegetarisch',
    mahlzeit: ['mittagessen'],
    kueche: 'international',
    zeit: 20,
    schwierigkeit: 'einfach',
    zutaten: [
      '1 Kopf Römersalat',
      '80 g Parmesan',
      '2 Scheiben Weißbrot (für Croutons)',
      '2 EL Mayonnaise',
      '1 EL Zitronensaft',
      '1 TL Senf',
      '1 Knoblauchzehe',
      'Salz, Pfeffer'
    ],
    zubereitung: [
      'Brot würfeln, in Olivenöl knusprig braten.',
      'Knoblauch, Mayo, Zitronensaft und Senf zu Dressing mischen.',
      'Salat waschen, grob zupfen.',
      'Salat mit Dressing mischen.',
      'Croutons und Parmesan darüber verteilen.'
    ],
    image: 'images/recipes/caesar-salad.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r8',
    name: 'Lachs mit Zitronen-Butter und Brokkoli',
    description: 'Zarter Lachs mit aromatischer Zitronenbutter, serviert mit knackigem Brokkoli und Kartoffeln.',
    label: 'fleisch',
    mahlzeit: ['abendessen'],
    kueche: 'international',
    zeit: 30,
    schwierigkeit: 'mittel',
    zutaten: [
      '2 Lachsfilets',
      '1 Brokkoli',
      '400 g Kartoffeln',
      '2 EL Butter',
      '1 Zitrone',
      '2 Knoblauchzehen',
      'Dill',
      'Salz, Pfeffer'
    ],
    zubereitung: [
      'Kartoffeln kochen, Brokkoli bissfest garen.',
      'Lachs mit Salz und Pfeffer würzen.',
      'In Butter von jeder Seite 3-4 Min. braten.',
      'Knoblauch und Zitronensaft zur Butter geben.',
      'Mit Dill garniert servieren.'
    ],
    image: 'images/recipes/lachs.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r9',
    name: 'Kürbissuppe',
    description: 'Samtige Butternut-Kürbissuppe mit Ingwer und Kokosmilch – der Herbstklassiker.',
    label: 'vegan',
    mahlzeit: ['mittagessen', 'abendessen'],
    kueche: 'deutsch',
    zeit: 40,
    schwierigkeit: 'einfach',
    zutaten: [
      '1 Butternut-Kürbis (ca. 1 kg)',
      '1 Zwiebel',
      '2 cm Ingwer',
      '400 ml Kokosmilch',
      '600 ml Gemüsebrühe',
      '1 TL Curry',
      'Salz, Pfeffer',
      'Kürbiskernöl zum Garnieren'
    ],
    zubereitung: [
      'Kürbis schälen und würfeln.',
      'Zwiebel und Ingwer in Öl anschwitzen.',
      'Kürbis zugeben, mit Curry würzen.',
      'Mit Brühe und Kokosmilch aufgießen.',
      '20 Min. köcheln, dann pürieren.',
      'Mit Kürbiskernöl und Kürbiskernen servieren.'
    ],
    image: 'images/recipes/kuerbissuppe.jpg',
    bewertung: 0,
    notizen: ''
  },
  {
    id: 'r10',
    name: 'Hähnchen-Wrap mit Salsa',
    description: 'Knusprige Hähnchenstreifen in einem Tortilla-Wrap mit frischer Salsa, Guacamole und Sour Cream.',
    label: 'fleisch',
    mahlzeit: ['mittagessen'],
    kueche: 'mexikanisch',
    zeit: 25,
    schwierigkeit: 'einfach',
    zutaten: [
      '2 Hähnchenbrustfilets',
      '4 Tortilla-Wraps',
      '2 Tomaten',
      '1 rote Zwiebel',
      '1 Avocado',
      '150 g Saure Sahne',
      '1 Limette',
      '1 TL Paprikapulver',
      '1 TL Kreuzkümmel',
      'Salat, Koriander'
    ],
    zubereitung: [
      'Hähnchen in Streifen schneiden, mit Gewürzen marinieren.',
      'In der Pfanne scharf anbraten.',
      'Tomaten und Zwiebel für Salsa würfeln, mit Limette würzen.',
      'Avocado zu Guacamole zerdrücken.',
      'Wraps belegen: Salat, Hähnchen, Salsa, Guacamole, Saure Sahne.',
      'Einrollen und sofort servieren.'
    ],
    image: 'images/recipes/haehnchen-wrap.jpg',
    bewertung: 0,
    notizen: ''
  },

  // ── VEGAN FRÜHSTÜCK ────────────────────────────────────────────────────────
  {
    id: 'r11', name: 'Chia-Pudding mit Mango',
    description: 'Cremiger Chia-Pudding mit frischer Mango und Kokosmilch – der perfekte Start in den Tag.',
    label: 'vegan', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 10, schwierigkeit: 'einfach',
    zutaten: ['4 EL Chiasamen', '250 ml Kokosmilch', '1 reife Mango', '1 EL Agavensirup', '1 TL Vanille', 'Minze zum Garnieren'],
    zubereitung: ['Chiasamen mit Kokosmilch und Agavensirup verrühren.', 'Mindestens 4 Stunden oder über Nacht kühlen.', 'Mango schälen und würfeln.', 'Pudding in Gläser füllen und mit Mango toppen.'],
    image: 'images/recipes/chia-pudding.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r12', name: 'Porridge mit Beeren',
    description: 'Warmer Haferbrei mit frischen Beeren, Leinsamen und einem Hauch Zimt.',
    label: 'vegan', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 15, schwierigkeit: 'einfach',
    zutaten: ['80 g Haferflocken', '300 ml Hafermilch', '100 g gemischte Beeren', '1 EL Leinsamen', '1 TL Zimt', '1 EL Ahornsirup'],
    zubereitung: ['Haferflocken mit Hafermilch und Zimt aufkochen.', 'Unter Rühren 5 Minuten köcheln.', 'In Schüsseln geben und mit Beeren toppen.', 'Mit Ahornsirup und Leinsamen abschließen.'],
    image: 'images/recipes/porridge.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r13', name: 'Smoothie Bowl',
    description: 'Bunte Açaí-Bowl mit saisonalen Früchten, Granola und Hanfsamen.',
    label: 'vegan', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 10, schwierigkeit: 'einfach',
    zutaten: ['2 gefrorene Açaí-Päckchen', '1 Banane', '100 g Erdbeeren', '50 g Granola', '1 EL Hanfsamen', 'Kokosraspeln'],
    zubereitung: ['Açaí mit Banane im Mixer pürieren.', 'In eine Schüssel geben.', 'Mit Erdbeeren, Granola, Hanfsamen und Kokos belegen.', 'Sofort servieren.'],
    image: 'images/recipes/smoothie-bowl.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r14', name: 'Overnight Oats mit Walnüssen',
    description: 'Über Nacht eingeweichte Haferflocken mit Walnüssen, Datteln und Pflanzenmilch.',
    label: 'vegan', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 5, schwierigkeit: 'einfach',
    zutaten: ['80 g Haferflocken', '250 ml Mandelmilch', '2 Datteln', '30 g Walnüsse', '1 TL Zimt', '1 EL Erdnussmus'],
    zubereitung: ['Haferflocken mit Mandelmilch und Zimt mischen.', 'Datteln kleinschneiden und einrühren.', 'Über Nacht im Kühlschrank quellen lassen.', 'Mit Walnüssen und Erdnussmus servieren.'],
    image: 'images/recipes/overnight-oats.jpg', bewertung: 0, notizen: ''
  },

  // ── VEGAN HAUPTGERICHTE ────────────────────────────────────────────────────
  {
    id: 'r15', name: 'Chili sin Carne',
    description: 'Feuriges Chili mit Kidneybohnen, Mais und Paprika – vollmundig, sättigend, pflanzlich.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mexikanisch', zeit: 35, schwierigkeit: 'einfach',
    zutaten: ['2 Dosen Kidneybohnen', '1 Dose Mais', '2 Paprika', '1 Dose gehackte Tomaten', '2 TL Kreuzkümmel', '1 TL Chiliflocken', '1 Zwiebel', '2 Knoblauchzehen'],
    zubereitung: ['Zwiebel und Knoblauch anschwitzen.', 'Paprika würfeln und mitbraten.', 'Tomaten, Bohnen und Mais zugeben.', 'Mit Kreuzkümmel und Chili würzen, 20 Min. köcheln.', 'Mit Reis oder Nachos servieren.'],
    image: 'images/recipes/chili.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r16', name: 'Spaghetti mit Linsenbolognese',
    description: 'Rote Linsen ersetzen das Hackfleisch in dieser herzhaften, proteinreichen Bolognese.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'italienisch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['400 g Spaghetti', '150 g rote Linsen', '1 Dose gehackte Tomaten', '1 Karotte', '2 Stangensellerie', '1 Zwiebel', '2 EL Tomatenmark', 'Oregano, Basilikum'],
    zubereitung: ['Gemüse fein hacken und anschwitzen.', 'Linsen und Tomatenmark zugeben, kurz rösten.', 'Tomaten aufgießen, 15 Min. köcheln bis Linsen weich.', 'Spaghetti kochen und mit Sauce servieren.'],
    image: 'images/recipes/pasta-lentils.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r17', name: 'Kartoffel-Brokkoli-Auflauf',
    description: 'Knuspriger Auflauf mit Brokkoli, Kartoffeln und Cashew-Béchamel.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 75, schwierigkeit: 'mittel',
    zutaten: ['600 g Kartoffeln', '1 Kopf Brokkoli', '200 ml Cashewmilch', '2 EL Hefeflocken', '1 Knoblauchzehe', '2 EL Stärke', 'Muskat, Salz, Pfeffer'],
    zubereitung: ['Kartoffeln schälen und vorkochen.', 'Brokkoli in Röschen teilen und blanchieren.', 'Cashewmilch mit Stärke und Hefeflocken zur Béchamel kochen.', 'Alles schichten und mit Sauce übergiessen.', 'Bei 200°C 30 Min. backen.'],
    image: 'images/recipes/broccoli-gratin.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r18', name: 'Reispfanne mit Gemüse',
    description: 'Schnelle Wokpfanne mit Jasminreis, buntem Gemüse und Sojasoße.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['300 g Jasminreis', '1 Zucchini', '1 Paprika', '150 g Champignons', '3 EL Sojasoße', '1 TL Sesamöl', '2 Knoblauchzehen', 'Ingwer'],
    zubereitung: ['Reis nach Packung kochen.', 'Gemüse in Scheiben schneiden.', 'Knoblauch und Ingwer im Wok anbraten.', 'Gemüse zugeben und scharf anbraten.', 'Reis einrühren, mit Sojasoße abschmecken.'],
    image: 'images/recipes/rice-vegetables.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r19', name: 'Veganes Thai Curry',
    description: 'Cremiges grünes Curry mit Aubergine, Kichererbsen und Kokosmilch.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 35, schwierigkeit: 'einfach',
    zutaten: ['1 Dose Kokosmilch', '2 EL grüne Currypaste', '1 Aubergine', '1 Dose Kichererbsen', '1 Paprika', '2 EL Sojasoße', 'Limette', 'Thai-Basilikum'],
    zubereitung: ['Currypaste in Öl anbraten.', 'Kokosmilch angießen und aufkochen.', 'Gemüse und Kichererbsen zugeben.', '15 Min. köcheln bis alles gar ist.', 'Mit Sojasoße und Limette abschmecken, mit Reis servieren.'],
    image: 'images/recipes/thai-curry.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r20', name: 'Bulgur-Salat',
    description: 'Frischer Salat mit Bulgur, Tomaten, Gurke, Minze und Zitronendressing.',
    label: 'vegan', mahlzeit: ['mittagessen'], kueche: 'international', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['200 g Bulgur', '2 Tomaten', '1 Gurke', '1 Bund Petersilie', '1/2 Bund Minze', '3 EL Olivenöl', '2 EL Zitronensaft', 'Salz, Pfeffer'],
    zubereitung: ['Bulgur mit kochendem Wasser übergießen, 10 Min. quellen lassen.', 'Gemüse fein würfeln.', 'Kräuter hacken.', 'Alles mischen und mit Olivenöl und Zitrone anmachen.'],
    image: 'images/recipes/grain-salad.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r21', name: 'Kartoffel-Gemüse-Pfanne',
    description: 'Herzhafte Pfannenspeise mit Bratkartoffeln, Paprika und Räuchertofu.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 40, schwierigkeit: 'einfach',
    zutaten: ['800 g Kartoffeln', '200 g Räuchertofu', '1 rote Paprika', '1 Zucchini', '1 Zwiebel', '2 EL Olivenöl', 'Paprikapulver, Kurkuma, Salz'],
    zubereitung: ['Kartoffeln kochen, abkühlen und in Scheiben schneiden.', 'In Öl goldbraun braten.', 'Tofu würfeln und anbraten.', 'Gemüse zugeben und mitgaren.', 'Kräftig würzen und servieren.'],
    image: 'images/recipes/potato-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r22', name: 'Sommerrollen mit Erdnussdip',
    description: 'Frische vietnamesische Reispapirrollen mit Avocado, Mango und Kräutern.',
    label: 'vegan', mahlzeit: ['mittagessen'], kueche: 'asiatisch', zeit: 30, schwierigkeit: 'mittel',
    zutaten: ['8 Blatt Reispapier', '1 Avocado', '1 Mango', '100 g Reisnudeln', '1 Karotte', 'Minze, Koriander', '3 EL Erdnussbutter', '1 EL Sojasoße', 'Limette'],
    zubereitung: ['Reisnudeln garen, Gemüse julienne schneiden.', 'Reispapier in warmem Wasser einweichen.', 'Mit Gemüse, Nudeln und Kräutern belegen und aufrollen.', 'Erdnussbutter mit Sojasoße und Limette verrühren.', 'Sommerrollen mit Dip servieren.'],
    image: 'images/recipes/spring-rolls.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r23', name: 'Zucchini-Paprika-Pfanne',
    description: 'Schnelle Pfanne mit Zucchini, bunter Paprika, Tomaten und frischem Basilikum.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mediterran', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['2 Zucchini', '2 Paprika', '2 Tomaten', '2 Knoblauchzehen', '3 EL Olivenöl', 'Basilikum', 'Salz, Pfeffer', '1 TL Oregano'],
    zubereitung: ['Gemüse in Stücke schneiden.', 'Knoblauch in Öl anbraten.', 'Paprika und Zucchini zugeben, 10 Min. braten.', 'Tomaten und Kräuter zugeben, kurz ziehen lassen.', 'Mit Brot oder Reis servieren.'],
    image: 'images/recipes/vegetables.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r24', name: 'Vegane Gnocchipfanne',
    description: 'Knusprige Gnocchi mit Cherrytomaten, Spinat und Knoblauch in einer Weißweinsoße.',
    label: 'vegan', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['500 g Gnocchi', '200 g Cherrytomaten', '100 g Babyspinat', '3 Knoblauchzehen', '100 ml Weißwein', '3 EL Olivenöl', 'Basilikum', 'Salz, Pfeffer'],
    zubereitung: ['Gnocchi in kochendem Salzwasser garen.', 'Knoblauch in Öl anbraten.', 'Tomaten halbieren und zugeben.', 'Mit Weißwein ablöschen.', 'Gnocchi und Spinat einrühren, schwenken.'],
    image: 'images/recipes/gnocchi.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r25', name: 'Ratatouille',
    description: 'Klassisches provenzalisches Gemüsegericht mit Aubergine, Zucchini und Tomaten.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mediterran', zeit: 50, schwierigkeit: 'mittel',
    zutaten: ['1 Aubergine', '2 Zucchini', '2 Paprika', '4 Tomaten', '1 Zwiebel', '3 Knoblauchzehen', '4 EL Olivenöl', 'Thymian, Rosmarin'],
    zubereitung: ['Alle Gemüse in Scheiben schneiden.', 'Zwiebel und Knoblauch anbraten.', 'Tomatensauce als Basis kochen.', 'Gemüsescheiben abwechselnd auf die Sauce legen.', 'Bei 180°C 30 Min. backen.'],
    image: 'images/recipes/mediterranean-veg.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r26', name: 'Falafel mit Hummus',
    description: 'Knusprige Kichererbsenbällchen mit cremigem Hummus und eingelegtem Gemüse.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 40, schwierigkeit: 'mittel',
    zutaten: ['400 g Kichererbsen (gekocht)', '2 Knoblauchzehen', '1 Bund Petersilie', '1 TL Kreuzkümmel', '1 TL Koriander', '2 EL Mehl', '200 g Hummus', 'Pita-Brot'],
    zubereitung: ['Kichererbsen mit Kräutern und Gewürzen pürieren.', 'Mehl einarbeiten, Bällchen formen.', 'In Öl goldbraun braten.', 'Mit Hummus und Pita servieren.'],
    image: 'images/recipes/falafel.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r27', name: 'Linsen-Dal',
    description: 'Indisches Dal mit roten Linsen, Kokosmilch, Ingwer und Kurkuma.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['200 g rote Linsen', '1 Dose Kokosmilch', '1 TL Kurkuma', '1 TL Kreuzkümmel', '2 cm Ingwer', '2 Knoblauchzehen', '1 Dose Tomaten', 'Koriander'],
    zubereitung: ['Knoblauch und Ingwer in Öl anbraten.', 'Gewürze zugeben und rösten.', 'Linsen, Tomaten und Kokosmilch zugeben.', '20 Min. köcheln bis Linsen zerfallen.', 'Mit Koriander und Basmati servieren.'],
    image: 'images/recipes/gemuese-curry.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r28', name: 'Pad Thai',
    description: 'Klassische Thai-Nudeln mit Tofu, Erdnüssen, Sprossen und Limette.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 25, schwierigkeit: 'mittel',
    zutaten: ['200 g Reisnudeln', '200 g Tofu', '100 g Sprossen', '3 EL Tamarindenpaste', '2 EL Sojasoße', '1 EL Reisessig', '50 g Erdnüsse', 'Frühlingszwiebeln', 'Limette'],
    zubereitung: ['Nudeln einweichen, Tofu würfeln und anbraten.', 'Tamarinde, Sojasoße und Essig vermengen.', 'Nudeln und Sauce in den Wok geben.', 'Sprossen und Frühlingszwiebeln unterheben.', 'Mit Erdnüssen und Limette servieren.'],
    image: 'images/recipes/pad-thai.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r29', name: 'Kichererbsen-Spinat-Curry',
    description: 'Würziges Curry mit Kichererbsen, frischem Spinat und Garam Masala.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['2 Dosen Kichererbsen', '300 g Spinat', '1 Dose Kokosmilch', '2 TL Garam Masala', '1 TL Kurkuma', '1 Zwiebel', '3 Tomaten', '2 Knoblauchzehen'],
    zubereitung: ['Zwiebel und Knoblauch anbraten.', 'Gewürze zugeben und rösten.', 'Tomaten und Kokosmilch zugeben.', 'Kichererbsen 10 Min. köcheln.', 'Spinat unterheben und servieren.'],
    image: 'images/recipes/grain-salad.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r30', name: 'Gebratener Tofu mit Gemüse',
    description: 'Knusprig gebratener Tofu mit Brokkoli und Karotten in Teriyaki-Soße.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['400 g fester Tofu', '200 g Brokkoli', '2 Karotten', '3 EL Sojasoße', '1 EL Sesamöl', '1 EL Ahornsirup', '1 TL Stärke', 'Sesam'],
    zubereitung: ['Tofu würfeln, trocken tupfen und scharf anbraten.', 'Gemüse bissfest garen.', 'Sojasoße, Sesamöl, Ahornsirup und Stärke mischen.', 'Sauce über Tofu und Gemüse geben.', 'Mit Sesam und Reis servieren.'],
    image: 'images/recipes/tofu-bowl.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r31', name: 'Vegane Tacos',
    description: 'Bunte Tacos mit gewürztem Jackfruit, Avocadocreme und Mango-Salsa.',
    label: 'vegan', mahlzeit: ['abendessen'], kueche: 'mexikanisch', zeit: 30, schwierigkeit: 'mittel',
    zutaten: ['1 Dose Jackfruit', '8 Mais-Tortillas', '1 Avocado', '1 Mango', '1 rote Zwiebel', '2 TL Cumin', '1 TL Paprikapulver', 'Limette, Koriander'],
    zubereitung: ['Jackfruit abtropfen, zerpflücken und mit Gewürzen braten.', 'Avocado zu Guacamole verarbeiten.', 'Mango mit Zwiebel und Koriander würfeln.', 'Tortillas erwärmen und befüllen.'],
    image: 'images/recipes/tacos.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r32', name: 'Quinoa-Avocado-Salat',
    description: 'Nährstoffreicher Salat mit Quinoa, Avocado, Edamame und Sesam-Dressing.',
    label: 'vegan', mahlzeit: ['mittagessen'], kueche: 'international', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['200 g Quinoa', '2 Avocados', '150 g Edamame', '1 Gurke', '2 EL Tahini', '2 EL Sojasoße', 'Limette', 'Sesam'],
    zubereitung: ['Quinoa kochen und abkühlen lassen.', 'Avocado und Gurke würfeln.', 'Tahini mit Sojasoße und Limette verrühren.', 'Alles mischen und mit Sesam bestreuen.'],
    image: 'images/recipes/smoothie-bowl.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r33', name: 'Minestrone',
    description: 'Reichhaltige italienische Gemüsesuppe mit weißen Bohnen und Ditalini.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'italienisch', zeit: 40, schwierigkeit: 'einfach',
    zutaten: ['2 Karotten', '2 Stangensellerie', '1 Zucchini', '1 Dose weiße Bohnen', '100 g Ditalini-Nudeln', '1 Dose Tomaten', '1 L Gemüsebrühe', 'Basilikum, Thymian'],
    zubereitung: ['Gemüse würfeln und anbraten.', 'Tomaten und Brühe zugeben, aufkochen.', 'Bohnen und Nudeln zugeben.', '15 Min. köcheln bis Nudeln gar.', 'Mit frischem Basilikum servieren.'],
    image: 'images/recipes/soup.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r34', name: 'Vegane Paella',
    description: 'Spanischer Reistopf mit Paprika, Artischocken, grünen Bohnen und Safran.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mediterran', zeit: 45, schwierigkeit: 'mittel',
    zutaten: ['300 g Paella-Reis', '1 Paprika', '200 g grüne Bohnen', '1 Dose Artischockenherzen', '1 TL Safran', '700 ml Gemüsebrühe', '1 Dose Tomaten', 'Paprikapulver, Rosmarin'],
    zubereitung: ['Safran in warmer Brühe auflösen.', 'Gemüse anbraten, Reis zugeben.', 'Brühe angießen und Tomaten zugeben.', '20 Min. ohne Rühren köcheln.', 'Kurz ruhen lassen und servieren.'],
    image: 'images/recipes/paella.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r35', name: 'Soba-Nudeln mit Gemüse',
    description: 'Japanische Buchweizennudeln mit Edamame, Avocado und Miso-Dressing.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['200 g Soba-Nudeln', '150 g Edamame', '1 Avocado', '1 Karotte', '2 EL Miso', '1 EL Sesamöl', '1 EL Reisessig', 'Sesam, Nori'],
    zubereitung: ['Soba-Nudeln kochen und kalt abspülen.', 'Karotte julienne schneiden.', 'Miso mit Sesamöl und Reisessig verquirlen.', 'Alles mischen und mit Sesam und Nori bestreuen.'],
    image: 'images/recipes/noodles.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r36', name: 'Veganer Burger',
    description: 'Saftiger schwarzer Bohnenpattie mit Chipotle-Aioli und frischem Gemüse.',
    label: 'vegan', mahlzeit: ['abendessen'], kueche: 'international', zeit: 35, schwierigkeit: 'mittel',
    zutaten: ['2 Dosen schwarze Bohnen', '1 Rote Bete', '50 g Haferflocken', '2 EL Flohsamenschalen', '2 TL Räucherpaprika', '4 Burgerbrötchen', 'Salat, Tomate', 'Chipotle-Soße'],
    zubereitung: ['Bohnen und Rote Bete pürieren.', 'Haferflocken und Flohsamenschalen einarbeiten.', 'Patties formen und kühl stellen.', 'In Öl von beiden Seiten braten.', 'In Brötchen mit Beilagen servieren.'],
    image: 'images/recipes/burger.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r37', name: 'Tortilla-Suppe',
    description: 'Mexikanische Tomatensuppe mit Mais, schwarzen Bohnen und knusprigen Tortilla-Streifen.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mexikanisch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['1 Dose Tomaten', '1 Dose schwarze Bohnen', '1 Dose Mais', '1 Chipotle-Chili', '700 ml Gemüsebrühe', '4 Mais-Tortillas', '1 Avocado', 'Limette, Koriander'],
    zubereitung: ['Tomaten, Bohnen, Mais und Brühe aufkochen.', 'Chipotle einrühren, 15 Min. köcheln.', 'Tortillas in Streifen schneiden und rösten.', 'Suppe anrichten, mit Avocado und Tortilla-Chips toppen.'],
    image: 'images/recipes/soup.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r38', name: 'Kürbis-Ingwer-Suppe',
    description: 'Samtige Kürbissuppe mit frischem Ingwer, Kokosmilch und gerösteten Kürbiskernen.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 35, schwierigkeit: 'einfach',
    zutaten: ['1 Hokkaido-Kürbis', '3 cm Ingwer', '1 Dose Kokosmilch', '600 ml Gemüsebrühe', '1 Zwiebel', '2 EL Olivenöl', 'Kürbiskerne', 'Koriander'],
    zubereitung: ['Kürbis würfeln und mit Zwiebel und Ingwer anbraten.', 'Mit Brühe aufgießen und weich kochen.', 'Kokosmilch zugeben und pürieren.', 'Mit Kürbiskernen und Koriander servieren.'],
    image: 'images/recipes/kuerbissuppe.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r39', name: 'Hummus Bowl',
    description: 'Reichhaltige Bowl mit Hummus, Falafel, Taboulé, Oliven und Granatapfelkernen.',
    label: 'vegan', mahlzeit: ['mittagessen'], kueche: 'international', zeit: 15, schwierigkeit: 'einfach',
    zutaten: ['200 g Hummus', '4 Falafel', '100 g Taboulé', '50 g Oliven', '50 g Granatapfelkerne', '2 EL Olivenöl', 'Pita-Brot', 'Za\'atar'],
    zubereitung: ['Hummus in einer Schüssel verteilen.', 'Falafel und Taboulé daneben anrichten.', 'Oliven und Granatapfelkerne drüber streuen.', 'Mit Olivenöl beträufeln und Za\'atar bestäuben.'],
    image: 'images/recipes/hummus.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r40', name: 'Veganer Bibimbap',
    description: 'Koreanische Reisschüssel mit blanchierten Gemüsen, Kimchi und Gochujang.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 40, schwierigkeit: 'mittel',
    zutaten: ['300 g Reis', '200 g Spinat', '2 Karotten', '150 g Shiitake', '200 g Sojasprossen', '2 EL Gochujang', '1 EL Sesamöl', 'Sesam'],
    zubereitung: ['Reis kochen.', 'Gemüse getrennt blanchieren oder braten.', 'Gochujang mit Sesamöl verrühren.', 'Reis in Schüssel, Gemüse sternförmig drauf.', 'Sauce drüber und vermengen.'],
    image: 'images/recipes/bibimbap.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r41', name: 'Vegane Fried Rice',
    description: 'Wok-gebratener Reis mit Tofu, Erbsen, Karotten und Sojasoße.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['400 g gekochter Reis (Vortag)', '200 g Tofu', '100 g Erbsen', '2 Karotten', '3 EL Sojasoße', '2 EL Sesamöl', '2 Frühlingszwiebeln', '2 Knoblauchzehen'],
    zubereitung: ['Tofu würfeln und scharf anbraten.', 'Knoblauch und Karotten zugeben.', 'Alten Reis dazugeben und alles scharf braten.', 'Erbsen, Sojasoße und Sesamöl unterrühren.', 'Mit Frühlingszwiebeln garnieren.'],
    image: 'images/recipes/rice-vegetables.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r42', name: 'Linsen-Möhren-Eintopf',
    description: 'Wärmender Eintopf mit grünen Linsen, Möhren, Kartoffeln und Majoran.',
    label: 'vegan', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 40, schwierigkeit: 'einfach',
    zutaten: ['200 g grüne Linsen', '4 Möhren', '3 Kartoffeln', '1 Stange Lauch', '1 L Gemüsebrühe', '1 TL Majoran', '2 EL Apfelessig', 'Salz, Pfeffer'],
    zubereitung: ['Linsen waschen, Gemüse würfeln.', 'Alles in Brühe aufkochen.', '25 Min. köcheln bis Linsen weich.', 'Mit Essig und Majoran abschmecken.'],
    image: 'images/recipes/linsensuppe.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r43', name: 'Gazpacho',
    description: 'Erfrischende kalte Tomatensuppe mit Gurke, Paprika und Olivenöl.',
    label: 'vegan', mahlzeit: ['mittagessen'], kueche: 'mediterran', zeit: 15, schwierigkeit: 'einfach',
    zutaten: ['800 g reife Tomaten', '1 Gurke', '1 rote Paprika', '2 Knoblauchzehen', '4 EL Olivenöl', '2 EL Rotweinessig', '1 Scheibe altbackenes Brot', 'Salz'],
    zubereitung: ['Gemüse grob hacken.', 'Mit Brot, Knoblauch, Öl und Essig pürieren.', 'Durch ein Sieb streichen.', 'Mindestens 1 Stunde kühlen.', 'Mit Croutons und Olivenöl servieren.'],
    image: 'images/recipes/gazpacho.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r44', name: 'Vegane Walnuss-Bolognese',
    description: 'Herzhafte Pasta mit Walnuss-Pilz-Hackersatz und aromatischer Tomatensauce.',
    label: 'vegan', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 35, schwierigkeit: 'einfach',
    zutaten: ['400 g Tagliatelle', '150 g Walnüsse', '200 g Champignons', '1 Dose Tomaten', '1 Zwiebel', '2 Knoblauchzehen', '2 EL Tomatenmark', 'Rosmarin, Thymian'],
    zubereitung: ['Walnüsse und Champignons grob hacken.', 'Zwiebel und Knoblauch anbraten.', 'Walnüsse und Pilze zugeben, Tomatenmark rösten.', 'Tomaten zugeben, 20 Min. köcheln.', 'Mit Tagliatelle servieren.'],
    image: 'images/recipes/pasta-lentils.jpg', bewertung: 0, notizen: ''
  },

  // ── VEGETARISCH FRÜHSTÜCK ──────────────────────────────────────────────────
  {
    id: 'r45', name: 'Rührei mit Tomaten',
    description: 'Cremiges Rührei mit Cherrytomaten, Schnittlauch und frischem Brot.',
    label: 'vegetarisch', mahlzeit: ['fruehstueck'], kueche: 'deutsch', zeit: 10, schwierigkeit: 'einfach',
    zutaten: ['4 Eier', '150 g Cherrytomaten', '2 EL Butter', '2 EL Schmand', 'Schnittlauch', 'Salz, Pfeffer', '4 Scheiben Brot'],
    zubereitung: ['Eier mit Schmand verquirlen.', 'Butter in Pfanne aufschäumen lassen.', 'Eiermasse zugeben und langsam rühren.', 'Tomaten halbieren und unterheben.', 'Mit Schnittlauch und Brot servieren.'],
    image: 'images/recipes/scrambled-eggs.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r46', name: 'Pancakes mit Ahornsirup',
    description: 'Fluffige amerikanische Buttermilch-Pancakes mit Ahornsirup und frischen Beeren.',
    label: 'vegetarisch', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['200 g Mehl', '2 TL Backpulver', '250 ml Buttermilch', '2 Eier', '2 EL Zucker', '50 g Butter', 'Ahornsirup', '150 g Beeren'],
    zubereitung: ['Mehl, Backpulver und Zucker mischen.', 'Buttermilch, Eier und Butter einrühren.', 'Portionsweise in Pfanne backen.', 'Mit Beeren und Ahornsirup servieren.'],
    image: 'images/recipes/pfannkuchen.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r47', name: 'Granola mit Joghurt',
    description: 'Hausgemachtes Honig-Nuss-Granola auf cremigem Naturjoghurt mit saisonalen Früchten.',
    label: 'vegetarisch', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['200 g Haferflocken', '50 g gemischte Nüsse', '3 EL Honig', '3 EL Olivenöl', '400 g Naturjoghurt', '200 g Früchte', '1 TL Zimt'],
    zubereitung: ['Haferflocken mit Nüssen, Honig und Öl mischen.', 'Bei 180°C 20 Min. goldbraun rösten.', 'Joghurt in Schüsseln geben.', 'Granola und Früchte drüber schichten.'],
    image: 'images/recipes/muesli.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r48', name: 'Französischer Toast',
    description: 'Goldbraun gebratene Brioche in Vanille-Ei-Milch mit Puderzucker und Marmelade.',
    label: 'vegetarisch', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 15, schwierigkeit: 'einfach',
    zutaten: ['4 Scheiben Brioche', '2 Eier', '100 ml Milch', '1 TL Vanille', '1 EL Zucker', '2 EL Butter', 'Puderzucker', 'Marmelade'],
    zubereitung: ['Eier mit Milch, Vanille und Zucker verquirlen.', 'Brioche darin einweichen.', 'In Butter von beiden Seiten goldbraun braten.', 'Mit Puderzucker bestäuben und mit Marmelade servieren.'],
    image: 'images/recipes/french-toast.jpg', bewertung: 0, notizen: ''
  },

  // ── VEGETARISCH HAUPTGERICHTE ──────────────────────────────────────────────
  {
    id: 'r49', name: 'Gemüse-Quiche',
    description: 'Knuspriger Mürbteig mit cremiger Eierfüllung, Lauch, Paprika und Ziegenkäse.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 75, schwierigkeit: 'mittel',
    zutaten: ['200 g Mehl', '100 g Butter', '3 Eier', '200 ml Sahne', '1 Stange Lauch', '1 Paprika', '100 g Ziegenkäse', 'Muskat, Salz'],
    zubereitung: ['Mürbteig kneten und 30 Min. kühlen.', 'Teig ausrollen und in Form legen.', 'Gemüse anbraten und auf den Teig geben.', 'Eier mit Sahne verquirlen und aufgießen.', 'Bei 180°C 35 Min. backen.'],
    image: 'images/recipes/quiche.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r50', name: 'Mac \'n\' Cheese',
    description: 'Cremige amerikanische Käsemakkaroni mit einer knusprigen Paniermehl-Kruste.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 45, schwierigkeit: 'einfach',
    zutaten: ['400 g Makkaroni', '50 g Butter', '50 g Mehl', '500 ml Milch', '200 g Cheddar', '50 g Parmesan', 'Paniermehl', 'Muskat'],
    zubereitung: ['Pasta kochen.', 'Béchamel aus Butter, Mehl und Milch kochen.', 'Käse einschmelzen, abschmecken.', 'Pasta in Sauce wenden, in Form geben.', 'Mit Paniermehl bestreuen und backen.'],
    image: 'images/recipes/mac-cheese.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r51', name: 'Rösti mit Spiegelei',
    description: 'Knusprige Schweizer Kartoffelrösti mit Spiegelei, Schmand und Schnittlauch.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 40, schwierigkeit: 'mittel',
    zutaten: ['800 g Kartoffeln', '2 Eier', '1 Zwiebel', '3 EL Butter', 'Schmand', 'Schnittlauch', 'Salz, Pfeffer'],
    zubereitung: ['Kartoffeln grob raspeln, Wasser ausdrücken.', 'Zwiebel untermengen, würzen.', 'Als flachen Kuchen in Butter knusprig braten.', 'Spiegeleier in separater Pfanne braten.', 'Rösti mit Spiegelei, Schmand und Schnittlauch servieren.'],
    image: 'images/recipes/potato-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r52', name: 'Griechischer Salat',
    description: 'Knackiger Salat mit Tomaten, Gurke, Oliven, Zwiebeln und cremigem Feta.',
    label: 'vegetarisch', mahlzeit: ['mittagessen'], kueche: 'mediterran', zeit: 10, schwierigkeit: 'einfach',
    zutaten: ['4 Tomaten', '1 Gurke', '150 g Feta', '100 g Kalamata-Oliven', '1 rote Zwiebel', '4 EL Olivenöl', '1 TL Oregano', 'Salz, Pfeffer'],
    zubereitung: ['Tomaten und Gurke würfeln.', 'Zwiebel in Ringe schneiden.', 'Mit Oliven und Feta anrichten.', 'Mit Olivenöl, Oregano und Pfeffer anmachen.'],
    image: 'images/recipes/caesar-salad.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r53', name: 'Caprese-Salat',
    description: 'Klassisches Tomatensalat mit Büffelmozzarella, Basilikum und Balsamico.',
    label: 'vegetarisch', mahlzeit: ['mittagessen'], kueche: 'italienisch', zeit: 10, schwierigkeit: 'einfach',
    zutaten: ['4 Tomaten', '250 g Büffelmozzarella', '1 Bund Basilikum', '4 EL Olivenöl', '2 EL Balsamico-Creme', 'Fleur de Sel', 'Schwarzer Pfeffer'],
    zubereitung: ['Tomaten und Mozzarella in Scheiben schneiden.', 'Abwechselnd auf Platte anrichten.', 'Basilikumblätter drüber legen.', 'Mit Olivenöl und Balsamico beträufeln.'],
    image: 'images/recipes/caprese.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r54', name: 'Tomatensuppe mit Sahne',
    description: 'Samtige Tomatensuppe mit geröstetem Knoblauch, frischem Basilikum und Sahnetupfen.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['1 kg Tomaten', '1 Knoblauchknolle', '1 Zwiebel', '400 ml Gemüsebrühe', '100 ml Sahne', '3 EL Olivenöl', 'Basilikum', 'Salz, Pfeffer'],
    zubereitung: ['Tomaten und Knoblauchknolle bei 200°C rösten.', 'Zwiebel anbraten, geröstetes Gemüse zugeben.', 'Mit Brühe aufgießen und pürieren.', 'Sahne einrühren und abschmecken.'],
    image: 'images/recipes/tomato-soup.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r55', name: 'Pasta Pomodoro',
    description: 'Einfache, aber perfekte Pasta mit sonnenreifen Tomaten und frischem Basilikum.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'italienisch', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['400 g Spaghetti', '500 g reife Tomaten', '4 Knoblauchzehen', '4 EL Olivenöl', '1 Bund Basilikum', 'Parmesan', 'Salz, Pfeffer'],
    zubereitung: ['Knoblauch in Öl goldbraun braten.', 'Tomaten würfeln und zugeben, 10 Min. köcheln.', 'Pasta kochen, Al dente abgießen.', 'Pasta in Sauce schwenken.', 'Mit Basilikum und Parmesan servieren.'],
    image: 'images/recipes/pasta.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r56', name: 'Spinat-Ricotta-Cannelloni',
    description: 'Mit Spinat und Ricotta gefüllte Cannelloni in Tomatensauce, überbacken mit Mozzarella.',
    label: 'vegetarisch', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 60, schwierigkeit: 'mittel',
    zutaten: ['16 Cannelloni', '400 g Spinat', '250 g Ricotta', '1 Ei', '1 Dose Tomaten', '150 g Mozzarella', '50 g Parmesan', 'Muskat, Salz'],
    zubereitung: ['Spinat blanchieren, ausdrücken und hacken.', 'Mit Ricotta, Ei und Muskat vermengen.', 'Cannelloni füllen, in Auflaufform legen.', 'Tomatensauce aufgießen, Käse drüber.', 'Bei 200°C 35 Min. backen.'],
    image: 'images/recipes/gnocchi.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r57', name: 'Gemüse-Lasagne',
    description: 'Schichtige Lasagne mit Zucchini, Aubergine, Cherrytomaten und Béchamelsauce.',
    label: 'vegetarisch', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 70, schwierigkeit: 'mittel',
    zutaten: ['12 Lasagneplatten', '2 Zucchini', '1 Aubergine', '1 Dose Tomaten', '500 ml Béchamel', '200 g Mozzarella', '50 g Parmesan', 'Oregano'],
    zubereitung: ['Gemüse in Scheiben schneiden und anbraten.', 'Tomatensauce mit Oregano würzen.', 'Lasagne schichten: Sauce, Nudeln, Gemüse.', 'Mit Béchamel und Käse abschließen.', 'Bei 180°C 40 Min. backen.'],
    image: 'images/recipes/spaghetti-bolognese.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r58', name: 'Pilzrisotto',
    description: 'Cremiges Arborio-Risotto mit gemischten Pilzen, Weißwein und Parmesan.',
    label: 'vegetarisch', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 40, schwierigkeit: 'mittel',
    zutaten: ['300 g Arborio-Reis', '400 g gemischte Pilze', '1 L Gemüsebrühe', '150 ml Weißwein', '1 Zwiebel', '50 g Butter', '80 g Parmesan', 'Thymian'],
    zubereitung: ['Zwiebel anschwitzen, Reis zugeben und glasig rühren.', 'Mit Weißwein ablöschen.', 'Brühe schöpfkellenweise zugeben und rühren.', 'Pilze separat braten, unterheben.', 'Butter und Parmesan einrühren, servieren.'],
    image: 'images/recipes/risotto.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r59', name: 'Käsespätzle',
    description: 'Schwäbische Hausmannskost: Handgeschabte Spätzle mit geschmolzenem Bergkäse und Röstzwiebeln.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 45, schwierigkeit: 'mittel',
    zutaten: ['300 g Mehl', '3 Eier', '150 ml Wasser', '200 g Bergkäse', '2 Zwiebeln', '3 EL Butter', 'Salz, Muskat', 'Schnittlauch'],
    zubereitung: ['Spätzleteig aus Mehl, Eiern und Wasser schlagen.', 'Spätzle ins kochende Salzwasser schaben.', 'Zwiebeln in Butter goldbraun braten.', 'Spätzle und Käse abwechselnd schichten.', 'Mit Röstzwiebeln servieren.'],
    image: 'images/recipes/caesar-salad.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r60', name: 'Shakshuka',
    description: 'Israelisches Frühstücksgericht: In Tomaten-Paprika-Sauce pochierte Eier.',
    label: 'vegetarisch', mahlzeit: ['fruehstueck', 'mittagessen'], kueche: 'international', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['4 Eier', '1 Dose Tomaten', '2 Paprika', '1 Zwiebel', '2 Knoblauchzehen', '1 TL Kreuzkümmel', '1 TL Paprikapulver', 'Feta, Koriander'],
    zubereitung: ['Zwiebel, Knoblauch und Paprika anbraten.', 'Gewürze zugeben und rösten.', 'Tomaten aufgießen und 10 Min. köcheln.', 'Mulden eindrücken, Eier einschlagen.', 'Abgedeckt 5–8 Min. pochieren.'],
    image: 'images/recipes/scrambled-eggs.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r61', name: 'Pesto-Pasta',
    description: 'Pasta mit frisch gemörsertem Basilikum-Pesto, Pinienkernen und Parmesan.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'italienisch', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['400 g Trofie', '2 Bund Basilikum', '50 g Pinienkerne', '2 Knoblauchzehen', '80 g Parmesan', '100 ml Olivenöl', 'Salz'],
    zubereitung: ['Pinienkerne ohne Fett rösten.', 'Basilikum, Knoblauch, Pinienkerne und Parmesan im Mörser zerstampfen.', 'Olivenöl einrühren.', 'Pasta kochen, Pesto unterheben.'],
    image: 'images/recipes/pasta.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r62', name: 'Gnocchi mit Gorgonzola',
    description: 'Zarte Kartoffelgnocchi in einer cremigen Gorgonzola-Sauce mit Walnüssen.',
    label: 'vegetarisch', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['500 g Gnocchi', '150 g Gorgonzola', '200 ml Sahne', '50 g Walnüsse', '2 EL Butter', 'Thymian', 'Salz, Pfeffer'],
    zubereitung: ['Gnocchi in Salzwasser garen.', 'Gorgonzola in Sahne schmelzen.', 'Walnüsse in Butter rösten.', 'Gnocchi in Sauce schwenken.', 'Mit Walnüssen und Thymian anrichten.'],
    image: 'images/recipes/gnocchi.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r63', name: 'Gemüse-Frittata',
    description: 'Italienisches Omelett mit Zucchini, Cherrytomaten und Ziegenkäse.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'italienisch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['6 Eier', '1 Zucchini', '150 g Cherrytomaten', '100 g Ziegenkäse', '2 EL Olivenöl', 'Oregano', 'Salz, Pfeffer', 'Basilikum'],
    zubereitung: ['Zucchini in Scheiben anbraten.', 'Tomaten halbiert zugeben.', 'Verquirlte Eier aufgießen.', 'Käse drüber krümeln.', 'Im Ofen bei 180°C 10 Min. stocken lassen.'],
    image: 'images/recipes/frittata.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r64', name: 'Türkische Linsensuppe',
    description: 'Samtige rote Linsensuppe mit Kreuzkümmel, Paprika und Zitrone nach Großmutterart.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 35, schwierigkeit: 'einfach',
    zutaten: ['200 g rote Linsen', '1 Zwiebel', '2 Karotten', '2 TL Kreuzkümmel', '1 TL Paprikapulver', '1 L Gemüsebrühe', '2 EL Zitronensaft', '2 EL Butter'],
    zubereitung: ['Zwiebel und Karotten anbraten.', 'Linsen und Gewürze zugeben.', 'Brühe aufgießen, 20 Min. köcheln.', 'Pürieren und mit Zitrone abschmecken.', 'Mit Paprikabutter beträufeln.'],
    image: 'images/recipes/linsensuppe.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r65', name: 'Ofengemüse mit Feta',
    description: 'Buntes Ofengemüse mit Kürbis, Paprika und Zucchini, dazu zerlaufener Feta.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mediterran', zeit: 40, schwierigkeit: 'einfach',
    zutaten: ['1 kleiner Kürbis', '2 Paprika', '2 Zucchini', '200 g Feta', '3 EL Olivenöl', '1 TL Zaatar', '2 Knoblauchzehen', 'Thymian'],
    zubereitung: ['Gemüse in grobe Stücke schneiden.', 'Mit Öl, Knoblauch und Zaatar marinieren.', 'Bei 200°C 25 Min. rösten.', 'Feta drüber bröseln und weitere 10 Min. backen.'],
    image: 'images/recipes/vegetables.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r66', name: 'Bruschetta',
    description: 'Geröstetes Ciabatta mit marinierten Tomaten, Knoblauch und frischem Basilikum.',
    label: 'vegetarisch', mahlzeit: ['mittagessen'], kueche: 'italienisch', zeit: 15, schwierigkeit: 'einfach',
    zutaten: ['1 Ciabatta', '4 reife Tomaten', '3 Knoblauchzehen', '1 Bund Basilikum', '5 EL Olivenöl', 'Balsamico', 'Fleur de Sel'],
    zubereitung: ['Tomaten würfeln, mit Öl und Basilikum marinieren.', 'Brot in Scheiben schneiden und rösten.', 'Mit Knoblauchzehe einreiben.', 'Tomatenmix drauf geben und mit Balsamico abschließen.'],
    image: 'images/recipes/caprese.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r67', name: 'Quinoa-Bowl mit Feta',
    description: 'Nährreiche Bowl mit Quinoa, geröstetem Gemüse, Feta und Zitronendressing.',
    label: 'vegetarisch', mahlzeit: ['mittagessen'], kueche: 'international', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['200 g Quinoa', '150 g Feta', '2 Zucchini', '150 g Cherrytomaten', '1 rote Paprika', '3 EL Olivenöl', '2 EL Zitronensaft', 'Minze'],
    zubereitung: ['Quinoa kochen.', 'Gemüse bei 200°C 20 Min. rösten.', 'Dressing aus Öl und Zitrone mischen.', 'Bowl zusammenstellen und Feta drüber krümeln.'],
    image: 'images/recipes/grain-salad.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r68', name: 'Spinatsalat mit Ei',
    description: 'Frischer Babyspinat-Salat mit pochiertem Ei, Champignons und Senfdressing.',
    label: 'vegetarisch', mahlzeit: ['mittagessen'], kueche: 'international', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['200 g Babyspinat', '4 Eier', '200 g Champignons', '2 EL Senf', '3 EL Olivenöl', '2 EL Apfelessig', 'Croutons', 'Salz, Pfeffer'],
    zubereitung: ['Eier pochieren.', 'Champignons anbraten.', 'Dressing aus Senf, Öl und Essig rühren.', 'Spinat anmachen, Pilze und Ei drauf.', 'Mit Croutons servieren.'],
    image: 'images/recipes/caesar-salad.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r69', name: 'Süßkartoffel-Feta-Auflauf',
    description: 'Warmer Auflauf mit Süßkartoffeln, Kichererbsen, Spinat und gebackenem Feta.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 50, schwierigkeit: 'einfach',
    zutaten: ['2 Süßkartoffeln', '1 Dose Kichererbsen', '200 g Spinat', '200 g Feta', '3 EL Olivenöl', '1 TL Kreuzkümmel', '1 TL Paprikapulver', 'Zitrone'],
    zubereitung: ['Süßkartoffeln würfeln und mit Gewürzen rösten.', 'Kichererbsen zugeben und mitrösten.', 'Spinat unterheben.', 'Feta drüber legen und weitere 10 Min. backen.'],
    image: 'images/recipes/potato-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r70', name: 'Marokkanische Gemüse-Tajine',
    description: 'Aromatischer Eintopf mit Kichererbsen, Kürbis, Rosinen und Ras-el-Hanout.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 50, schwierigkeit: 'mittel',
    zutaten: ['1 Dose Kichererbsen', '400 g Kürbis', '2 Karotten', '50 g Rosinen', '2 TL Ras-el-Hanout', '400 ml Gemüsebrühe', '1 Zwiebel', 'Koriander'],
    zubereitung: ['Zwiebel und Gewürze anbraten.', 'Gemüse zugeben und kurz anbraten.', 'Mit Brühe aufgießen, Kichererbsen und Rosinen zugeben.', '30 Min. schonend garen.', 'Mit Koriander und Couscous servieren.'],
    image: 'images/recipes/mediterranean-veg.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r71', name: 'Caprese-Pasta',
    description: 'Pasta mit frischem Mozzarella, Tomaten und Basilikum – ein Sommer auf dem Teller.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'italienisch', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['400 g Fusilli', '250 g Büffelmozzarella', '300 g Cherrytomaten', '1 Bund Basilikum', '5 EL Olivenöl', 'Balsamico-Creme', 'Fleur de Sel'],
    zubereitung: ['Pasta kochen.', 'Tomaten halbieren und marinieren.', 'Pasta warm mit Tomaten und Öl schwenken.', 'Mozzarella zerrupfen und unterheben.', 'Basilikum drüber und servieren.'],
    image: 'images/recipes/pasta.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r72', name: 'Gebratener Reis mit Ei',
    description: 'Asiatischer gebratener Reis mit Frühlingszwiebeln, Erbsen und Rührei.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'asiatisch', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['400 g gekochter Reis', '3 Eier', '100 g Erbsen', '3 Frühlingszwiebeln', '3 EL Sojasoße', '1 EL Sesamöl', '2 Knoblauchzehen', 'Ingwer'],
    zubereitung: ['Knoblauch und Ingwer anbraten.', 'Alten Reis zugeben und scharf braten.', 'Eier daneben aufschlagen und rühren.', 'Erbsen und Frühlingszwiebeln unterheben.', 'Mit Sojasoße und Sesamöl abschmecken.'],
    image: 'images/recipes/rice-vegetables.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r73', name: 'Paprika-Tomaten-Pfanne',
    description: 'Aromatische Pfanne mit buntem Paprika, Tomaten, Oliven und Feta.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mediterran', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['3 Paprika', '300 g Cherrytomaten', '100 g Oliven', '150 g Feta', '3 EL Olivenöl', '2 Knoblauchzehen', 'Oregano', 'Brot zum Dippen'],
    zubereitung: ['Paprika in Streifen anbraten.', 'Tomaten und Knoblauch zugeben.', 'Oliven und Oregano einrühren.', 'Feta drüber bröseln, kurz warm werden lassen.', 'Mit Brot servieren.'],
    image: 'images/recipes/vegetables.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r74', name: 'Auberginenauflauf',
    description: 'Mediterraner Auflauf mit geschichteter Aubergine, Tomatensauce und Mozzarella.',
    label: 'vegetarisch', mahlzeit: ['abendessen'], kueche: 'mediterran', zeit: 55, schwierigkeit: 'mittel',
    zutaten: ['3 Auberginen', '1 Dose Tomaten', '2 Knoblauchzehen', '200 g Mozzarella', '50 g Parmesan', '4 EL Olivenöl', 'Basilikum', 'Oregano'],
    zubereitung: ['Auberginen in Scheiben schneiden, salzen und abtropfen.', 'In Öl anbraten.', 'Tomatensauce kochen.', 'Auberginen und Sauce schichten.', 'Mit Käse belegen und backen.'],
    image: 'images/recipes/mediterranean-veg.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r75', name: 'Kürbis-Risotto',
    description: 'Cremiges Hokkaido-Risotto mit Salbei, Parmesan und einem Hauch Muskat.',
    label: 'vegetarisch', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 45, schwierigkeit: 'mittel',
    zutaten: ['300 g Arborio-Reis', '400 g Hokkaido-Kürbis', '1 L Gemüsebrühe', '150 ml Weißwein', '1 Zwiebel', '50 g Parmesan', '50 g Butter', 'Salbei'],
    zubereitung: ['Kürbis würfeln und rösten.', 'Zwiebel anschwitzen, Reis zugeben.', 'Mit Weißwein ablöschen, Brühe schöpfkellenweise zugeben.', 'Kürbis einrühren.', 'Mit Butter und Parmesan vollenden.'],
    image: 'images/recipes/risotto.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r76', name: 'Zucchini-Frittata',
    description: 'Herzhaftes Omelett mit grüner Zucchini, Minze und Pecorino aus dem Ofen.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'italienisch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['6 Eier', '2 Zucchini', '80 g Pecorino', '1 Knoblauchzehe', '3 EL Olivenöl', 'Minze', 'Salz, Pfeffer'],
    zubereitung: ['Zucchini in Scheiben in Öl anbraten.', 'Knoblauch zugeben.', 'Verquirlte Eier mit Pecorino aufgießen.', 'Minze einstreuen.', 'Im Ofen bei 180°C 10 Min. garen.'],
    image: 'images/recipes/frittata.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r77', name: 'Burritos mit schwarzen Bohnen',
    description: 'Gefüllte Weizentortillas mit würzigen schwarzen Bohnen, Reis, Guacamole und Salsa.',
    label: 'vegetarisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mexikanisch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['4 Weizentortillas', '2 Dosen schwarze Bohnen', '200 g Reis', '1 Avocado', '150 g Cheddar', 'Sauerrahm', '1 TL Cumin', 'Salsa'],
    zubereitung: ['Reis kochen.', 'Bohnen mit Cumin und Knoblauch erhitzen.', 'Guacamole zubereiten.', 'Tortillas befüllen und einrollen.', 'In Pfanne kurz anrösten.'],
    image: 'images/recipes/tacos.jpg', bewertung: 0, notizen: ''
  },

  // ── FLEISCH FRÜHSTÜCK ──────────────────────────────────────────────────────
  {
    id: 'r78', name: 'Rührei mit Bacon',
    description: 'Cremiges Rührei mit knusprigem Speck, Frühlingszwiebeln und Röstbrot.',
    label: 'fleisch', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 15, schwierigkeit: 'einfach',
    zutaten: ['4 Eier', '100 g Baconstreifen', '2 EL Butter', '2 EL Sahne', '2 Frühlingszwiebeln', 'Salz, Pfeffer', '4 Scheiben Toastbrot'],
    zubereitung: ['Bacon knusprig braten, herausnehmen.', 'Eier mit Sahne verquirlen.', 'In Butter langsam rühren bis cremig.', 'Frühlingszwiebeln unterheben.', 'Mit Bacon und Röstbrot servieren.'],
    image: 'images/recipes/bacon-breakfast.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r79', name: 'Eggs Benedict',
    description: 'Klassisches amerikanisches Frühstück mit pochiertem Ei, Hollandaise und Bacon auf English Muffin.',
    label: 'fleisch', mahlzeit: ['fruehstueck'], kueche: 'international', zeit: 30, schwierigkeit: 'schwer',
    zutaten: ['4 Eier', '4 Scheiben Bacon', '2 English Muffins', '3 Eigelb', '150 g Butter', '1 EL Zitronensaft', 'Cayenne', 'Weißweinessig'],
    zubereitung: ['Hollandaise aus Eigelb, Butter und Zitrone herstellen.', 'Bacon knusprig braten.', 'Muffins toasten.', 'Eier in Essigwasser pochieren.', 'Alles stapeln und Hollandaise drüber.'],
    image: 'images/recipes/eggs-benedict.jpg', bewertung: 0, notizen: ''
  },

  // ── FLEISCH HAUPTGERICHTE ──────────────────────────────────────────────────
  {
    id: 'r80', name: 'Hähnchen-Tikka-Masala',
    description: 'Zartes Hähnchen in cremiger Tomaten-Kokos-Sauce mit indischen Gewürzen.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'asiatisch', zeit: 45, schwierigkeit: 'mittel',
    zutaten: ['600 g Hähnchenbrustfilet', '1 Dose Tomaten', '200 ml Kokosmilch', '2 TL Garam Masala', '1 TL Kurkuma', '2 TL Paprikapulver', '1 Zwiebel', 'Ingwer, Knoblauch'],
    zubereitung: ['Hähnchen würfeln und scharf anbraten.', 'Zwiebel, Knoblauch und Ingwer anbraten.', 'Gewürze rösten.', 'Tomaten und Kokosmilch zugeben, 20 Min. köcheln.', 'Hähnchen zurückgeben und erwärmen.'],
    image: 'images/recipes/gemuese-curry.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r81', name: 'Rindergulasch',
    description: 'Ungarischer Klassiker: Zartes Rindfleisch in kräftiger Paprikasauce, stundenlang geschmort.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 120, schwierigkeit: 'mittel',
    zutaten: ['800 g Rindergulasch', '3 Zwiebeln', '2 EL Paprikapulver (edelsüß)', '1 TL Paprikapulver (scharf)', '400 ml Rinderbrühe', '2 EL Tomatenmark', 'Lorbeer', 'Kümmel'],
    zubereitung: ['Fleisch scharf anbraten, herausnehmen.', 'Zwiebeln goldbraun braten.', 'Paprikapulver zugeben, sofort mit Brühe ablöschen.', 'Fleisch zurückgeben, 90 Min. schmoren.', 'Mit Semmelknödel servieren.'],
    image: 'images/recipes/meat-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r82', name: 'Schweineschnitzel',
    description: 'Knuspriges Schweineschnitzel mit Kartoffelsalat und einem Spritzer Zitrone.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['4 Schweineschnitzel', '100 g Paniermehl', '2 Eier', '100 g Mehl', 'Butterschmalz', 'Zitrone', 'Salz, Pfeffer', 'Petersilie'],
    zubereitung: ['Schnitzel klopfen und würzen.', 'In Mehl, Ei und Paniermehl wenden.', 'In Butterschmalz goldbraun braten.', 'Auf Küchenpapier abtropfen.', 'Mit Zitrone und Kartoffelsalat servieren.'],
    image: 'images/recipes/schnitzel.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r83', name: 'Hähnchenbrust mit Champignons',
    description: 'Saftige Hähnchenbrust in cremiger Champignon-Rahmsauce mit Thymian.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'deutsch', zeit: 35, schwierigkeit: 'einfach',
    zutaten: ['4 Hähnchenbrustfilets', '400 g Champignons', '200 ml Sahne', '1 Zwiebel', '2 Knoblauchzehen', '3 EL Olivenöl', 'Thymian', 'Salz, Pfeffer'],
    zubereitung: ['Hähnchen in Öl goldbraun braten, herausnehmen.', 'Champignons und Zwiebeln anbraten.', 'Sahne und Thymian zugeben, einköcheln.', 'Hähnchen zurückgeben und durchgaren.', 'Mit Reis oder Nudeln servieren.'],
    image: 'images/recipes/chicken-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r84', name: 'Flammkuchen mit Speck',
    description: 'Elsässischer Flammkuchen mit Crème fraîche, Speck und Zwiebeln auf dünnem Teig.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'deutsch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['300 g Flammkuchenteig', '200 g Crème fraîche', '150 g Speckwürfel', '2 Zwiebeln', 'Muskat', 'Salz, Pfeffer', 'Schnittlauch'],
    zubereitung: ['Teig dünn ausrollen.', 'Crème fraîche mit Muskat würzen und aufstreichen.', 'Zwiebeln und Speck verteilen.', 'Bei 250°C 10–12 Min. backen.', 'Mit Schnittlauch servieren.'],
    image: 'images/recipes/quiche.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r85', name: 'Bratwurst mit Sauerkraut',
    description: 'Saftige Bratwurst mit würzigem Sauerkraut und Kartoffelpüree.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['4 Bratwürste', '500 g Sauerkraut', '800 g Kartoffeln', '200 ml Milch', '50 g Butter', '1 Zwiebel', 'Kümmel', 'Salz'],
    zubereitung: ['Bratwürste in Pfanne goldbraun braten.', 'Sauerkraut mit Zwiebel und Kümmel erhitzen.', 'Kartoffeln kochen und stampfen.', 'Mit Milch und Butter cremig rühren.', 'Alles zusammen servieren.'],
    image: 'images/recipes/pulled-pork.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r86', name: 'Frikadellen',
    description: 'Saftige deutsche Frikadellen mit eingeweichter Semmel, Zwiebeln und Senfdip.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['500 g gemischtes Hackfleisch', '1 altbackene Semmel', '2 Eier', '1 Zwiebel', '1 TL Senf', 'Petersilie', 'Salz, Pfeffer', 'Butterschmalz'],
    zubereitung: ['Semmel einweichen und ausdrücken.', 'Mit Hack, Eiern, Zwiebel und Kräutern vermengen.', 'Frikadellen formen.', 'In Butterschmalz von beiden Seiten braten.', 'Mit Senf und Kartoffelsalat servieren.'],
    image: 'images/recipes/meat-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r87', name: 'Wiener Schnitzel',
    description: 'Das Original aus Kalbfleisch mit welliger Panade, Petersilkartoffeln und Preiselbeeren.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 35, schwierigkeit: 'mittel',
    zutaten: ['4 Kalbsschnitzel', '100 g Paniermehl', '2 Eier', '80 g Mehl', 'Butterschmalz', 'Zitrone', 'Preiselbeeren', 'Petersilkartoffeln'],
    zubereitung: ['Schnitzel dünn klopfen.', 'In Mehl, verquirltem Ei und Paniermehl wenden.', 'In viel Butterschmalz schwimmend backen.', 'Auf Küchenpapier abtropfen.', 'Mit Zitrone und Preiselbeeren anrichten.'],
    image: 'images/recipes/schnitzel.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r88', name: 'Chili con Carne',
    description: 'Kräftiges Chili mit Rinderhack, Kidneybohnen, Mais und dunkler Schokolade.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mexikanisch', zeit: 45, schwierigkeit: 'einfach',
    zutaten: ['500 g Rinderhackfleisch', '2 Dosen Kidneybohnen', '1 Dose Mais', '1 Dose Tomaten', '2 TL Chiliflocken', '2 TL Kreuzkümmel', '20 g Zartbitterschokolade', '1 Zwiebel'],
    zubereitung: ['Hack mit Zwiebel anbraten.', 'Gewürze zugeben und rösten.', 'Tomaten, Bohnen und Mais zugeben.', '25 Min. köcheln.', 'Schokolade einschmelzen, mit Sauerrahm servieren.'],
    image: 'images/recipes/chili.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r89', name: 'Rindfleisch-Stir-Fry',
    description: 'Zartes Rindfleisch mit Pak Choi, Karotten und Austernsoße im heißen Wok.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'asiatisch', zeit: 25, schwierigkeit: 'mittel',
    zutaten: ['400 g Rinderfilet', '200 g Pak Choi', '2 Karotten', '3 EL Austernsoße', '2 EL Sojasoße', '1 EL Sesamöl', 'Ingwer', 'Knoblauch'],
    zubereitung: ['Fleisch in dünne Streifen schneiden und marinieren.', 'Im Wok scharf anbraten, herausnehmen.', 'Gemüse braten.', 'Fleisch zurückgeben, Sauce einrühren.', 'Mit Reis servieren.'],
    image: 'images/recipes/stir-fry.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r90', name: 'Pulled Pork Sandwich',
    description: 'Zart geschmorter Schweinenacken mit süßer BBQ-Sauce in einem Brioche-Bun.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 240, schwierigkeit: 'schwer',
    zutaten: ['1 kg Schweinenacken', '4 EL BBQ-Rub', '200 ml BBQ-Sauce', '4 Brioche-Buns', 'Coleslaw', '2 EL Apfelessig', 'Salz'],
    zubereitung: ['Fleisch mit Rub einreiben.', 'Im Ofen bei 130°C 4–5 Stunden garen.', 'Fleisch zerpflücken und mit BBQ-Sauce mischen.', 'Buns toasten.', 'Mit Coleslaw belegen.'],
    image: 'images/recipes/pulled-pork.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r91', name: 'Korean Fried Chicken',
    description: 'Doppelt frittiertes Hähnchen in süß-scharfer Gochujang-Glasur.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'asiatisch', zeit: 45, schwierigkeit: 'mittel',
    zutaten: ['800 g Hähnchenteile', '150 g Stärke', '3 EL Gochujang', '2 EL Honig', '2 EL Sojasoße', 'Knoblauch', 'Ingwer', 'Sesam'],
    zubereitung: ['Hähnchen in Stärke wenden.', 'Bei 170°C frittieren, abkühlen lassen.', 'Nochmals bei 190°C frittieren für Knusprigkeit.', 'Glasur aus Gochujang, Honig und Sojasoße kochen.', 'Hähnchen in Glasur wenden und servieren.'],
    image: 'images/recipes/chicken-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r92', name: 'Köfte mit Kräuterdip',
    description: 'Türkische Hackfleischspieße mit Paprika, Zwiebeln und Joghurt-Kräuterdip.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['500 g Lammhack', '1 Zwiebel', '2 Knoblauchzehen', '1 TL Cumin', '1 TL Koriander', '200 g Joghurt', 'Minze', 'Petersilie'],
    zubereitung: ['Hack mit Gewürzen und Zwiebel vermengen.', 'Zu Köfte formen und auf Spieße stecken.', 'Auf dem Grill oder in der Pfanne braten.', 'Joghurt mit Kräutern verrühren.', 'Mit Fladenbrot und Dip servieren.'],
    image: 'images/recipes/meat-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r93', name: 'Hackfleisch-Pfanne',
    description: 'Schnelle Alltagspfanne mit Rinderhack, Paprika, Mais und Crème fraîche.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['500 g Rinderhackfleisch', '2 Paprika', '1 Dose Mais', '1 Zwiebel', '200 g Crème fraîche', 'Paprikapulver', 'Salz, Pfeffer', 'Reis'],
    zubereitung: ['Hack mit Zwiebel krümelig braten.', 'Paprika würfeln und zugeben.', 'Mit Paprikapulver würzen.', 'Mais und Crème fraîche unterrühren.', 'Kurz köcheln und mit Reis servieren.'],
    image: 'images/recipes/meat-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r94', name: 'Rinderrouladen',
    description: 'Zarte Rinderrouladen mit Senf, Gurken und Speck, in dunkler Rotwein-Sauce geschmort.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 100, schwierigkeit: 'schwer',
    zutaten: ['4 Rinderrouladen', '4 TL Senf', '4 Scheiben Bauchspeck', '4 Gewürzgurken', '1 Zwiebel', '400 ml Rotwein', '400 ml Rinderbrühe', 'Lorbeer'],
    zubereitung: ['Rouladen mit Senf bestreichen.', 'Mit Speck, Gurke und Zwiebel belegen und aufrollen.', 'Scharf anbraten.', 'Mit Rotwein ablöschen, Brühe zugeben.', '90 Min. schmoren, Sauce einkochen.'],
    image: 'images/recipes/meat-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r95', name: 'Hähnchensuppe',
    description: 'Wärmende klare Hühnerbrühe mit zartem Fleisch, Nudeln und frischer Petersilie.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 90, schwierigkeit: 'einfach',
    zutaten: ['1 Suppenhuhn', '3 Karotten', '1/4 Sellerie', '1 Stange Lauch', '100 g Nudeln', 'Petersilie', 'Salz', 'Pfefferkörner'],
    zubereitung: ['Huhn mit Gemüse und Pfefferkörnern aufsetzen.', '60 Min. köcheln.', 'Huhn herausnehmen, Fleisch zupfen.', 'Brühe sieben, Nudeln darin garen.', 'Fleisch zugeben, mit Petersilie servieren.'],
    image: 'images/recipes/linsensuppe.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r96', name: 'Sloppy Joe',
    description: 'Amerikanisches Hackfleischsandwich mit Tomaten-BBQ-Soße in einem getoasteten Bun.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['500 g Rinderhackfleisch', '1 Dose Tomaten', '2 EL BBQ-Sauce', '1 EL Worcestersauce', '1 Paprika', '1 Zwiebel', '4 Hamburger-Buns', 'Cheddar'],
    zubereitung: ['Hack und Zwiebel anbraten.', 'Paprika zugeben.', 'Tomaten und Saucen einrühren.', '10 Min. köcheln.', 'In getoasteten Buns mit Käse servieren.'],
    image: 'images/recipes/burger.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r97', name: 'Pasta mit Thunfisch',
    description: 'Schnelle Pasta mit Thunfisch, Kapern, Oliven und Cherrytomaten.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'italienisch', zeit: 20, schwierigkeit: 'einfach',
    zutaten: ['400 g Spaghetti', '2 Dosen Thunfisch', '150 g Cherrytomaten', '2 EL Kapern', '50 g Oliven', '3 EL Olivenöl', '2 Knoblauchzehen', 'Petersilie'],
    zubereitung: ['Pasta kochen.', 'Knoblauch in Öl anbraten.', 'Tomaten, Kapern und Oliven zugeben.', 'Thunfisch einrühren.', 'Pasta unterheben und mit Petersilie servieren.'],
    image: 'images/recipes/pasta.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r98', name: 'Garnelen-Curry',
    description: 'Cremiges Kokosmilch-Curry mit Garnelen, Mango und Kaffir-Limettenblättern.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'asiatisch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['400 g Garnelen', '1 Dose Kokosmilch', '2 EL rote Currypaste', '1 Mango', '2 Kaffir-Limettenblätter', '2 EL Fischsoße', 'Limette', 'Thai-Basilikum'],
    zubereitung: ['Currypaste in Öl anbraten.', 'Kokosmilch aufgießen.', 'Limettenblätter und Fischsoße zugeben.', 'Garnelen zugeben und 5 Min. garen.', 'Mango würfeln und mit Reis servieren.'],
    image: 'images/recipes/thai-curry.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r99', name: 'Fischfilet mit Kräuterkruste',
    description: 'Gebratenes Kabeljaufilet unter einer knusprigen Kräuter-Parmesan-Kruste.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'mediterran', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['4 Kabeljaufilets', '50 g Paniermehl', '30 g Parmesan', '2 EL Petersilie', '2 EL Dill', '3 EL Butter', 'Zitrone', 'Salz, Pfeffer'],
    zubereitung: ['Kräuter, Paniermehl und Parmesan mischen.', 'Butter einarbeiten.', 'Fisch würzen und Kräutermix drauf legen.', 'Bei 200°C 15 Min. backen.', 'Mit Zitronenspalte und Kartoffeln servieren.'],
    image: 'images/recipes/lachs.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r100', name: 'Hähnchen-Teriyaki',
    description: 'Glasiertes Hähnchen in süß-salziger Teriyaki-Soße mit Sesam und Reisnudeln.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'asiatisch', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['4 Hähnchenschenkel', '4 EL Sojasoße', '2 EL Mirin', '2 EL Sake', '1 EL Honig', '1 EL Stärke', 'Sesam', 'Frühlingszwiebeln'],
    zubereitung: ['Hähnchen in Pfanne scharf anbraten.', 'Sojasoße, Mirin, Sake und Honig mischen.', 'Über Hähnchen gießen und köcheln.', 'Stärke zum Binden einrühren.', 'Mit Sesam, Frühlingszwiebeln und Reis servieren.'],
    image: 'images/recipes/chicken-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r101', name: 'Schweinelende mit Äpfeln',
    description: 'Zartes Schweinefilet mit karamellisierten Äpfeln, Calvados und Rahmsoße.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'deutsch', zeit: 40, schwierigkeit: 'mittel',
    zutaten: ['600 g Schweinefilet', '3 Äpfel', '50 ml Calvados', '200 ml Sahne', '2 EL Butter', 'Thymian', 'Salz, Pfeffer', 'Kartoffeln'],
    zubereitung: ['Filet in Medaillons schneiden, scharf anbraten.', 'Äpfel in Scheiben in Butter karamellisieren.', 'Mit Calvados flambieren.', 'Sahne zugeben und einköcheln.', 'Mit Kartoffeln servieren.'],
    image: 'images/recipes/meat-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r102', name: 'Hähnchen-Gyros',
    description: 'Griechisch mariniertes Hähnchen mit Zaziki, Tomaten und Zwiebeln im Pitabrot.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mediterran', zeit: 35, schwierigkeit: 'einfach',
    zutaten: ['600 g Hähnchenbrust', '2 TL Oregano', '1 TL Paprikapulver', '2 Knoblauchzehen', '4 Pitabrote', '200 g Zaziki', '2 Tomaten', '1 rote Zwiebel'],
    zubereitung: ['Hähnchen marinieren (Öl, Oregano, Paprika, Knoblauch).', 'Scharf anbraten und in Streifen schneiden.', 'Pita erwärmen.', 'Zaziki aufstreichen.', 'Hähnchen, Tomaten und Zwiebeln einlegen.'],
    image: 'images/recipes/grillhaehnchen.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r103', name: 'Pasta Carbonara',
    description: 'Römisches Original mit Pancetta, Eigelb, Pecorino und schwarzem Pfeffer.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 25, schwierigkeit: 'mittel',
    zutaten: ['400 g Spaghetti', '150 g Pancetta', '4 Eigelb', '100 g Pecorino', '100 g Parmesan', 'Schwarzer Pfeffer', 'Salz'],
    zubereitung: ['Pancetta knusprig braten.', 'Eigelb mit geriebenem Käse und Pfeffer vermengen.', 'Pasta kochen.', 'Pfanne von Herd, Pasta und etwas Kochwasser zugeben.', 'Eiermasse unterheben bis cremig.'],
    image: 'images/recipes/carbonara.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r104', name: 'Pizza mit Prosciutto',
    description: 'Knusprige Pizza Bianca mit Mozzarella, Prosciutto di Parma und Rucola.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'italienisch', zeit: 35, schwierigkeit: 'einfach',
    zutaten: ['300 g Pizzateig', '200 ml Tomatensauce', '200 g Mozzarella', '100 g Prosciutto', '50 g Rucola', '3 EL Olivenöl', 'Parmesan', 'Basilikum'],
    zubereitung: ['Teig ausrollen.', 'Tomatensauce aufstreichen.', 'Mozzarella drüber.', 'Bei 250°C 12 Min. backen.', 'Prosciutto und Rucola nach dem Backen drauf.'],
    image: 'images/recipes/pizza.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r105', name: 'Döner-Bowl',
    description: 'All-in-One-Bowl mit Hähnchenfleisch, Fladenbrot-Croutons, Joghurt und Krautsalat.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 30, schwierigkeit: 'einfach',
    zutaten: ['500 g Hähnchenbrust', '2 EL Dönergewürz', '200 g Joghurt', '200 g Weißkohl', '2 Tomaten', '1 rote Zwiebel', 'Fladenbrot', 'Sumach'],
    zubereitung: ['Hähnchen mit Dönergewürz braten.', 'Kohl raspeln und mit Salz marinieren.', 'Joghurt mit Knoblauch und Sumach würzen.', 'Fladenbrot würfeln und rösten.', 'Bowl zusammenstellen.'],
    image: 'images/recipes/haehnchen-wrap.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r106', name: 'Griechisches Hähnchen mit Zitrone',
    description: 'Im Ofen geschmortes Hähnchen mit Zitronen, Knoblauch, Oliven und Oregano.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'mediterran', zeit: 60, schwierigkeit: 'einfach',
    zutaten: ['1 Hähnchen', '2 Zitronen', '8 Knoblauchzehen', '100 g Kalamata-Oliven', '2 TL Oregano', '5 EL Olivenöl', '500 g Kartoffeln', 'Salz, Pfeffer'],
    zubereitung: ['Hähnchen mit Öl, Zitrone und Oregano einreiben.', 'Kartoffeln und Knoblauch in Auflaufform legen.', 'Hähnchen drauf setzen.', 'Bei 200°C 45–50 Min. braten.', 'Mit Oliven und Zitronenspalten servieren.'],
    image: 'images/recipes/grillhaehnchen.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r107', name: 'Lachs-Quiche',
    description: 'Cremige Quiche mit geräuchertem Lachs, Dill, Crème fraîche und Frühlingszwiebeln.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'international', zeit: 70, schwierigkeit: 'mittel',
    zutaten: ['200 g Mürbteig', '200 g Räucherlachs', '3 Eier', '200 g Crème fraîche', '3 Frühlingszwiebeln', 'Dill', 'Salz, Pfeffer', 'Muskat'],
    zubereitung: ['Mürbteig in Form geben, blind backen.', 'Lachs und Frühlingszwiebeln auf Teig legen.', 'Eier mit Crème fraîche, Dill und Gewürzen verrühren.', 'Aufgießen.', 'Bei 180°C 30 Min. backen.'],
    image: 'images/recipes/lachs.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r108', name: 'Garnelen-Tacos',
    description: 'Knusprige Garnelen in Maistortillas mit Ananas-Salsa und Limetten-Crema.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'mexikanisch', zeit: 25, schwierigkeit: 'einfach',
    zutaten: ['400 g Garnelen', '8 Maistortillas', '200 g Ananas', '1 rote Zwiebel', '100 g Sauerrahm', '1 Limette', 'Koriander', '1 TL Chiliflocken'],
    zubereitung: ['Garnelen mit Chili würzen und scharf braten.', 'Ananas und Zwiebel würfeln, mit Koriander mischen.', 'Sauerrahm mit Limettensaft verrühren.', 'Tortillas erwärmen.', 'Befüllen und servieren.'],
    image: 'images/recipes/tacos.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r109', name: 'Zürcher Geschnetzeltes',
    description: 'Zartes Kalbfleisch in cremiger Weißwein-Rahmsauce mit Champignons – Schweizer Klassiker.',
    label: 'fleisch', mahlzeit: ['abendessen'], kueche: 'deutsch', zeit: 30, schwierigkeit: 'mittel',
    zutaten: ['500 g Kalbsgeschnetzeltes', '300 g Champignons', '200 ml Sahne', '150 ml Weißwein', '1 Zwiebel', '2 EL Butter', 'Thymian', 'Rösti'],
    zubereitung: ['Fleisch in Butter scharf anbraten, herausnehmen.', 'Champignons und Zwiebel braten.', 'Mit Weißwein ablöschen.', 'Sahne und Thymian zugeben, einköcheln.', 'Fleisch zurückgeben, mit Rösti servieren.'],
    image: 'images/recipes/chicken-dish.jpg', bewertung: 0, notizen: ''
  },
  {
    id: 'r110', name: 'Sauerbraten',
    description: 'Westfälischer Sauerbraten: Rindfleisch in Rotwein-Essig-Beize, mit Rosinen-Soße und Klößen.',
    label: 'fleisch', mahlzeit: ['mittagessen', 'abendessen'], kueche: 'deutsch', zeit: 180, schwierigkeit: 'schwer',
    zutaten: ['1 kg Rinderbraten', '500 ml Rotweinessig', '500 ml Rotwein', '2 Zwiebeln', '50 g Rosinen', 'Lorbeer', 'Wacholderbeeren', 'Klöße'],
    zubereitung: ['Fleisch 2–3 Tage in Beize einlegen.', 'Herausnehmen und scharf anbraten.', 'Beize zugeben und 2 Stunden schmoren.', 'Sauce mit Rosinen und Lebkuchen binden.', 'Mit Klößen und Rotkohl servieren.'],
    image: 'images/recipes/meat-dish.jpg', bewertung: 0, notizen: ''
  }
];

// ─── State Management ────────────────────────────────────────────────────────
const STATE_KEY = 'fellifood_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (!s.intervalWeeks) s.intervalWeeks = 1;
      if (!s.cyclePlans)    s.cyclePlans = {};
      return s;
    }
  } catch (e) {}
  return null;
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function initState() {
  const saved = loadState();
  if (saved) {
    // Merge new recipes from INITIAL_RECIPES that don't exist in saved state
    const savedIds = new Set(saved.recipes.map(r => r.id));
    const newRecipes = INITIAL_RECIPES.filter(r => !savedIds.has(r.id));
    if (newRecipes.length > 0) {
      saved.recipes = [...saved.recipes, ...newRecipes];
    }
    // Update image paths of existing recipes to local paths
    const imageMap = Object.fromEntries(INITIAL_RECIPES.map(r => [r.id, r.image]));
    saved.recipes = saved.recipes.map(r =>
      imageMap[r.id] ? { ...r, image: imageMap[r.id] } : r
    );
    saveState(saved);
    return saved;
  }

  return {
    recipes: INITIAL_RECIPES,
    weekPlan: buildEmptyWeekPlan(),
    currentWeekOffset: 0,
    intervalWeeks: 1,
    cyclePlans: {}
  };
}

function buildEmptyWeekPlan(offset = 0) {
  const days = [];
  const today = new Date();
  // Get Monday of the current week + offset weeks
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek + offset * 7);

  const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: dayNames[i],
      meals: [
        { type: 'fruehstueck', label: 'Morgen', recipeId: null, done: false },
        { type: 'mittagessen', label: 'Mittag', recipeId: null, done: false },
        { type: 'abendessen', label: 'Abend', recipeId: null, done: false }
      ]
    });
  }
  return days;
}
