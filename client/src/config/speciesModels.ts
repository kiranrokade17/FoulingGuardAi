/**
 * 3D Model Configuration for Species Mapping
 * 
 * This file controls which GLB model is displayed for each species.
 * You can easily customize the mappings here.
 */

export interface SpeciesModelConfig {
  // Exact species name mapping
  exactMatches: { [speciesName: string]: string };
  
  // Aliases and common names
  aliases: { [alias: string]: string };
  
  // Partial matches (for fuzzy matching)
  partialMatches: { [keyword: string]: string };
  
  // Default model when no match is found
  defaultModel: string;
}

export const speciesModelConfig: SpeciesModelConfig = {
  // EXACT MATCHES - Species name must match exactly
  exactMatches: {
    'Amphibalanus Reticulatus': 'Amphibalanus Reticulatus.glb',
    'Balanus Amphitrite': 'Balanus Amphitrite.glb',
    'Bugula Neritina': 'Bugula Neritina.glb',
    'Cliona Celata': 'Cliona Celata.glb',
    'Enteromorpha Intestinalis': 'Enteromorpha Intestinalis.glb',
    'Hydroides Elegans': 'Hydroides Elegans.glb',
    'Perna Viridis': 'Perna Viridis.glb',
    'Sabella Spallanzanii': 'Sabella Spallanzanii.glb',
    'Saccostrea Cucullata': 'Saccostrea Cucullata.glb',
    'Ulva Lactuca': 'Ulva Lactuca.glb'
  },

  // ALIASES - Common names and variations
  aliases: {
    // Common names
    'Blue Mussel': 'Perna Viridis.glb',
    'Green Mussel': 'Perna Viridis.glb',
    'Asian Green Mussel': 'Perna Viridis.glb',
    'Barnacle': 'Balanus Amphitrite.glb',
    'Acorn Barnacle': 'Balanus Amphitrite.glb',
    'Boring Sponge': 'Cliona Celata.glb',
    'Yellow Boring Sponge': 'Cliona Celata.glb',
    'Sea Lettuce': 'Ulva Lactuca.glb',
    'Green Algae': 'Ulva Lactuca.glb',
    'Tube Worm': 'Hydroides Elegans.glb',
    'Serpulid Worm': 'Hydroides Elegans.glb',
    'Bryozoan': 'Bugula Neritina.glb',
    'Lace Bryozoan': 'Bugula Neritina.glb',
    'Oyster': 'Saccostrea Cucullata.glb',
    'Hooked Oyster': 'Saccostrea Cucullata.glb',
    'Fan Worm': 'Sabella Spallanzanii.glb',
    'European Fan Worm': 'Sabella Spallanzanii.glb',
    'Gut Weed': 'Enteromorpha Intestinalis.glb',
    'Hollow Green Weed': 'Enteromorpha Intestinalis.glb',

    // Scientific variations
    'Mytilus edulis': 'Perna Viridis.glb', // Blue mussel alternative
    'Unknown Species': 'Cliona Celata.glb', // Default for unknown
  },

  // PARTIAL MATCHES - Keywords that trigger specific models
  partialMatches: {
    'mytilus': 'Perna Viridis.glb',
    'mussel': 'Perna Viridis.glb',
    'balanus': 'Balanus Amphitrite.glb',
    'barnacle': 'Balanus Amphitrite.glb',
    'bugula': 'Bugula Neritina.glb',
    'bryozoan': 'Bugula Neritina.glb',
    'cliona': 'Cliona Celata.glb',
    'sponge': 'Cliona Celata.glb',
    'ulva': 'Ulva Lactuca.glb',
    'lettuce': 'Ulva Lactuca.glb',
    'algae': 'Ulva Lactuca.glb',
    'hydroides': 'Hydroides Elegans.glb',
    'worm': 'Hydroides Elegans.glb',
    'tube': 'Hydroides Elegans.glb',
    'perna': 'Perna Viridis.glb',
    'sabella': 'Sabella Spallanzanii.glb',
    'fan': 'Sabella Spallanzanii.glb',
    'saccostrea': 'Saccostrea Cucullata.glb',
    'oyster': 'Saccostrea Cucullata.glb',
    'enteromorpha': 'Enteromorpha Intestinalis.glb',
    'gut': 'Enteromorpha Intestinalis.glb',
    'amphibalanus': 'Amphibalanus Reticulatus.glb'
  },

  // DEFAULT MODEL - Used when no matches are found
  defaultModel: 'Cliona Celata.glb'
};

