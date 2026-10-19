// ─────────────────────────────────────────────────────────────
// CHARACTER ASSET PROMPT PIPELINE
// The Long Road Home — Abode
// ─────────────────────────────────────────────────────────────
// Pipeline: Concept Portrait → Full-Body Concept → Style Transfer → Reference Sheet
// Tool: DALL-E 3
// Output: PNG, 1024x1024 or 1024x1792 (portrait)
//
// How to use:
//   1. Copy the prompt string for the desired stage
//   2. Generate in DALL-E 3
//   3. Save output to public/abode/ with the recommended filename
//   4. Update assets.ts to register the new asset
//
// Pipeline notes:
//   - Stage 1 → 2: Extract facial features and identity from the portrait
//   - Stage 2 → 3: Apply the game's 2D side-scroll art style to the full body
//   - Stage 3 → 4: Use the styled full-body as image reference for the sheet
//   - For Stage 4, upload the Stage 3 output as an image prompt in DALL-E 3
//     and combine with the text prompt below
// ─────────────────────────────────────────────────────────────

export interface PromptStage {
  stage: number;
  name: string;
  description: string;
  inputRequires?: string;
  outputFilename: string;
  aspectRatio: '1024x1024' | '1024x1792' | '1792x1024';
  prompt: string;
}

// ── GAME PALETTE (reference for prompt consistency) ──────────
export const GAME_PALETTE = {
  lateriteRed:   '#c8522a', // Soil / Danger / Wounds
  survivalGreen: '#7ec87e', // Radio / Night Vision / Hope
  agedPaper:     '#c8b89a', // UI Text / Warm Light Sources
  concreteGrey:  '#6a6258', // Urban Decay / Dead Zones
  deepShadow:    '#1a1610', // Night / Interior Threat
  rustOrange:    '#8b4a1a', // Fire / Structural Decay
  paleSky:       '#8ab0b8', // Daylight Outdoors / Safe Zones
  voidBlack:     '#080604', // Deepest Shadow / Cut Scenes
} as const;

export const STYLE_KEYWORDS = {
  // Core visual language — use in every prompt
  medium: 'digital matte painting with visible painterly brushwork and subtle film grain',
  palette: 'restricted palette of warm ochre, desaturated olive, muted grey, and bone-white',
  tone: 'warm, restrained, dignified — a document of a person, not a hero portrait',
  gameStyle: '2D hand-painted side-scrolling survival game art style, flat perspective with subtle parallax depth',
} as const;

