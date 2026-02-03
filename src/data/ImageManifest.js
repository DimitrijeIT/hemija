/**
 * Maps element symbols and molecule IDs to real photograph paths.
 * Images are CC/public domain from Wikimedia Commons.
 */

const ELEMENT_IMAGES = {
  H:  'images/elements/hydrogen.jpg',
  O:  'images/elements/oxygen.jpg',
  C:  'images/elements/carbon.jpg',
  N:  'images/elements/nitrogen.jpg',
  Na: 'images/elements/sodium.jpg',
  Cl: 'images/elements/chlorine.jpg',
  K:  'images/elements/potassium.jpg',
  Ca: 'images/elements/calcium.jpg',
  S:  'images/elements/sulfur.jpg',
  P:  'images/elements/phosphorus.jpg',
  Mg: 'images/elements/magnesium.jpg',
  Fe: 'images/elements/iron.jpg'
};

const ELEMENT_HOUSEHOLD_IMAGES = {
  H:  'images/elements_household/hydrogen.jpg',
  O:  'images/elements_household/oxygen.jpg',
  C:  'images/elements_household/carbon.jpg',
  N:  'images/elements_household/nitrogen.jpg',
  Na: 'images/elements_household/sodium.jpg',
  Cl: 'images/elements_household/chlorine.jpg',
  K:  'images/elements_household/potassium.jpg',
  Ca: 'images/elements_household/calcium.jpg',
  S:  'images/elements_household/sulfur.jpg',
  P:  'images/elements_household/phosphorus.jpg',
  Mg: 'images/elements_household/magnesium.jpg',
  Fe: 'images/elements_household/iron.jpg'
};

const MOLECULE_IMAGES = {
  h2:    'images/molecules/hydrogen_gas.jpg',
  o2:    'images/molecules/oxygen_gas.jpg',
  h2o:   'images/molecules/water.jpg',
  co2:   'images/molecules/carbon_dioxide.jpg',
  n2:    'images/molecules/nitrogen_gas.jpg',
  nacl:  'images/molecules/salt.jpg',
  hcl:   'images/molecules/hydrochloric_acid.jpg',
  ch4:   'images/molecules/methane.jpg',
  nh3:   'images/molecules/ammonia.jpg',
  h2s:   'images/molecules/hydrogen_sulfide.jpg',
  cacl2: 'images/molecules/calcium_chloride.jpg',
  mgo:   'images/molecules/magnesium_oxide.jpg',
  kcl:   'images/molecules/potassium_chloride.jpg',
  fe2o3: 'images/molecules/rust.jpg',
  cao:   'images/molecules/calcium_oxide.jpg'
};

const EXPERIMENT_IMAGES = {
  na_water:              'images/experiments/sodium_water.jpg',
  fe_rust:               'images/experiments/iron_rusting.jpg',
  mg_fire:               'images/experiments/magnesium_burning.jpg',
  h2_o2_combustion:      'images/experiments/hydrogen_combustion.jpg',
  k_water:               'images/experiments/potassium_water.jpg',
  hcl_naoh:              'images/experiments/neutralization.jpg',
  ca_water:              'images/experiments/calcium_water.jpg',
  h2s_formation:         'images/experiments/hydrogen_sulfide_formation.jpg'
};

export function getElementImagePath(symbol) {
  return ELEMENT_IMAGES[symbol] || null;
}

export function getElementHouseholdImagePath(symbol) {
  return ELEMENT_HOUSEHOLD_IMAGES[symbol] || null;
}

export function getMoleculeImagePath(moleculeId) {
  return MOLECULE_IMAGES[moleculeId] || null;
}

export function getExperimentImagePath(experimentId) {
  return EXPERIMENT_IMAGES[experimentId] || null;
}

export function getAllImagePaths() {
  return [
    ...Object.values(ELEMENT_IMAGES),
    ...Object.values(ELEMENT_HOUSEHOLD_IMAGES),
    ...Object.values(MOLECULE_IMAGES),
    ...Object.values(EXPERIMENT_IMAGES)
  ];
}