/**
 * Get the GLB model path for a given species
 * @param species - The species name to match
 * @returns The full path to the GLB model file
 */
export const getSpeciesModelPath = (species: string): string => {
  const cleanSpecies = species.trim();
  const config = speciesModelConfig;
  
  // 1. Try exact match
  if (config.exactMatches[cleanSpecies]) {
    console.log(`🎯 Exact match: ${cleanSpecies} → ${config.exactMatches[cleanSpecies]}`);
    return `/assets/3d species model/${config.exactMatches[cleanSpecies]}`;
  }
  
  // 2. Try aliases
  if (config.aliases[cleanSpecies]) {
    console.log(`🎯 Alias match: ${cleanSpecies} → ${config.aliases[cleanSpecies]}`);
    return `/assets/3d species model/${config.aliases[cleanSpecies]}`;
  }
  
  // 3. Try case-insensitive exact match
  const lowerSpecies = cleanSpecies.toLowerCase();
  for (const [key, value] of Object.entries(config.exactMatches)) {
    if (key.toLowerCase() === lowerSpecies) {
      console.log(`🎯 Case-insensitive exact: ${cleanSpecies} → ${value}`);
      return `/assets/3d species model/${value}`;
    }
  }
  
  // 4. Try case-insensitive aliases
  for (const [key, value] of Object.entries(config.aliases)) {
    if (key.toLowerCase() === lowerSpecies) {
      console.log(`🎯 Case-insensitive alias: ${cleanSpecies} → ${value}`);
      return `/assets/3d species model/${value}`;
    }
  }
  
  // 5. Try partial matches
  for (const [keyword, model] of Object.entries(config.partialMatches)) {
    if (lowerSpecies.includes(keyword.toLowerCase())) {
      console.log(`🎯 Partial match: ${cleanSpecies} contains "${keyword}" → ${model}`);
      return `/assets/3d species model/${model}`;
    }
  }
  
  // 6. Use default model
  console.log(`🎯 Using default model for: ${cleanSpecies} → ${config.defaultModel}`);
  return `/assets/3d species model/${config.defaultModel}`;
};

// Export available model files for validation
export const availableModels = [
  'Amphibalanus Reticulatus.glb',
  'Balanus Amphitrite.glb',
  'Bugula Neritina.glb',
  'Cliona Celata.glb',
  'Enteromorpha Intestinalis.glb',
  'Hydroides Elegans.glb',
  'Perna Viridis.glb',
  'Sabella Spallanzanii.glb',
  'Saccostrea Cucullata.glb',
  'Ulva Lactuca.glb'
];

/**
 * HOW TO CUSTOMIZE:
 * 
 * 1. To map a new species name to an existing model:
 *    Add it to 'exactMatches' or 'aliases'
 * 
 * 2. To add keyword-based matching:
 *    Add keywords to 'partialMatches'
 * 
 * 3. To change the default model:
 *    Update 'defaultModel' with any available GLB filename
 * 
 * 4. Examples:
 *    - Map "Sea Cucumber" to show the sponge model:
 *      aliases: { "Sea Cucumber": "Cliona Celata.glb" }
 * 
 *    - Make any species containing "coral" show the bryozoan:
 *      partialMatches: { "coral": "Bugula Neritina.glb" }
 */