// ── CHARACTER: KWAME MENSAH ──────────────────────────────────
export const KWAME_PROMPTS: PromptStage[] = [
  // ── STAGE 1: CONCEPT PORTRAIT ──────────────────────────────
  {
    stage: 1,
    name: 'Concept Portrait',
    description: 'Head-and-shoulders dossier portrait. Establishes facial identity, age, skin tone, expression, and colour palette.',
    outputFilename: 'ch-kwame-portrait.png',
    aspectRatio: '1024x1024',
    prompt: `**Cinematic bust portrait, matte-painting style with visible painterly brushwork and subtle film grain. A head-and-shoulders dossier character reference portrait of a 62-year-old Ghanaian man — a retired military colonel. This is the definitive facial identity reference for the character. All subsequent full-body and reference-sheet stages must preserve this face exactly.**

    **Subject:**
    Male, age 62, West African Ghanaian. Dark brown skin with realistic age variation, subtle weathering, and natural tonal depth across the forehead, cheeks, and jawline. Close-cropped grey natural hair, cut tight to the scalp, slightly thinner at the temples. Short, neatly maintained grey beard — trimmed but not precise, with slight unevenness along the edges that suggests self-grooming rather than a barber's hand. The beard density is moderate, thicker along the jaw and thinner on the upper lip and cheeks.

    Deep-set dark brown eyes beneath heavy, slightly drooping lids. Fine crow's feet radiating from the outer corners. Eyebrows are thick but greyed, slightly unruly, not groomed. A strong but aging face: wide cheekbones, broad nose with a slightly rounded tip, firm jawline softened naturally by age. Visible nasolabial folds. Skin texture is realistic — pores, subtle blemishes, age spots on the temples and forehead. No flawless skin.

    His expression is **controlled, neutral, and watchful** — neither angry nor sad, neither heroic nor intimidating. He has the quiet presence of a man accustomed to observing before speaking. His gaze is direct but slightly off-camera, as if looking at something across a room. No smile, no exaggerated emotion. A man who has learned to give nothing away.

    One ear has a small old scar along the upper cartilage — not disfiguring, just a mark someone would notice up close.

    **Physical build (bust portrait — visible portions):**
    Thick neck, broad shoulders visible from mid-chest up. His neck shows age — slight thickening, natural skin folds. The traps and shoulder line suggest a man who once carried weight regularly but has softened with retirement. Collarbones partially visible beneath the open collar.

    His hands are not visible in this frame, but the wrists and forearms are: large wrists, visible veins on the backs of the hands if they enter frame, slightly enlarged knuckles. A worn dark leather watch strap on his left wrist, the watch face small, scratched, understated.

    **Clothing:**
    A faded olive-drab military field shirt with the unmistakable utilitarian cut of an older military field uniform, but with **all insignia, medals, badges, rank markings, patches, flags, names, and logos removed**. Collar open naturally, revealing a plain bone-white cotton undershirt beneath. Sleeves rolled exactly once to approximately mid-forearm. Fabric is old, softened and slightly faded from years of washing, with realistic wrinkles, seam wear, subtle discoloration, and areas of abrasion along the collar and shoulder seams.

    No other accessories beyond the watch.

    **Historical consistency:**
    The character should feel authentically grounded in **1960s Ghana / West Africa**, with clothing, materials, grooming, and accessories avoiding modern tactical or contemporary fashion cues. Nothing should look newly manufactured, futuristic, fashionable, or overly militarized.

    **Rendering style:**
    Cinematic matte-painting character concept art with visible but controlled painterly brushwork, realistic anatomical structure, subtle film grain, and carefully observed material textures. Semi-realistic painterly realism rather than glossy photorealism. Skin should retain pores, wrinkles, subtle tonal variation, and believable age. Clothing should have tactile cotton and worn-fabric texture. Leather should show scuffs, creases, and age.

    Painterly detail is concentrated around the **face, beard, eyes, ears, neck, collar, and watch strap**, while less important edges — shoulders, background transition — gradually become softer. Maintain enough realism and clarity that the image functions as a professional facial-identity reference.

    **Lighting:**
    Single large soft warm key light from the upper-left. Warm late-afternoon ochre-gold illumination across the left side of the face and forehead. The right side falls into gentle cool desaturated shadow while retaining full facial detail — no feature should be lost to darkness. A very subtle rim light barely catches the edge of his right shoulder and the grey of his beard.

    Lighting should be restrained and documentary-like. No dramatic spotlight, no cinematic explosion of light, no colored neon lighting, no exaggerated rim lighting.

    **Background:**
    Completely flat, neutral dossier-style background: muted warm grey-ochre / aged-paper tone with extremely subtle paper grain and painterly texture. No environment, furniture, architecture, scenery, props, weapons, vehicles, or contextual elements.

    The background should remain visually quiet so the facial silhouette is immediately readable.

    **Composition and camera:**
    Professional bust portrait presentation. Frame from **mid-chest upward**. Character centered horizontally. Face positioned in the upper-third of the frame. Camera positioned at approximately eye level with a natural 85–100mm portrait-lens perspective, avoiding wide-angle distortion. No fisheye effect, no exaggerated foreshortening, no extreme low angle, no extreme high angle.

    Painterly detail concentrated on the face; edges and clothing fall progressively softer toward the frame edges. The portrait should feel like a page torn from a military dossier — intimate, direct, unadorned.

    Keep the camera stable and observational. The character should read immediately as a specific, real person.

    **Identity priorities:**

    1. Exact facial structure: wide cheekbones, broad nose, firm jaw softened by age.
    2. Correct age — 62, not 45, not 75. Every line and fold should be consistent.
    3. Ghanaian features — West African bone structure, dark brown skin with natural variation.
    4. Controlled, watchful expression — the defining emotional note.
    5. Scar on upper ear cartilage — visible but not prominent.
    6. Military shirt with all insignia removed — the cut says military, the emptiness says retired.
    7. Worn leather watch on left wrist.
    8. Painterly realism and subtle film grain throughout.

    **Color palette:**
    Strictly restrained: warm dark-brown skin with natural tonal variation, desaturated olive shirt, muted warm-grey/ochre background, bone-white undershirt, dark brown leather watch strap, small neutral metallic details on the watch. No bright saturated colors.

    **Overall feeling:**
    Quiet, restrained, dignified, weathered, observational. He should feel like a real man documented for a character archive — **not a superhero, not an action hero, not a generic soldier, and not a fashion portrait.** This is a dossier image: clinical in purpose, human in execution.

    **Negative constraints:**
    No text, no captions, no character name, no labels, no watermark, no border, no frame, no insignia, no medals, no weapons, no modern tactical equipment, no sunglasses, no hat, no jewelry beyond the watch, no extra characters, no props, no background environment, no duplicated limbs, no extra fingers, malformed hands, distorted anatomy, floating limbs, exaggerated muscles, youthful appearance, cartoon proportions, glossy skin, plastic-looking clothing, exaggerated expression, heroic pose, dramatic perspective, wide-angle distortion, oversaturated colors.

    **Output:**
    One clean, finished **bust portrait character reference image**, suitable for use as the definitive facial identity reference for the character. This image will serve as the anchor for all subsequent full-body and reference-sheet generations.`,
  },

  // ── STAGE 2: FULL-BODY CONCEPT ─────────────────────────────
  {
    stage: 2,
    name: 'Full-Body Concept',
    description: 'Full-body standing pose in the same matte-painting concept style. Establishes proportions, clothing silhouette, and body language.',
    inputRequires: 'Stage 1 output as visual reference (upload as image in DALL-E 3)',
    outputFilename: 'ch-kwame-fullbody-concept.png',
    aspectRatio: '1024x1792',
    prompt: `**Full-body character reference sheet of the EXACT SAME MAN shown in the attached portrait. Preserve his facial identity, age, ethnicity, skin tone, hairstyle, beard shape, facial proportions, and overall physical character precisely. Do not redesign or reinterpret the character. This is a direct full-body extension of the existing portrait, not a new character.**
    
    **Subject:**
    A 62-year-old Ghanaian man, West African, retired military colonel. Dark brown skin with realistic age variation and subtle weathering. Close-cropped grey natural hair, matching the attached portrait exactly. Short, neatly maintained grey beard with the same density and shape as the portrait. Deep-set dark brown eyes beneath heavy lids, wide cheekbones, broad nose, strong aging jaw softened naturally by age, visible crow's feet and fine facial lines. Preserve the same distinctive facial proportions and recognizable identity from the reference image.
    
    His expression is **controlled, neutral, and watchful** — neither angry nor sad, neither heroic nor intimidating. He has the quiet presence of a man accustomed to observing before speaking. His gaze is directed slightly toward the left, consistent with a three-quarter standing pose. No smile, no exaggerated emotion.
    
    **Physical build:**
    Medium-to-tall older Ghanaian male with a solid, naturally developed frame shaped by decades of military service rather than bodybuilding. Thick neck, broad shoulders, substantial forearms, large hands, visible veins on the backs of the hands, slightly enlarged knuckles. His body shows age naturally: mild abdominal softness, subtle loss of muscle definition, slightly rounded shoulders, realistic skin folds and creases. Do not make him muscular, athletic, youthful, or frail. He should convincingly look 62.
    
    **Pose and body language:**
    Full-body standing character reference, shown at a relaxed **three-quarter angle facing screen-left**, approximately 30–40 degrees away from camera. Head remains naturally aligned with the torso. Both arms hang comfortably at his sides with relaxed hands and clearly visible fingers. Weight rests slightly more naturally on his right leg, with the opposite leg relaxed. Feet positioned naturally rather than in a military stance.
    
    His posture carries the remnants of military discipline without becoming a formal pose: spine upright, shoulders naturally squared but slightly rounded forward from age, chin level, body relaxed. He looks like a man **waiting and observing**, not posing for a photograph and not performing an action.
    
    Avoid heroic stance, crossed arms, hands behind back, clenched fists, exaggerated contrapposto, dramatic leaning, walking pose, saluting, or action stance.
    
    **Clothing:**
    A faded olive-drab military field shirt with the unmistakable utilitarian cut of an older military field uniform, but with **all insignia, medals, badges, rank markings, patches, flags, names, and logos removed**. Collar open naturally. Sleeves rolled exactly once to approximately mid-forearm. Fabric is old, softened and slightly faded from years of washing, with realistic wrinkles, seam wear, subtle discoloration, and areas of abrasion.
    
    A plain bone-white cotton undershirt is visible beneath the open collar.
    
    Dark desaturated olive cargo trousers, straight-cut and slightly loose, practical rather than tactical-modern. Natural fabric folds around the knees, hips, and ankles. Worn brown leather belt with a simple utilitarian buckle.
    
    Dark brown leather military-style boots, heavily worn and scuffed from years of use. Old leather with creasing around the ankles and toes. Laces have been crudely replaced with dark paracord, visibly imperfect but functional. Boots should look historically appropriate and practical, not modern tactical footwear.
    
    On his **left wrist**, a worn dark leather watch strap with a small, scratched, understated analog watch. No other accessories.
    
    **Historical consistency:**
    The character should feel authentically grounded in **1960s Ghana / West Africa**, with clothing, materials, grooming, footwear, and accessories avoiding modern tactical or contemporary fashion cues. Nothing should look newly manufactured, futuristic, fashionable, or overly militarized.
    
    **Rendering style:**
    Cinematic matte-painting character concept art with visible but controlled painterly brushwork, realistic anatomical structure, subtle film grain, and carefully observed material textures. Semi-realistic painterly realism rather than glossy photorealism. Skin should retain pores, wrinkles, subtle tonal variation, and believable age. Clothing should have tactile cotton and worn-fabric texture. Leather should show scuffs, creases, and age.
    
    Painterly detail is concentrated around the **face, hands, boots, shirt seams, belt, and fabric folds**, while less important edges gradually become softer. Maintain enough realism and clarity that the image functions as a professional character-design reference.
    
    **Lighting:**
    Single large soft warm key light from the upper-left, matching the lighting language of the existing Kwame portrait. Warm late-afternoon ochre-gold illumination across the face and front-left side of the body. The opposite side falls into gentle cool desaturated shadow while retaining full anatomical detail. A very subtle rim light separates the right shoulder, beard, trousers, and boots from the background.
    
    Lighting should be restrained and documentary-like. No dramatic spotlight, no cinematic explosion of light, no colored neon lighting, no exaggerated rim lighting.
    
    **Background:**
    Completely flat, neutral dossier-style background matching the existing portrait: muted warm grey-ochre / aged-paper tone with extremely subtle paper grain and painterly texture. No environment, furniture, architecture, scenery, props, weapons, vehicles, or contextual elements.
    
    The background should remain visually quiet so the character silhouette is immediately readable.
    
    **Composition and camera:**
    Professional full-body character reference presentation. Entire character visible **from the top of his head to the soles of both boots**, with no cropping of hair, hands, elbows, knees, or feet. Leave a small amount of clean breathing room above the head and below the boots.
    
    Character centered horizontally with the body occupying approximately 70–80% of the frame height. Camera positioned approximately at chest-to-waist height with a natural 50–70mm portrait-lens perspective, avoiding wide-angle distortion. No fisheye effect, no exaggerated foreshortening, no extreme low angle, no extreme high angle.
    
    Keep the camera stable and observational. The character should read immediately as a complete, coherent silhouette.
    
    **Identity and anatomy priorities:**
    
    1. Exact facial identity and continuity with the attached portrait.
    2. Correct age and Ghanaian features.
    3. Natural full-body anatomy and realistic proportions.
    4. Consistent clothing design and color palette.
    5. Clear hands, fingers, feet, and boots.
    6. Accurate three-quarter standing pose.
    7. Consistent warm dossier lighting and background.
    8. Painterly realism and subtle film grain.
    
    **Color palette:**
    Strictly restrained: warm dark-brown skin, desaturated military olive shirt and trousers, muted warm-grey/ochre background, bone-white undershirt, dark brown leather belt and boots, small neutral metallic details on the watch. No bright saturated colors.
    
    **Overall feeling:**
    Quiet, restrained, dignified, weathered, observational. He should feel like a real man documented for a character archive — **not a superhero, not an action hero, not a generic soldier, and not a fashion portrait.**
    
    **Negative constraints:**
    No text, no captions, no character name, no labels, no watermark, no border, no frame, no insignia, no medals, no weapons, no modern tactical equipment, no sunglasses, no hat, no jewelry, no extra characters, no props, no background environment, no duplicated limbs, no extra fingers, malformed hands, malformed feet, distorted anatomy, floating limbs, exaggerated muscles, youthful appearance, cartoon proportions, glossy skin, plastic-looking clothing, exaggerated expression, heroic pose, action pose, dramatic perspective, wide-angle distortion, oversaturated colors.
    
    **Output:**
    One clean, finished **16:9 full-body character reference image**, visually consistent with the attached portrait and suitable for use as the definitive full-body model sheet for the character.
`,
  },

  // ── STAGE 3: STYLE TRANSFER — GAME ART STYLE ───────────────
  {
    stage: 3,
    name: 'Style Transfer — Game Art',
    description: 'Full-body in the actual 2D side-scrolling game art style. This is the target style for in-game sprites and promotional art.',
    inputRequires: 'Stage 2 output as visual reference (upload as image in DALL-E 3)',
    outputFilename: 'ch-kwame-fullbody-styled.png',
    aspectRatio: '1024x1792',
    prompt: `**2D hand-painted side-scrolling survival game character art, flat perspective with subtle parallax depth. Full-body character sprite reference of the EXACT SAME MAN shown in the attached full-body concept. Preserve his facial identity, age, ethnicity, skin tone, hairstyle, beard shape, facial proportions, clothing design, and overall physical character precisely. This is a style transfer — the character remains identical, only the rendering approach changes to match the game's actual art direction.**

    **Subject:**
    A 62-year-old Ghanaian man, West African, retired military colonel. Dark brown skin. Close-cropped grey natural hair, matching the attached reference exactly. Short, neatly maintained grey beard with the same density and shape as the reference. Deep-set dark brown eyes beneath heavy lids, wide cheekbones, broad nose, strong aging jaw softened naturally by age, visible crow's feet and fine facial lines. Preserve the same distinctive facial proportions and recognizable identity from the reference image.

    His expression is **controlled, neutral, and watchful** — neither angry nor sad, neither heroic nor intimidating. The same quiet presence as the concept portrait. His gaze is directed slightly toward the left, consistent with a three-quarter standing pose. No smile, no exaggerated emotion.

    **Physical build:**
    Medium-to-tall older Ghanaian male with a solid, naturally developed frame shaped by decades of military service rather than bodybuilding. Thick neck, broad shoulders, substantial forearms, large hands. His body shows age naturally: mild abdominal softness, subtle loss of muscle definition, slightly rounded shoulders. Do not make him muscular, athletic, youthful, or frail. He should convincingly look 62. proportions must remain consistent with the attached full-body concept.

    **Pose and body language:**
    Full-body standing character reference, shown at a relaxed **three-quarter angle facing screen-left**, approximately 30–40 degrees away from camera. Same pose as the attached concept reference. Head remains naturally aligned with the torso. Both arms hang comfortably at his sides with relaxed hands. Weight rests slightly more naturally on his right leg, with the opposite leg relaxed. Feet positioned naturally rather than in a military stance.

    His posture carries the remnants of military discipline without becoming a formal pose: spine upright, shoulders naturally squared but slightly rounded forward from age, chin level, body relaxed. He looks like a man **waiting and observing**, not posing for a photograph.

    **Clothing:**
    Identical to the attached concept reference. A faded olive-drab military field shirt with **all insignia, medals, badges, rank markings, patches, flags, names, and logos removed**. Collar open naturally. Sleeves rolled exactly once to approximately mid-forearm. Fabric is old, softened and faded from years of washing.

    A plain bone-white cotton undershirt visible beneath the open collar.

    Dark desaturated olive cargo trousers, straight-cut and slightly loose. Natural fabric folds around the knees, hips, and ankles. Worn brown leather belt with a simple utilitarian buckle.

    Dark brown leather military-style boots, heavily worn and scuffed. Laces replaced with dark paracord. Boots should look historically appropriate and practical.

    On his **left wrist**, a worn dark leather watch strap with a small, scratched, understated analog watch. No other accessories.

    **Art style — 2D game direction:**
    Hand-painted digital illustration in the style of a **2D side-scrolling survival game**. The rendering should feel like a painted concept piece designed for in-game use — not photorealistic, not cel-shaded, not anime-influenced. Think hand-painted textures with visible but controlled brushwork, like illustrations from This War of Mine, Limbo, or Dead Light, but with the warm, earthy tonal palette of Ghana.

    The character should have a **clean, readable silhouette** that works at multiple sizes — from full-screen promotional art down to small in-game sprite scale. Outlines should be implied through colour contrast and value changes, not through hard black line art. Forms are defined by paint, not by ink.

    Flat, even lighting with no strong directional shadows — designed for **sprite readability** across all game lighting conditions. The character must look correct when placed against any background in the game (night, dusk, interior, exterior) without relying on environmental lighting to define form.

    Painterly detail is concentrated on the **face, hands, boots, shirt folds, belt, and watch**, while less important areas use broader, softer brushwork. The overall rendering should feel crafted but not overworked.

    **Lighting:**
    Soft, neutral, even illumination across the entire character. A gentle warm key light from the upper-left provides subtle form definition without creating harsh shadows. Fill light from the opposite side ensures no area falls into complete darkness. The goal is maximum clarity and readability, not dramatic atmosphere.

    No dramatic spotlight, no cinematic color grading, no neon lighting, no exaggerated rim lighting, no environmental light spill. The lighting is functional — it reveals the character, not a mood.

    **Background:**
    Completely flat, neutral background: muted warm grey with extremely subtle texture, like aged paper or a clean studio backdrop. No environment, furniture, architecture, scenery, props, weapons, vehicles, or contextual elements.

    The background should remain visually quiet so the character silhouette is immediately readable and the image can be easily cropped or composited for game use.

    **Composition and camera:**
    Professional full-body character reference presentation. Entire character visible **from the top of his head to the soles of both boots**, with no cropping of hair, hands, elbows, knees, or feet. Leave a small amount of clean breathing room above the head and below the boots.

    Character centered horizontally with the body occupying approximately 70–80% of the frame height. Camera positioned approximately at chest-to-waist height with a natural perspective, avoiding wide-angle distortion. No fisheye effect, no exaggerated foreshortening, no extreme low angle, no extreme high angle.

    Keep the camera stable and observational. The character should read immediately as a complete, coherent silhouette suitable for game-asset extraction.

    **Identity and design priorities:**

    1. Exact facial identity and continuity with the attached concept reference.
    2. Correct age and Ghanaian features — consistent with the established portrait.
    3. 2D hand-painted game art style — not photorealistic, not cel-shaded.
    4. Clean, readable silhouette that works at multiple scales.
    5. Flat, even lighting for sprite readability across game environments.
    6. Consistent clothing design and color palette with the concept reference.
    7. Clear hands, fingers, feet, and boots.
    8. Painterly texture with visible but controlled brushwork.

    **Color palette:**
    Strictly restrained and consistent with the concept reference: warm dark-brown skin, desaturated military olive shirt and trousers, muted warm-grey background, bone-white undershirt, dark brown leather belt and boots, small neutral metallic details on the watch. No bright saturated colors. The palette should feel like the game's world — earthy, warm, restrained.

    **Overall feeling:**
    Grounded, painted, functional. The character should feel like a game asset designed with care — **not a cinematic render, not a concept art showcase, not a promotional illustration.** This is the definitive full-body model that will be referenced for in-game sprites, promotional material, and all subsequent pose generation.

    **Negative constraints:**
    No text, no captions, no character name, no labels, no watermark, no border, no frame, no insignia, no medals, no weapons, no modern tactical equipment, no sunglasses, no hat, no jewelry beyond the watch, no extra characters, no props, no background environment, no duplicated limbs, no extra fingers, malformed hands, malformed feet, distorted anatomy, floating limbs, exaggerated muscles, youthful appearance, cartoon proportions, glossy skin, plastic-looking clothing, exaggerated expression, heroic pose, action pose, dramatic perspective, wide-angle distortion, oversaturated colors, cel-shading, hard black outlines, anime style, photorealism, 3D render appearance.

    **Output:**
    One clean, finished **full-body character reference image in 2D hand-painted game art style**, visually consistent with the attached concept reference and suitable for use as the definitive styled model for in-game sprites and promotional material.`,
  },

  // ── STAGE 4: REFERENCE SHEET ───────────────────────────────
  {
    stage: 4,
    name: 'Reference Sheet — Multi-Pose',
    description: 'Character reference sheet showing multiple poses and angles in one image. Used for animation reference and model consistency.',
    inputRequires: 'Stage 3 output as visual reference (upload as image in DALL-E 3)',
    outputFilename: 'ch-kwame-refsheet.png',
    aspectRatio: '1792x1024',
    prompt: `**Character reference sheet, 2D hand-painted survival game art style. A single landscape-format image containing multiple poses, angles, and views of the EXACT SAME MAN shown in the attached styled full-body reference. Preserve his facial identity, age, ethnicity, skin tone, hairstyle, beard shape, facial proportions, clothing design, and overall physical character precisely across every pose. This is the definitive animation and model-consistency reference — every pose must be immediately recognizable as the same person.**

    **Subject (consistent across all poses):**
    A 62-year-old Ghanaian man, West African, retired military colonel. Dark brown skin. Close-cropped grey natural hair, matching the attached reference exactly. Short, neatly maintained grey beard with the same density and shape. Deep-set dark brown eyes beneath heavy lids, wide cheekbones, broad nose, strong aging jaw softened naturally by age, visible crow's feet and fine facial lines. Preserve the same distinctive facial proportions and recognizable identity in every pose on the sheet.

    Expression across all standing poses is **controlled, neutral, and watchful** — neither angry nor sad. The same quiet presence. No exaggerated emotion in any pose.

    **Physical build (consistent across all poses):**
    Medium-to-tall older Ghanaian male with a solid, naturally developed frame shaped by decades of military service. Thick neck, broad shoulders, substantial forearms, large hands. His body shows age naturally: mild abdominal softness, subtle loss of muscle definition, slightly rounded shoulders. Do not make him muscular, athletic, youthful, or frail. He should convincingly look 62 in every pose.

    **Clothing (consistent across all poses):**
    Identical to the attached styled reference. A faded olive-drab military field shirt with **all insignia, medals, badges, rank markings, patches, flags, names, and logos removed**. Collar open naturally. Sleeves rolled exactly once to approximately mid-forearm. Fabric is old, softened and faded.

    A plain bone-white cotton undershirt visible beneath the open collar.

    Dark desaturated olive cargo trousers, straight-cut and slightly loose. Worn brown leather belt with a simple utilitarian buckle.

    Dark brown leather military-style boots, heavily worn and scuffed. Laces replaced with dark paracord.

    On his **left wrist**, a worn dark leather watch strap with a small, scratched, understated analog watch. No other accessories.

    **Required poses and views:**

    Each pose is labelled with small, light pencil-style text beneath or beside it. Labels use a thin, understated sans-serif or handwriting font in low-opacity grey — functional, not decorative.

    1. **FRONT VIEW** — Neutral standing, arms relaxed at sides, weight evenly distributed on both feet. Face forward, expression neutral. Arms slightly away from the body to show silhouette clearly. Feet shoulder-width apart. This is the base reference pose — maximum clarity for clothing detail, proportions, and colour blocking.

    2. **THREE-QUARTER FRONT** — Same standing pose, body rotated approximately 30–40 degrees to the left. Shows the depth of the torso, the side of the shirt, trouser pocket detail, and boot profile. Head follows the body turn. Arms relaxed. This is the primary game-sprite angle.

    3. **SIDE PROFILE** — Standing, facing directly right. Full profile view. Shows the silhouette edge, posture curvature, shoulder-to-hip ratio, boot sole profile, and the watch on the left wrist. Arms at sides. Weight even.

    4. **BACK VIEW** — Standing, facing directly away from camera. Shows the back of the shirt (seam detail, fabric wear across the shoulder blades), trouser back pockets, boot heels, and the back of the head/beard. Arms relaxed at sides.

    5. **ACTION POSE — MID-STRIDE** — Walking, weight shifted forward onto the leading left foot. Right arm swinging naturally forward. Left arm back. Head up, alert, gaze forward. Not running — a deliberate, purposeful walk. The posture of a man moving through territory he's assessing as he goes.

    6. **CLOSE-UP HEAD** — Bust portrait, front-facing, neutral expression. Same face as the concept portrait but rendered in the 2D game art style. Used for dialogue scenes, UI portraits, and facial-detail reference. Frame from collarbones up.

    **Art style — 2D game direction (consistent across all poses):**
    Hand-painted digital illustration in the style of a **2D side-scrolling survival game**. The rendering should feel like a painted reference designed for animation use — not photorealistic, not cel-shaded, not anime-influenced. Hand-painted textures with visible but controlled brushwork.

    Each pose must have a **clean, readable silhouette** that works at multiple sizes. Outlines implied through colour contrast and value changes, not hard black line art. Forms defined by paint, not ink.

    All poses use the **same flat, even lighting** — no strong directional shadows, designed for maximum clarity. The character must look correct in any game environment.

    Painterly detail is concentrated on the **face, hands, boots, shirt folds, belt, and watch** across all poses. Broader, softer brushwork on less important areas.

    **Lighting:**
    Soft, neutral, even illumination across every pose. A gentle warm key light from the upper-left provides subtle form definition without creating harsh shadows. Fill light from the opposite side ensures no area falls into complete darkness. Every pose must use identical lighting — the sheet is a reference document, not a mood piece.

    No dramatic spotlight, no cinematic color grading, no neon lighting, no exaggerated rim lighting.

    **Background:**
    Completely flat, neutral background across the entire sheet: muted warm grey with extremely subtle texture, like aged paper or a clean studio backdrop. No environment, furniture, architecture, scenery, props, weapons, vehicles, or contextual elements.

    The background should remain visually quiet so every pose silhouette is immediately readable.

    **Layout and composition:**
    Landscape-format reference sheet. All six poses arranged in an **organized grid** with even spacing between them. Poses should be sized consistently — no single pose dramatically larger than the others, though the close-up head can be slightly larger for facial detail.

    Suggested layout: two rows of three poses each, or a three-column arrangement with front / three-quarter / side on the top row and back / action / head close-up on the bottom row.

    Each pose is labelled with small pencil-style text. Labels use the format: POSE NAME in caps, low-opacity grey, positioned beneath or beside each pose.

    No decorative borders, no ornamental frames, no title card, no character name overlay on the sheet itself. The sheet is a functional reference document.

    Character centered within each pose cell with breathing room above and below. Entire character visible from head to boots in every standing pose. The close-up head is framed from collarbones up.

    **Identity and consistency priorities:**

    1. Every pose must be immediately recognizable as the same person.
    2. Exact facial identity across all poses — consistent with the attached concept reference.
    3. Correct age and Ghanaian features in every angle.
    4. Consistent clothing design, color palette, and wear patterns across all poses.
    5. Clean, readable silhouettes in every pose.
    6. Consistent lighting across all poses — uniform reference document.
    7. Clear hands, fingers, feet, and boots in every pose.
    8. Action pose maintains character — purposeful walk, not heroic action.

    **Color palette:**
    Strictly restrained and consistent with the attached styled reference: warm dark-brown skin, desaturated military olive shirt and trousers, muted warm-grey background, bone-white undershirt, dark brown leather belt and boots, small neutral metallic details on the watch. No bright saturated colors. Every pose uses the identical palette.

    **Overall feeling:**
    Functional, consistent, professional. The sheet should feel like a working reference document pulled from a game studio's character pipeline — **not a showcase illustration, not a promotional poster, not an art print.** This is the definitive model reference that animators and artists will use to maintain consistency across all game assets.

    **Negative constraints:**
    No text beyond pose labels, no character name title, no captions, no watermark, no border, no decorative frame, no insignia, no medals, no weapons, no modern tactical equipment, no sunglasses, no hat, no jewelry beyond the watch, no extra characters, no props, no background environment, no duplicated limbs, no extra fingers, malformed hands, malformed feet, distorted anatomy, floating limbs, exaggerated muscles, youthful appearance, cartoon proportions, glossy skin, plastic-looking clothing, exaggerated expression, heroic pose, dramatic perspective, wide-angle distortion, oversaturated colors, cel-shading, hard black outlines, anime style, photorealism, 3D render appearance, inconsistent proportions between poses, different lighting between poses.

    **Output:**
    One clean, finished **landscape-format character reference sheet** containing all six poses in 2D hand-painted game art style, visually consistent with the attached styled reference and suitable for use as the definitive animation and model-consistency reference for the character.`,
  },

  // ── STAGE 5: WALK ANIMATION SPRITE SHEET ────────────────────
  {
    stage: 5,
    name: 'Walk Animation — Sprite Sheet',
    description: 'Horizontal sprite sheet showing 8 key frames of a walk cycle. Used as animation reference and for direct sprite extraction.',
    inputRequires: 'Stage 4 reference sheet as visual reference (upload as image in DALL-E 3)',
    outputFilename: 'ch-kwame-walk-sheet.png',
    aspectRatio: '1792x1024',
    prompt: `**Walk-cycle sprite sheet, 2D hand-painted survival game art style. A single landscape-format image containing 8 sequential key frames of a walking animation for the EXACT SAME MAN shown in the attached reference sheet. Preserve his facial identity, age, ethnicity, skin tone, hairstyle, beard shape, body proportions, clothing design, and overall physical character precisely across every frame. This is a frame-by-frame animation reference — every frame must be immediately recognizable as the same person in continuous motion.**

    **Subject (consistent across all frames):**
    A 62-year-old Ghanaian man, West African, retired military colonel. Dark brown skin. Close-cropped grey natural hair, matching the attached reference exactly. Short, neatly maintained grey beard. Deep-set dark brown eyes beneath heavy lids, wide cheekbones, broad nose, strong aging jaw softened naturally by age. Preserve the same distinctive facial proportions and recognizable identity in every frame.

    His expression across all frames is **controlled and neutral** — the face of a man walking through territory he is assessing. No fear, no urgency, no heroism. A steady, purposeful forward movement.

    **Physical build (consistent across all frames):**
    Medium-to-tall older Ghanaian male with a solid, naturally developed frame shaped by decades of military service. Thick neck, broad shoulders, substantial forearms, large hands. His body shows age naturally: mild abdominal softness, subtle loss of muscle definition, slightly rounded shoulders. He should convincingly look 62 in motion — his walk is steady but carries the weight of age. Not frail, not athletic. A deliberate, grounded gait.

    **Walk cycle description:**
    A natural, purposeful walk at a moderate steady pace — the walk of a man moving through urban terrain with awareness. Not a stroll, not a hurry. Military bearing shows in the upright spine and level chin, but the gait itself is civilian — relaxed arms, natural stride length, weight transferring smoothly from heel to toe.

    The walk should feel **grounded and weighted** — each footfall has consequence. His age should be visible in the slightly reduced stride length, the careful placement of each step, the subtle stiffness in the hips. He moves like a man who knows his body's limits and respects them.

    **8 key frames (left to right):**

    Frame 1 — **CONTACT (Right):** Right foot forward, heel striking the ground, toes up. Left foot behind, toe on the ground, about to lift. Arms in natural counter-swing: left arm forward, right arm back. Body at neutral height.

    Frame 2 — **DOWN (Right):** Right foot flat on the ground, bearing full weight. Body at its lowest point in the cycle — slight knee bend in the right leg. Left foot lifting off the ground behind. Arms at their widest swing point.

    Frame 3 — **PASSING (Right):** Right foot planted, body rising. Left foot passing the right knee, moving forward. Arms crossing the body — both roughly at the sides. Body at mid-height, transitioning upward.

    Frame 4 — **HIGH POINT:** Left foot forward, at its highest point before contact. Right foot on its toe, pushing off. Body at its highest point — full extension through the spine. Left arm swinging forward, right arm back.

    Frame 5 — **CONTACT (Left):** Left foot forward, heel striking the ground, toes up. Right foot behind, toe on the ground. Arms in natural counter-swing: right arm forward, left arm back. Mirror of Frame 1.

    Frame 6 — **DOWN (Left):** Left foot flat, bearing full weight. Body at lowest point — slight knee bend in the left leg. Right foot lifting behind. Arms at widest swing. Mirror of Frame 2.

    Frame 7 — **PASSING (Left):** Left foot planted, body rising. Right foot passing the left knee, moving forward. Arms crossing the body. Mirror of Frame 3.

    Frame 8 — **HIGH POINT (Return):** Right foot forward, at its highest point before contact. Left foot on its toe, pushing off. Body at full extension. Right arm forward, left arm back. Ready to loop back to Frame 1.

    **Art style — 2D game direction (consistent across all frames):**
    Hand-painted digital illustration in the style of a **2D side-scrolling survival game**. Each frame is a complete, self-contained painting of the character at that exact moment in the walk cycle. Not wireframe, not line art, not silhouette — fully rendered with the same painted texture and brushwork as the reference sheet.

    Each frame must have a **clean, readable silhouette** that works at game-sprite scale. Outlines implied through colour contrast and value changes, not hard black line art. Forms defined by paint, not ink.

    All frames use the **same flat, even lighting** — no strong directional shadows, designed for maximum clarity and sprite extraction. The character must look correct when any single frame is extracted and placed in the game.

    Painterly detail is concentrated on the **face, hands, boots, shirt folds, belt, and watch** across all frames. Broader, softer brushwork on less important areas.

    **Lighting:**
    Soft, neutral, even illumination across every frame. A gentle warm key light from the upper-left provides subtle form definition without creating harsh shadows. Fill light from the opposite side ensures no area falls into complete darkness. Every frame must use identical lighting — the sheet is an animation reference, not a mood piece.

    No dramatic spotlight, no cinematic color grading, no neon lighting, no exaggerated rim lighting.

    **Background:**
    Completely flat, neutral background across the entire sheet: muted warm grey with extremely subtle texture, like aged paper or a clean studio backdrop. No environment, furniture, architecture, scenery, props, weapons, vehicles, or contextual elements.

    The background should remain visually quiet so every frame silhouette is immediately readable and frames can be easily extracted for sprite use.

    **Layout and composition:**
    Landscape-format sprite sheet. All 8 frames arranged in a **single horizontal row**, evenly spaced, reading left to right in chronological order. Each frame contains the full character from head to boots.

    Frames are numbered 1–8 with small, light pencil-style text beneath each frame. Labels use a thin, understated sans-serif or handwriting font in low-opacity grey — functional, not decorative.

    Each frame is vertically centred with consistent height. Characters are sized identically across all frames — no scaling, no perspective shift between frames. The sheet should feel like a film strip extracted from a single camera angle.

    No decorative borders, no ornamental frames, no title card, no character name overlay on the sheet itself. The sheet is a functional animation reference document.

    **Animation consistency priorities:**

    1. Every frame must be immediately recognizable as the same person.
    2. Smooth, natural weight transfer from frame to frame — no popping or jumping.
    3. Consistent stride length and arm swing amplitude across all frames.
    4. Visible age in the walk — slightly reduced stride, careful foot placement, subtle hip stiffness.
    5. Military bearing visible in the upright spine and level chin, but the gait is civilian.
    6. Arms swing in natural counter-rhythm to the legs — left arm forward when right leg forward.
    7. Head stays level and stable throughout the cycle — eyes forward, scanning.
    8. Clothing deforms naturally with movement — shirt folds shift, trouser fabric pulls at the knee, boot flex is visible.

    **Color palette:**
    Strictly restrained and consistent with the attached reference: warm dark-brown skin, desaturated military olive shirt and trousers, muted warm-grey background, bone-white undershirt, dark brown leather belt and boots, small neutral metallic details on the watch. No bright saturated colors. Every frame uses the identical palette.

    **Gait character notes:**
    This is not a generic walk cycle. The walk should communicate: a 62-year-old retired military officer who is fit enough to keep moving but whose body reminds him of his age with every step. His right side may be very slightly stiffer than his left — a suggestion of old injury or habit. His arms don't swing wildly — they move with controlled economy. His boots hit the ground flat and deliberate, not轻浮 or bouncy. He walks like a man who has walked a long way and expects to walk further.

    **Overall feeling:**
    Functional, consistent, sequential. The sheet should feel like a working animation reference pulled from a game studio's pipeline — **not a showcase illustration, not an action sequence, not a motion study art piece.** This is the definitive walk-cycle reference that animators will use to maintain consistency across all in-game walking animation.

    **Negative constraints:**
    No text beyond frame numbers, no character name title, no captions, no watermark, no border, no decorative frame, no insignia, no medals, no weapons, no modern tactical equipment, no sunglasses, no hat, no jewelry beyond the watch, no extra characters, no props, no background environment, no duplicated limbs, no extra fingers, malformed hands, malformed feet, distorted anatomy, floating limbs, exaggerated muscles, youthful appearance, cartoon proportions, glossy skin, plastic-looking clothing, exaggerated expression, heroic pose, dramatic perspective, wide-angle distortion, oversaturated colors, cel-shading, hard black outlines, anime style, photorealism, 3D render appearance, inconsistent proportions between frames, different lighting between frames, motion blur, speed lines, ghosting effects, transparency between frames.

    **Output:**
    One clean, finished **landscape-format walk-cycle sprite sheet** containing all 8 key frames in 2D hand-painted game art style, visually consistent with the attached reference sheet and suitable for use as the definitive walk-cycle animation reference and for direct sprite extraction.`,
  },

  // ── STAGE 6: RUN ANIMATION SPRITE SHEET ─────────────────────
  {
    stage: 6,
    name: 'Run Animation — Sprite Sheet',
    description: 'Horizontal sprite sheet showing 8 key frames of a run cycle. Used as animation reference and for direct sprite extraction.',
    inputRequires: 'Stage 4 reference sheet as visual reference (upload as image in DALL-E 3)',
    outputFilename: 'ch-kwame-run-sheet.png',
    aspectRatio: '1792x1024',
    prompt: `**Run-cycle sprite sheet, 2D hand-painted survival game art style. A single landscape-format image containing 8 sequential key frames of a running animation for the EXACT SAME MAN shown in the attached reference sheet. Preserve his facial identity, age, ethnicity, skin tone, hairstyle, beard shape, body proportions, clothing design, and overall physical character precisely across every frame. This is a frame-by-frame animation reference — every frame must be immediately recognizable as the same person in continuous urgent motion.**

    **Subject (consistent across all frames):**
    A 62-year-old Ghanaian man, West African, retired military colonel. Dark brown skin. Close-cropped grey natural hair, matching the attached reference exactly. Short, neatly maintained grey beard. Deep-set dark brown eyes beneath heavy lids, wide cheekbones, broad nose, strong aging jaw softened naturally by age. Preserve the same distinctive facial proportions and recognizable identity in every frame.

    His expression across all frames is **focused, controlled, and alert** — the face of a man running because the situation demands it, not because he enjoys it. Jaw set, eyes forward, breathing controlled. No panic, no fear — disciplined urgency. This is a man who knows how to move under pressure, even if his body protests.

    **Physical build (consistent across all frames):**
    Medium-to-tall older Ghanaian male with a solid, naturally developed frame shaped by decades of military service. Thick neck, broad shoulders, substantial forearms, large hands. His body shows age naturally but is currently pushed harder than in the walk cycle. The run should show controlled exertion — heavier breathing implied through posture, more pronounced arm drive, longer stride. He should convincingly look 62 running — powerful for his age but visibly working for it.

    **Run cycle description:**
    A purposeful, ground-covering run — not a sprint, not a jog. The run of a man who needs to get somewhere fast and is using his training to do it efficiently. Military mechanics are visible: upright torso, arms driving at controlled angles, feet landing midfoot rather than heel-striking. But age shows in the slightly shorter stride compared to a younger runner, the heavier arm swing needed for momentum, the visible effort in maintaining pace.

    The run should feel **urgent but controlled** — he is not fleeing in panic, he is moving with purpose. His body leans slightly forward from the ankles, not the waist. His center of gravity is ahead of his feet. He runs like a man who has run in combat zones and knows how to conserve energy while maintaining speed.

    **8 key frames (left to right):**

    Frame 1 — **CONTACT (Right):** Right foot forward, midfoot striking the ground beneath the center of mass. Left foot extended far behind, toe about to leave the ground. Body leaning slightly forward. Arms in strong counter-swing: left arm forward (bent at approximately 90 degrees), right arm driving back. Right knee slightly bent on impact. This is the moment of maximum ground contact.

    Frame 2 — **FLIGHT (Rear):** Left foot has left the ground, trailing behind. Right foot pushing off, transitioning to toe-off. Body at mid-height, moving forward. Arms at their widest separation — left arm at its most forward point, right arm at its most rearward. The body is between foot contacts — a brief moment where both feet are off the ground (the "float" phase of a run).

    Frame 3 — **PASSING (Right):** Right foot planted, body rising and moving forward. Left knee driving forward and upward, passing the right knee. Arms crossing — both roughly at the sides. Body at mid-height, transitioning upward. This is the moment of maximum compression in the supporting leg.

    Frame 4 — **FLIGHT (Front):** Left foot forward, at its highest point before contact. Right foot has left the ground entirely — both feet airborne (the "flight" phase). Body at its highest point, fully extended. Left arm driving forward, right arm driving back. The moment of maximum extension and air time.

    Frame 5 — **CONTACT (Left):** Left foot forward, midfoot striking the ground. Right foot extended far behind. Mirror of Frame 1. Arms in counter-swing: right arm forward, left arm driving back. The cycle's midpoint.

    Frame 6 — **FLIGHT (Rear — Mirror):** Right foot trailing behind, lifting off. Left foot pushing off to toe-off. Arms at widest separation — right arm forward, left arm back. Mirror of Frame 2.

    Frame 7 — **PASSING (Left):** Left foot planted, body rising. Right knee driving forward, passing the left knee. Arms crossing. Mirror of Frame 3.

    Frame 8 — **FLIGHT (Front — Mirror):** Right foot forward, at highest point. Left foot airborne. Both feet off the ground. Left arm forward, right arm back. Full extension. Ready to loop back to Frame 1.

    **Art style — 2D game direction (consistent across all frames):**
    Hand-painted digital illustration in the style of a **2D side-scrolling survival game**. Each frame is a complete, self-contained painting of the character at that exact moment in the run cycle. Not wireframe, not line art, not silhouette — fully rendered with the same painted texture and brushwork as the reference sheet.

    Each frame must have a **clean, readable silhouette** that works at game-sprite scale. The run silhouette is more dynamic than the walk — larger limb separations, more dramatic angles, clearer sense of forward momentum. Outlines implied through colour contrast and value changes, not hard black line art.

    All frames use the **same flat, even lighting** — no strong directional shadows, designed for maximum clarity and sprite extraction. The character must look correct when any single frame is extracted and placed in the game.

    Painterly detail is concentrated on the **face, hands, boots, shirt folds, belt, and watch** across all frames. The shirt should show more dynamic fabric movement than the walk cycle —tails lifting slightly, folds deepening with the stride. Broader, softer brushwork on less important areas.

    **Lighting:**
    Soft, neutral, even illumination across every frame. A gentle warm key light from the upper-left provides subtle form definition without creating harsh shadows. Fill light from the opposite side ensures no area falls into complete darkness. Every frame must use identical lighting — the sheet is an animation reference, not a mood piece.

    No dramatic spotlight, no cinematic color grading, no neon lighting, no exaggerated rim lighting.

    **Background:**
    Completely flat, neutral background across the entire sheet: muted warm grey with extremely subtle texture, like aged paper or a clean studio backdrop. No environment, furniture, architecture, scenery, props, weapons, vehicles, or contextual elements.

    The background should remain visually quiet so every frame silhouette is immediately readable and frames can be easily extracted for sprite use.

    **Layout and composition:**
    Landscape-format sprite sheet. All 8 frames arranged in a **single horizontal row**, evenly spaced, reading left to right in chronological order. Each frame contains the full character from head to boots.

    Frames are numbered 1–8 with small, light pencil-style text beneath each frame. Labels use a thin, understated sans-serif or handwriting font in low-opacity grey — functional, not decorative.

    Each frame is vertically centred with consistent height. Characters are sized identically across all frames — no scaling, no perspective shift between frames. The sheet should feel like a film strip extracted from a single camera angle.

    No decorative borders, no ornamental frames, no title card, no character name overlay on the sheet itself. The sheet is a functional animation reference document.

    **Animation consistency priorities:**

    1. Every frame must be immediately recognizable as the same person.
    2. Smooth, powerful weight transfer from frame to frame — the run has more momentum than the walk.
    3. Consistent stride length, arm drive amplitude, and knee lift across all frames.
    4. Visible age in the run — heavier effort, controlled but not effortless, slightly shorter stride than a young athlete.
    5. Military running mechanics — upright torso, controlled arm angles, midfoot strike, efficient form.
    6. Arms drive in strong counter-rhythm to the legs — left arm forward when right leg forward, bent at approximately 90 degrees.
    7. Head stays level and stable throughout the cycle — eyes forward, jaw set, focused.
    8. Clothing reacts dynamically — shirt tails lift with stride, trouser fabric pulls at knees and hips, boot flex is pronounced, watch strap catches light differently with arm angle.
    9. Clear flight phases — both feet off the ground at Frames 4 and 8, distinguishing this from the walk cycle.
    10. Forward lean from the ankles — not from the waist — communicates urgency without破坏 posture.

    **Color palette:**
    Strictly restrained and consistent with the attached reference: warm dark-brown skin, desaturated military olive shirt and trousers, muted warm-grey background, bone-white undershirt, dark brown leather belt and boots, small neutral metallic details on the watch. No bright saturated colors. Every frame uses the identical palette.

    **Gait character notes:**
    This is not a generic run cycle. The run should communicate: a 62-year-old retired military officer who can still move when he needs to, but whose body makes him pay for it. His right arm drive may be slightly less fluid than his left — a suggestion of old shoulder wear. His breathing would be heavier than a younger runner's, implied through the slightly hunched shoulders in the flight phases. His boots hit the ground with authority — he's not trying to be quiet, he's trying to get somewhere. He runs like a man who ran in ECOMOG, who ran in Monrovia, and who hasn't forgotten how even if his knees haven't forgiven him.

    **Overall feeling:**
    Functional, consistent, sequential. The sheet should feel like a working animation reference pulled from a game studio's pipeline — **not a showcase illustration, not an action sequence, not a motion study art piece.** This is the definitive run-cycle reference that animators will use to maintain consistency across all in-game running animation.

    **Negative constraints:**
    No text beyond frame numbers, no character name title, no captions, no watermark, no border, no decorative frame, no insignia, no medals, no weapons, no modern tactical equipment, no sunglasses, no hat, no jewelry beyond the watch, no extra characters, no props, no background environment, no duplicated limbs, no extra fingers, malformed hands, malformed feet, distorted anatomy, floating limbs, exaggerated muscles, youthful appearance, cartoon proportions, glossy skin, plastic-looking clothing, exaggerated expression, heroic action pose, dramatic perspective, wide-angle distortion, oversaturated colors, cel-shading, hard black outlines, anime style, photorealism, 3D render appearance, inconsistent proportions between frames, different lighting between frames, motion blur, speed lines, ghosting effects, transparency between frames, dust clouds, impact effects, ground debris.

    **Output:**
    One clean, finished **landscape-format run-cycle sprite sheet** containing all 8 key frames in 2D hand-painted game art style, visually consistent with the attached reference sheet and suitable for use as the definitive run-cycle animation reference and for direct sprite extraction.`,
  },
];

