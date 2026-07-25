import type { CountryDetail } from "@/features/countries/model/country.schemas"

const portugueseGeographicAreas: Readonly<Record<string, string>> = {
  Africa: "África",
  Antarctica: "Antártida",
  Asia: "Ásia",
  Europe: "Europa",
  "North America": "América do Norte",
  "South America": "América do Sul",
  Oceania: "Oceania",
  "Australia and New Zealand": "Austrália e Nova Zelândia",
  Caribbean: "Caribe",
  "Central America": "América Central",
  "Central Asia": "Ásia Central",
  "Central Europe": "Europa Central",
  "Eastern Africa": "África Oriental",
  "Eastern Asia": "Ásia Oriental",
  "Eastern Europe": "Europa Oriental",
  Melanesia: "Melanésia",
  Micronesia: "Micronésia",
  "Middle Africa": "África Central",
  "Northern Africa": "África Setentrional",
  "Northern Europe": "Europa Setentrional",
  Polynesia: "Polinésia",
  "Southeast Europe": "Sudeste Europeu",
  "South-Eastern Asia": "Sudeste Asiático",
  "Southern Africa": "África Austral",
  "Southern Asia": "Ásia Meridional",
  "Southern Europe": "Europa Meridional",
  "Western Africa": "África Ocidental",
  "Western Asia": "Ásia Ocidental",
  "Western Europe": "Europa Ocidental",
}

const portugueseDependencyTypes: Readonly<Record<string, string>> = {
  associated_state: "Estado associado",
  autonomous_region: "Região autônoma",
  constituent_country: "País constituinte",
  crown_dependency: "Dependência da Coroa",
  dependent_territory: "Território dependente",
  disputed: "Território disputado",
  external_territory: "Território externo",
  international_territory: "Território internacional",
  overseas_collectivity: "Coletividade ultramarina",
  overseas_department: "Departamento ultramarino",
  overseas_territory: "Território ultramarino",
  special_administrative_region: "Região administrativa especial",
  special_municipality: "Município especial",
  unincorporated_territory: "Território não incorporado",
}

const portugueseIsoStatuses: Readonly<Record<string, string>> = {
  official: "Oficial",
  unassigned: "Não atribuído",
  user_assigned: "Atribuído pelo usuário",
}

