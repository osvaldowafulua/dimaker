export type GraphicSectionId =
  | 'inspirations'
  | 'ads'
  | 'svg-icons'
  | 'designers'
  | 'stock-images'
  | 'logos'
  | 'tools';

export type StockImage = {
  id: string;
  title: string;
  imageUrl: string;
};

export const GRAPHIC_SECTION_META: Record<
  GraphicSectionId,
  { label: string; title: string; description: string }
> = {
  inspirations: {
    label: 'Inspirations',
    title: 'Free Stock Photos',
    description:
      'Unlimited download free stock photos, royalty free images & videos shared by creators.',
  },
  ads: {
    label: 'Ads',
    title: 'Free Stock Photos',
    description:
      'Unlimited download free stock photos, royalty free images & videos shared by creators.',
  },
  'svg-icons': {
    label: 'SVG Icons',
    title: 'Free Stock Photos',
    description:
      'Unlimited download free stock photos, royalty free images & videos shared by creators.',
  },
  designers: {
    label: 'Designers',
    title: 'Free Stock Photos',
    description:
      'Unlimited download free stock photos, royalty free images & videos shared by creators.',
  },
  'stock-images': {
    label: 'Stock Images',
    title: 'Free Stock Photos',
    description:
      'Unlimited download free stock photos, royalty free images & videos shared by creators.',
  },
  logos: {
    label: 'Logos',
    title: 'Free Stock Photos',
    description:
      'Unlimited download free stock photos, royalty free images & videos shared by creators.',
  },
  tools: {
    label: 'Tools',
    title: 'Free Stock Photos',
    description:
      'Unlimited download free stock photos, royalty free images & videos shared by creators.',
  },
};

export const GRAPHIC_SECTION_SLUGS = Object.keys(
  GRAPHIC_SECTION_META,
) as GraphicSectionId[];