// ── CHARACTER: AMA MENSAH ────────────────────────────────────
export const AMA_PROMPTS: PromptStage[] = [
  {
    stage: 1,
    name: 'Concept Portrait',
    description: 'Head-and-shoulders dossier portrait. Establishes facial identity, age, skin tone, expression, and colour palette.',
    outputFilename: 'ch-ama-portrait.png',
    aspectRatio: '1024x1024',
    prompt: `[ STAGE 1 — PENDING: Paste Ama's concept portrait prompt here ]`,
  },
  {
    stage: 2,
    name: 'Full-Body Concept',
    description: 'Full-body standing pose in the same matte-painting concept style.',
    inputRequires: 'Stage 1 output as visual reference',
    outputFilename: 'ch-ama-fullbody-concept.png',
    aspectRatio: '1024x1792',
    prompt: `[ STAGE 2 — PENDING: Derive from Stage 1 + Kwame Stage 2 template ]`,
  },
  {
    stage: 3,
    name: 'Style Transfer — Game Art',
    description: 'Full-body in the actual 2D side-scrolling game art style.',
    inputRequires: 'Stage 2 output as visual reference',
    outputFilename: 'ch-ama-fullbody-styled.png',
    aspectRatio: '1024x1792',
    prompt: `[ STAGE 3 — PENDING: Derive from Stage 2 + Kwame Stage 3 template ]`,
  },
  {
    stage: 4,
    name: 'Reference Sheet — Multi-Pose',
    description: 'Character reference sheet with multiple poses and angles.',
    inputRequires: 'Stage 3 output as visual reference',
    outputFilename: 'ch-ama-refsheet.png',
    aspectRatio: '1792x1024',
    prompt: `[ STAGE 4 — PENDING: Derive from Stage 3 + Kwame Stage 4 template ]`,
  },
];

