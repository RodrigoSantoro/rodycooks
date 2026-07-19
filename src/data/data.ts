import { CatalogDish } from "@src/types/menu"

// One JSON file per dish under ./dishes (recipe file pattern). A "dish" is the
// single source of truth used both by the home page / recipe pages and by the
// Weekly Menu Builder.
import banana_oatmeal_cookies from "./dishes/banana-oatmeal-cookies.json"
import chia_seed_pudding from "./dishes/chia-seed-pudding.json"
import protein_pancakes from "./dishes/protein-pancakes.json"
import strawberry_frozen_yogurt from "./dishes/strawberry-frozen-yogurt.json"
import oatmeal_cups from "./dishes/oatmeal-cups.json"
import pour_over_coffee from "./dishes/pour-over-coffee.json"
import muesli_yogurt_bowl from "./dishes/muesli-yogurt-bowl.json"
import steel_cut_oats_berries from "./dishes/steel-cut-oats-berries.json"
import chicken_rice_pinto_bowl from "./dishes/chicken-rice-pinto-bowl.json"
import chicken_sweetpotato_salad from "./dishes/chicken-sweetpotato-salad.json"
import pb_protein_shake_banana from "./dishes/pb-protein-shake-banana.json"
import protein_yogurt_fruit from "./dishes/protein-yogurt-fruit.json"
import turkey_sausage_sweetpotato from "./dishes/turkey-sausage-sweetpotato.json"
import tofu_stirfry_brownrice from "./dishes/tofu-stirfry-brownrice.json"
import lemon_herb_chicken_quinoa from "./dishes/lemon-herb-chicken-quinoa.json"
import chana_masala_rice from "./dishes/chana-masala-rice.json"
import chicken_avocado_sandwich from "./dishes/chicken-avocado-sandwich.json"
import smashed_chickpea_sandwich from "./dishes/smashed-chickpea-sandwich.json"
import baked_tofu_banhmi from "./dishes/baked-tofu-banhmi.json"
import eggwhite_veggie_melt from "./dishes/eggwhite-veggie-melt.json"
import turkey_white_bean_chili from "./dishes/turkey-white-bean-chili.json"
import lentil_bolognese_pasta from "./dishes/lentil-bolognese-pasta.json"
import turkey_quinoa_stuffed_peppers from "./dishes/turkey-quinoa-stuffed-peppers.json"
import greek_chicken_bowl from "./dishes/greek-chicken-bowl.json"
import overnight_oats_chia_berries from "./dishes/overnight-oats-chia-berries.json"
import tofu_scramble_toast from "./dishes/tofu-scramble-toast.json"
import apple_cinnamon_protein_oatmeal from "./dishes/apple-cinnamon-protein-oatmeal.json"
import berry_spinach_protein_smoothie from "./dishes/berry-spinach-protein-smoothie.json"
import lentil_barley_soup_salad from "./dishes/lentil-barley-soup-salad.json"
import chickpea_quinoa_tabbouleh from "./dishes/chickpea-quinoa-tabbouleh.json"
import turkey_avocado_wrap from "./dishes/turkey-avocado-wrap.json"
import blackbean_sweetpotato_burrito_bowl from "./dishes/blackbean-sweetpotato-burrito-bowl.json"
import chicken_veg_quinoa_skillet from "./dishes/chicken-veg-quinoa-skillet.json"
import turkey_meatballs_pasta_marinara from "./dishes/turkey-meatballs-pasta-marinara.json"
import red_lentil_dal_rice from "./dishes/red-lentil-dal-rice.json"
import white_bean_kale_stew from "./dishes/white-bean-kale-stew.json"
import tofu_veg_curry_rice from "./dishes/tofu-veg-curry-rice.json"
import apple_almond_butter from "./dishes/apple-almond-butter.json"
import hummus_veggie_oatcakes from "./dishes/hummus-veggie-oatcakes.json"
import roasted_chickpeas from "./dishes/roasted-chickpeas.json"
import walnuts_pear from "./dishes/walnuts-pear.json"
import greek_yogurt_berries from "./dishes/greek-yogurt-berries.json"
import chia_pudding_berries from "./dishes/chia-pudding-berries.json"

/**
 * The full dish catalog — every dish is one JSON file under ./dishes. Used
 * everywhere: the home page grid, the per-dish recipe pages, and the Weekly
 * Menu Builder (which reads `slots`/`baseMacros` to plan and scale).
 *
 * Macros are per serving; ingredient amounts are for the whole `servings`
 * batch. Most dishes follow the cholesterol-friendly mealplan1 profile; the
 * six original recipes are included too.
 */
export const dishCatalog: CatalogDish[] = [
  banana_oatmeal_cookies,
  chia_seed_pudding,
  protein_pancakes,
  strawberry_frozen_yogurt,
  oatmeal_cups,
  pour_over_coffee,
  muesli_yogurt_bowl,
  steel_cut_oats_berries,
  chicken_rice_pinto_bowl,
  chicken_sweetpotato_salad,
  pb_protein_shake_banana,
  protein_yogurt_fruit,
  turkey_sausage_sweetpotato,
  tofu_stirfry_brownrice,
  lemon_herb_chicken_quinoa,
  chana_masala_rice,
  chicken_avocado_sandwich,
  smashed_chickpea_sandwich,
  baked_tofu_banhmi,
  eggwhite_veggie_melt,
  turkey_white_bean_chili,
  lentil_bolognese_pasta,
  turkey_quinoa_stuffed_peppers,
  greek_chicken_bowl,
  overnight_oats_chia_berries,
  tofu_scramble_toast,
  apple_cinnamon_protein_oatmeal,
  berry_spinach_protein_smoothie,
  lentil_barley_soup_salad,
  chickpea_quinoa_tabbouleh,
  turkey_avocado_wrap,
  blackbean_sweetpotato_burrito_bowl,
  chicken_veg_quinoa_skillet,
  turkey_meatballs_pasta_marinara,
  red_lentil_dal_rice,
  white_bean_kale_stew,
  tofu_veg_curry_rice,
  apple_almond_butter,
  hummus_veggie_oatcakes,
  roasted_chickpeas,
  walnuts_pear,
  greek_yogurt_berries,
  chia_pudding_berries,
] as unknown as CatalogDish[]

/** Alias kept for the recipe pages / home grid, which show the same dishes. */
export const data = dishCatalog