function img(id: number, w = 940) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&h=650&w=${w}`;
}

export const STOCK_BY_SECTION: Record<GraphicSectionId, StockImage[]> = {
  inspirations: [
    { id: 'i1', title: "Inspirational word 'INSPIRE' on stone", imageUrl: img(33802234) },
    { id: 'i2', title: "Black 'Inspiration' text on white canvas", imageUrl: img(9016971) },
    { id: 'i3', title: "Motivational quote on sticky note", imageUrl: img(7414223) },
    { id: 'i4', title: "'Inspire' on textured brown stone", imageUrl: img(33802235) },
    { id: 'i5', title: 'Letters forming inspire on burlap', imageUrl: img(4116636) },
    { id: 'i6', title: "Phone with 'Inspire' on screen", imageUrl: img(4705121) },
    { id: 'i7', title: 'Be the change you want to see', imageUrl: img(6185628) },
    { id: 'i8', title: 'Inspirational message on wall', imageUrl: img(17242671) },
    { id: 'i9', title: 'Framed motivational quote', imageUrl: img(6431877) },
    { id: 'i10', title: 'Open notebook with handwritten quote', imageUrl: img(10997652) },
  ],
  ads: [
    { id: 'a1', title: 'Woman reading newspaper outdoors', imageUrl: img(19474179) },
    { id: 'a2', title: 'Nighttime urban scene with ads', imageUrl: img(28288097) },
    { id: 'a3', title: 'Hand holding 50% sale tag', imageUrl: img(8706561) },
    { id: 'a4', title: 'Women holding red sale sign', imageUrl: img(5622919) },
    { id: 'a5', title: 'Brunette woman with sale sign', imageUrl: img(5622932) },
    { id: 'a6', title: 'Office with computers displaying data', imageUrl: img(6476578) },
    { id: 'a7', title: 'Laptop displaying ad spend data', imageUrl: img(6476805) },
    { id: 'a8', title: 'Business presentation on ad spend', imageUrl: img(6476787) },
    { id: 'a9', title: 'Urban notice board with advertisements', imageUrl: img(15261012) },
    { id: 'a10', title: "Sign reading 'Share on your social'", imageUrl: img(7563686) },
  ],
  'svg-icons': [
    { id: 's1', title: 'Sports-themed emojis on smartphone', imageUrl: img(31995463) },
    { id: 's2', title: 'Smartphone home screen app icons', imageUrl: img(5444628) },
    { id: 's3', title: 'World flags emojis on screen', imageUrl: img(31995462) },
    { id: 's4', title: 'Communication icons on smartphone', imageUrl: img(263564) },
    { id: 's5', title: 'Various app icons on dark background', imageUrl: img(10920328) },
    { id: 's6', title: 'Graduation attire with medal', imageUrl: img(25477711) },
    { id: 's7', title: 'Emojis representing digital communication', imageUrl: img(31995465) },
    { id: 's8', title: 'Social media apps in dim environment', imageUrl: img(14158915) },
    { id: 's9', title: 'Woman posing with flags background', imageUrl: img(25477713) },
    { id: 's10', title: 'Woman in military uniform saluting', imageUrl: img(25477724) },
  ],
  designers: [
    { id: 'd1', title: 'Designers working on fashion sketches', imageUrl: img(36730527) },
    { id: 'd2', title: 'Three designers collaborating', imageUrl: img(6322359) },
    { id: 'd3', title: 'Fashion designer sketching dress ideas', imageUrl: img(8527897) },
    { id: 'd4', title: 'Designer sketching on tablet', imageUrl: img(4622222) },
    { id: 'd5', title: 'Women working on fashion design', imageUrl: img(36731578) },
    { id: 'd6', title: 'Designers with fabric samples', imageUrl: img(8527899) },
    { id: 'd7', title: 'Designers in studio with tools', imageUrl: img(8516356) },
    { id: 'd8', title: 'Collaborating with red fabric', imageUrl: img(9850407) },
    { id: 'd9', title: 'Fashion designer sketching designs', imageUrl: img(9849320) },
    { id: 'd10', title: 'Fashion designers in workshop', imageUrl: img(4622225) },
  ],
  'stock-images': [
    { id: 'st1', title: 'Man working on photography website', imageUrl: img(5083405) },
    { id: 'st2', title: 'Stock report financial graph', imageUrl: img(7947709) },
    { id: 'st3', title: 'Stock market charts with magnifying glass', imageUrl: img(7948043) },
    { id: 'st4', title: "Wooden blocks spelling 'STOCK'", imageUrl: img(30917892) },
    { id: 'st5', title: 'Business financial report charts', imageUrl: img(7948099) },
    { id: 'st6', title: 'Tablet for online trading analysis', imageUrl: img(4960464) },
    { id: 'st7', title: 'Financial pie charts with pencils', imageUrl: img(7948104) },
    { id: 'st8', title: 'Pie charts on paper with supplies', imageUrl: img(7947711) },
    { id: 'st9', title: 'Tablet displaying stock market data', imageUrl: img(29828529) },
    { id: 'st10', title: 'Stock report market performance', imageUrl: img(7947742) },
  ],
  logos: [
    { id: 'l1', title: 'Branding, identity, and marketing', imageUrl: img(7661590) },
    { id: 'l2', title: 'Branding and marketing concepts', imageUrl: img(7661184) },
    { id: 'l3', title: 'Branding and Marketing text', imageUrl: img(7661185) },
    { id: 'l4', title: 'Minimalist branding and marketing', imageUrl: img(7661139) },
    { id: 'l5', title: 'Hotel sign with Shell and McDonalds', imageUrl: img(35778914) },
    { id: 'l6', title: 'Rows of Pexels badges', imageUrl: img(33714875) },
    { id: 'l7', title: 'Metallic car logo close-up', imageUrl: img(28905721) },
    {
      id: 'l8',
      title: 'Hand reviewing logo designs',
      imageUrl:
        'https://images.pexels.com/photos/17845/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    { id: 'l9', title: 'Red Nike swoosh logo', imageUrl: img(8176112) },
    { id: 'l10', title: 'Young man in sports jersey', imageUrl: img(13145354) },
  ],
  tools: [
    { id: 't1', title: 'Ratchet and socket tool set', imageUrl: img(31501005) },
    { id: 't2', title: 'Tools organized on wall rack', imageUrl: img(6263062) },
    { id: 't3', title: 'Red handled pliers on leather', imageUrl: img(5583080) },
    { id: 't4', title: 'Industrial machinery on workbench', imageUrl: img(7423708) },
    { id: 't5', title: 'Tools scattered on workbench', imageUrl: img(5846253) },
    { id: 't6', title: 'Collection of steel wrenches', imageUrl: img(220639) },
    { id: 't7', title: 'Tools on workshop rack', imageUrl: img(33000620) },
    { id: 't8', title: 'Woodworking tools on table', imageUrl: img(7480720) },
    { id: 't9', title: 'Wrenches in workshop setting', imageUrl: img(7540627) },
    { id: 't10', title: 'Cluttered workbench with hand tools', imageUrl: img(29785581) },
  ],
};
