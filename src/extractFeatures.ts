import { validateBoolean } from "./util";

export function extractFeatures(features: Array<string>, data: any) {
  if (
    validateBoolean(
      data["product.features.requiredTransport.canFitInMotorbike"]
    )
  )
    features.push("can fit in motorbike");
  if (validateBoolean(data["product.features.requiredTransport.canFitInCar"]))
    features.push("can fit in car");
  if (validateBoolean(data["product.features.requiredTransport.canFitIn4WD"]))
    features.push("can fit in 4WD");
  if (validateBoolean(data["product.features.requiredTransport.canFitInTruck"]))
    features.push("can fit in truck");
  if (validateBoolean(data["product.features.setupDifficulty.setupEasy"]))
    features.push("setup easy");
  if (validateBoolean(data["product.features.setupDifficulty.setupMedium"]))
    features.push("setup medium");
  if (validateBoolean(data["product.features.setupDifficulty.setupDifficult"]))
    features.push("setup difficult");
  if (validateBoolean(data["product.features.audience.smallAudience"]))
    features.push("small audience");
  if (validateBoolean(data["product.features.audience.mediumAudience"]))
    features.push("medium audience");
  if (validateBoolean(data["product.features.audience.largeAudience"]))
    features.push("large audience");
  if (validateBoolean(data["product.features.audience.extraLargeAudience"]))
    features.push("extra large audience");
  if (validateBoolean(data["product.features.event.wedding"]))
    features.push("wedding");
  if (validateBoolean(data["product.features.event.childParty"]))
    features.push("child party");
  if (validateBoolean(data["product.features.event.adultParty"]))
    features.push("adult party");
  if (validateBoolean(data["product.features.event.seniorParty"]))
    features.push("senior party");
  if (validateBoolean(data["product.features.event.singingCompetition"]))
    features.push("singing competition");
  if (
    validateBoolean(
      data["product.features.productSpecification.chair.isStackable"]
    )
  )
    features.push("is stackable");
  if (
    validateBoolean(
      data["product.features.productSpecification.chair.isFoldable"]
    )
  )
    features.push("is foldable");
}