// ── CHARACTER: KOFI MENSAH ───────────────────────────────────
export const KOFI_PROMPTS: PromptStage[] = [
  {
    stage: 1,
    name: 'Concept Portrait',
    description: 'Head-and-shoulders dossier portrait.',
    outputFilename: 'ch-kofi-portrait.png',
    aspectRatio: '1024x1024',
    prompt: `[ STAGE 1 — PENDING: Paste Kofi's concept portrait prompt here ]`,
  },
  {
    stage: 2,
    name: 'Full-Body Concept',
    description: 'Full-body standing pose in the matte-painting concept style.',
    inputRequires: 'Stage 1 output as visual reference',
    outputFilename: 'ch-kofi-fullbody-concept.png',
    aspectRatio: '1024x1792',
    prompt: `[ STAGE 2 — PENDING ]`,
  },
  {
    stage: 3,
    name: 'Style Transfer — Game Art',
    description: 'Full-body in the 2D game art style.',
    inputRequires: 'Stage 2 output as visual reference',
    outputFilename: 'ch-kofi-fullbody-styled.png',
    aspectRatio: '1024x1792',
    prompt: `[ STAGE 3 — PENDING ]`,
  },
  {
    stage: 4,
    name: 'Reference Sheet — Multi-Pose',
    description: 'Character reference sheet with multiple poses and angles.',
    inputRequires: 'Stage 3 output as visual reference',
    outputFilename: 'ch-kofi-refsheet.png',
    aspectRatio: '1792x1024',
    prompt: `[ STAGE 4 — PENDING ]`,
  },
];