const portugueseGovernmentTypes: Readonly<Record<string, string>> = {
  "Communist state": "Estado comunista",
  "Constitutional monarchy": "Monarquia constitucional",
  "Dependency under a constitutional monarchy":
    "Dependência sob uma monarquia constitucional",
  "Dependency under constitutional monarchy":
    "Dependência sob uma monarquia constitucional",
  "Devolved executive-led government within a unitary communist state":
    "Governo descentralizado liderado pelo Executivo em um Estado comunista unitário",
  "Devolved executive-led government within a unitary state":
    "Governo descentralizado liderado pelo Executivo em um Estado unitário",
  "Devolved governments within a parliamentary constitutional monarchy":
    "Governos descentralizados em uma monarquia constitucional parlamentarista",
  "Devolved parliamentary autonomous region":
    "Região autônoma parlamentar descentralizada",
  "Devolved parliamentary dependency":
    "Dependência parlamentar descentralizada",
  "Devolved parliamentary dependency under a constitutional monarchy":
    "Dependência parlamentar descentralizada sob uma monarquia constitucional",
  "Devolved parliamentary government within a unitary constitutional monarchy":
    "Governo parlamentar descentralizado em uma monarquia constitucional unitária",
  "Devolved parliamentary local authority within French Republic":
    "Autoridade local parlamentar descentralizada na República Francesa",
  "Devolved parliamentary representative democracy within a constitutional monarchy":
    "Democracia representativa parlamentar descentralizada em uma monarquia constitucional",
  "Devolved presidential constitutional dependency":
    "Dependência constitucional presidencial descentralizada",
  "Devolved presidential dependency within a federal republic":
    "Dependência presidencial descentralizada em uma república federal",
  "Directly administered dependency": "Dependência administrada diretamente",
  "Directly administered dependency under a constitutional monarchy":
    "Dependência administrada diretamente sob uma monarquia constitucional",
  "Federal assembly-independent directorial republic":
    "República diretorial federal independente da assembleia",
  "Federal assembly-independent presidential republic under a non-partisan democracy":
    "República presidencial federal independente da assembleia sob uma democracia apartidária",
  "Federal constitutional monarchy": "Monarquia constitucional federal",
  "Federal parliamentary constitutional elective monarchy":
    "Monarquia eletiva constitucional parlamentarista federal",
  "Federal parliamentary constitutional monarchy":
    "Monarquia constitucional parlamentarista federal",
  "Federal parliamentary directorial republic":
    "República diretorial parlamentarista federal",
  "Federal parliamentary Islamic republic":
    "República islâmica parlamentarista federal",
  "Federal parliamentary republic": "República parlamentarista federal",
  "Federal parliamentary republic under a Provisional Constitution":
    "República parlamentarista federal sob uma Constituição Provisória",
  "Federal parliamentary republic under an authoritarian government":
    "República parlamentarista federal sob um governo autoritário",
  "Federal parliamentary republic under confessionalism":
    "República parlamentarista federal sob confessionalismo",
  "Federal presidential republic": "República presidencialista federal",
  "Federal presidential republic under a Transitional Constitution":
    "República presidencialista federal sob uma Constituição de Transição",
  "Federal presidential republic under an authoritarian dictatorship":
    "República presidencialista federal sob uma ditadura autoritária",
  "Federal republic under a military junta":
    "República federal sob uma junta militar",
  "Federal semi-presidential elective semi-constitutional monarchy":
    "Monarquia eletiva semiconstitucional semipresidencialista federal",
  "Federal semi-presidential republic":
    "República semipresidencialista federal",
  "Federal semi-presidential republic under an authoritarian government":
    "República semipresidencialista federal sob um governo autoritário",
  "Parliamentary constitutional monarchy":
    "Monarquia constitucional parlamentarista",
  "Parliamentary dependency under a constitutional monarchy":
    "Dependência parlamentar sob uma monarquia constitucional",
  "Parliamentary representative democracy within a constitutional monarchy":
    "Democracia representativa parlamentar em uma monarquia constitucional",
  "Presidential republic": "República presidencialista",
  "Self-governing and dependent parliamentary constitutional monarchy":
    "Monarquia constitucional parlamentarista autônoma e dependente",
  "Self-governing dependency under a constitutional monarchy":
    "Dependência autônoma sob uma monarquia constitucional",
  "Self-governing parliamentary constitutional monarchy":
    "Monarquia constitucional parlamentarista autônoma",
  "Semi-constitutional monarchy": "Monarquia semiconstitucional",
  "Semi-presidential republic (de jure)":
    "República semipresidencialista (de jure)",
  "Unitary assembly-independent presidential republic":
    "República presidencialista unitária independente da assembleia",
  "Unitary assembly-independent republic":
    "República unitária independente da assembleia",
  "Unitary authoritarian semi-constitutional monarchy":
    "Monarquia semiconstitucional autoritária unitária",
  "Unitary communist state": "Estado comunista unitário",
  "Unitary constitutional monarchy": "Monarquia constitucional unitária",
  "Unitary constitutional monarchy under an authoritarian government":
    "Monarquia constitucional unitária sob um governo autoritário",
  "Unitary constitutional monarchy with elements of a direct democracy":
    "Monarquia constitucional unitária com elementos de democracia direta",
  "Unitary diarchic absolute monarchy": "Monarquia absoluta diárquica unitária",
  "Unitary diarchic presidential socialist republic under a totalitarian dictatorship":
    "República socialista presidencialista diárquica unitária sob uma ditadura totalitária",
  "Unitary dominant-party presidential republic":
    "República presidencialista unitária de partido dominante",
  "Unitary dominant-party presidential republic under an authoritarian dictatorship":
    "República presidencialista unitária de partido dominante sob uma ditadura autoritária",
  "Unitary dominant-party semi-presidential republic under an authoritarian government":
    "República semipresidencialista unitária de partido dominante sob um governo autoritário",
  "Unitary Islamic absolute monarchy": "Monarquia absoluta islâmica unitária",
  "Unitary non-partisan parliamentary constitutional monarchy":
    "Monarquia constitucional parlamentarista unitária apartidária",
  "Unitary one-party presidential republic under a totalitarian dictatorship":
    "República presidencialista unitária de partido único sob uma ditadura totalitária",
  "Unitary parliamentary constitutional elective monarchy under a hereditary dictatorship":
    "Monarquia eletiva constitucional parlamentarista unitária sob uma ditadura hereditária",
  "Unitary parliamentary constitutional monarchy":
    "Monarquia constitucional parlamentarista unitária",
  "Unitary parliamentary co-principality":
    "Coprincipado parlamentarista unitário",
  "Unitary parliamentary diarchic directorial republic":
    "República diretorial diárquica parlamentarista unitária",
  "Unitary parliamentary republic": "República parlamentarista unitária",
  "Unitary parliamentary republic under an authoritarian dictatorship":
    "República parlamentarista unitária sob uma ditadura autoritária",
  "Unitary parliamentary republic under confessionalism":
    "República parlamentarista unitária sob confessionalismo",
  "Unitary parliamentary republic with an executive presidency":
    "República parlamentarista unitária com presidência executiva",
  "Unitary parliamentary republic with an executive presidency under a non-partisan democracy":
    "República parlamentarista unitária com presidência executiva sob uma democracia apartidária",
  "Unitary parliamentary republic with an executive president":
    "República parlamentarista unitária com presidente executivo",
  "Unitary parliamentary semi-constitutional monarchy":
    "Monarquia semiconstitucional parlamentarista unitária",
  "Unitary presidential republic": "República presidencialista unitária",
  "Unitary presidential republic under a hereditary dictatorship":
    "República presidencialista unitária sob uma ditadura hereditária",
  "Unitary presidential republic under a military junta":
    "República presidencialista unitária sob uma junta militar",
  "Unitary presidential republic under a non-partisan democracy":
    "República presidencialista unitária sob uma democracia apartidária",
  "Unitary presidential republic under a provisional government":
    "República presidencialista unitária sob um governo provisório",
  "Unitary presidential republic under a totalitarian hereditary dictatorship":
    "República presidencialista unitária sob uma ditadura totalitária hereditária",
  "Unitary presidential republic under an authoritarian dictatorship":
    "República presidencialista unitária sob uma ditadura autoritária",
  "Unitary presidential republic under an authoritarian hereditary dictatorship":
    "República presidencialista unitária sob uma ditadura autoritária hereditária",
  "Unitary presidential theocratic Islamic republic under an authoritarian dictatorship":
    "República islâmica teocrática presidencialista unitária sob uma ditadura autoritária",
  "Unitary republic under a provisional government (GNU)":
    "República unitária sob um governo provisório (GNU)",
  "Unitary semi-presidential Islamic republic":
    "República islâmica semipresidencialista unitária",
  "Unitary semi-presidential republic":
    "República semipresidencialista unitária",
  "Unitary semi-presidential republic under a military junta":
    "República semipresidencialista unitária sob uma junta militar",
  "Unitary semi-presidential republic under a provisional government":
    "República semipresidencialista unitária sob um governo provisório",
  "Unitary semi-presidential republic under an authoritarian dictatorship":
    "República semipresidencialista unitária sob uma ditadura autoritária",
  "Unitary semi-presidential republic under an authoritarian government":
    "República semipresidencialista unitária sob um governo autoritário",
  "Unitary semi-presidential republic under an authoritarian hereditary dictatorship":
    "República semipresidencialista unitária sob uma ditadura autoritária hereditária",
  "Unitary theocratic elective absolute monarchy":
    "Monarquia absoluta eletiva teocrática unitária",
  "Unitary totalitarian theocratic Islamic emirate":
    "Emirado islâmico teocrático totalitário unitário",
}

function localizeControlledValue(
  value: string | undefined,
  locale: string,
  portugueseValues: Readonly<Record<string, string>>,
) {
  if (!value || locale === "en") {
    return value
  }

  return portugueseValues[value]
}

export function formatGeographicArea(value: string, locale: string) {
  return localizeControlledValue(value, locale, portugueseGeographicAreas)
}

export function formatGovernmentType(
  value: string | undefined,
  locale: string,
) {
  return localizeControlledValue(value, locale, portugueseGovernmentTypes)
}

export function formatDependencyType(
  value: string | undefined,
  locale: string,
) {
  return localizeControlledValue(value, locale, portugueseDependencyTypes)
}

export function formatIsoStatus(value: string | undefined, locale: string) {
  return localizeControlledValue(value, locale, portugueseIsoStatuses)
}

export function formatOfficialName(
  country: Pick<CountryDetail, "nativeNames" | "officialName">,
  locale: string,
) {
  if (locale === "en") {
    return country.officialName
  }

  const localOfficialName =
    country.nativeNames.find(
      (nativeName) => nativeName.languageCode.toLowerCase() !== "eng",
    ) ?? country.nativeNames[0]

  return localOfficialName?.officialName ?? country.officialName
}