// ── CHARACTER: COL. YAW OPOKU ───────────────────────────────
export const OPOKU_PROMPTS: PromptStage[] = [
  {
    stage: 1,
    name: 'Concept Portrait',
    description: 'Head-and-shoulders dossier portrait. Mirror framing against Kwame.',
    outputFilename: 'ch-opoku-portrait.png',
    aspectRatio: '1024x1024',
    prompt: `[ STAGE 1 — PENDING: Paste Opoku's concept portrait prompt here ]`,
  },
  {
    stage: 2,
    name: 'Full-Body Concept',
    description: 'Full-body standing pose. Mirror framing against Kwame.',
    inputRequires: 'Stage 1 output as visual reference',
    outputFilename: 'ch-opoku-fullbody-concept.png',
    aspectRatio: '1024x1792',
    prompt: `[ STAGE 2 — PENDING ]`,
  },
  {
    stage: 3,
    name: 'Style Transfer — Game Art',
    description: 'Full-body in the 2D game art style.',
    inputRequires: 'Stage 2 output as visual reference',
    outputFilename: 'ch-opoku-fullbody-styled.png',
    aspectRatio: '1024x1792',
    prompt: `[ STAGE 3 — PENDING ]`,
  },
  {
    stage: 4,
    name: 'Reference Sheet — Multi-Pose',
    description: 'Character reference sheet with multiple poses and angles.',
    inputRequires: 'Stage 3 output as visual reference',
    outputFilename: 'ch-opoku-refsheet.png',
    aspectRatio: '1792x1024',
    prompt: `[ STAGE 4 — PENDING ]`,
  },
];

// ── CHARACTER: NURSE AKOSUA AMOAH ───────────────────────────
export const AMOAH_PROMPTS: PromptStage[] = [
  {
    stage: 1,
    name: 'Concept Portrait',
    description: 'Head-and-shoulders dossier portrait.',
    outputFilename: 'ch-amoah-portrait.png',
    aspectRatio: '1024x1024',
    prompt: `[ STAGE 1 — PENDING: Paste Amoah's concept portrait prompt here ]`,
  },
  {
    stage: 2,
    name: 'Full-Body Concept',
    description: 'Full-body standing pose.',
    inputRequires: 'Stage 1 output as visual reference',
    outputFilename: 'ch-amoah-fullbody-concept.png',
    aspectRatio: '1024x1792',
    prompt: `[ STAGE 2 — PENDING ]`,
  },
  {
    stage: 3,
    name: 'Style Transfer — Game Art',
    description: 'Full-body in the 2D game art style.',
    inputRequires: 'Stage 2 output as visual reference',
    outputFilename: 'ch-amoah-fullbody-styled.png',
    aspectRatio: '1024x1792',
    prompt: `[ STAGE 3 — PENDING ]`,
  },
  {
    stage: 4,
    name: 'Reference Sheet — Multi-Pose',
    description: 'Character reference sheet with multiple poses and angles.',
    inputRequires: 'Stage 3 output as visual reference',
    outputFilename: 'ch-amoah-refsheet.png',
    aspectRatio: '1792x1024',
    prompt: `[ STAGE 4 — PENDING ]`,
  },
];

// ── ALL CHARACTERS ───────────────────────────────────────────
export const ALL_PROMPTS = {
  kwame:  KWAME_PROMPTS,
  ama:    AMA_PROMPTS,
  kofi:   KOFI_PROMPTS,
  opoku:  OPOKU_PROMPTS,
  amoah:  AMOAH_PROMPTS,
} as const;
