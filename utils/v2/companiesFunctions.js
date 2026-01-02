require("dotenv").config()
const db = require("../../dbConnect")
const { google } = require("googleapis")
const sheets = google.sheets("v4")
const dbDataset = require("../../dbConnectDataset")
const sheetValues = {
  date: "",
  values: [],
  categories: [],
}

const companyValues = {
  date: "",
  values: [],
  categories: [],
}

async function authorize() {
  let authClient = await process.env.NEXT_PUBLIC_GOOGLE_KEY
  if (authClient == null) {
    throw Error("authentication failed")
  }
  return authClient
}

async function main_v2() {
  sheetValues.date = new Date()
  const authClient = await authorize()
  const request = await {
    spreadsheetId: process.env.NEXT_PUBLIC_SHEET_ID_2023,
    range: "Sheet1!A2:AX",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: authClient,
  }

  try {
    const response = (await sheets.spreadsheets.values.get(request)).data

    sheetValues.categories = []
    sheetValues.values = []
    const allData = response.values
    allData.forEach((company, index) => {
      const item = {}
      item.id = index
      item.name = company[0]
      item.cluster = company[4] || null
      item.category = company[3] || null
      item.subcategory = company[2] || null
      item.description = company[6] || null
      item.yearFounded = company[12] || null
      item.headquartersCountry = company[15] || null
      item.headquartersCity = company[16] || null
      item.womanInManagement = company[17] || null
      item.nonWhitePeopleInManagement = company[18] || null
      item.headcount = company[19] || null
      item.totalProducts = company[20] || null
      item.totalFunding = company[34] || null
      item.logo = company[49]
      sheetValues.values.push(item)
    })
    return sheetValues
  } catch (err) {
    console.error(err)
  }
}

async function main_v3() {
  sheetValues.date = new Date()

  try {
    const allCompaniesData =
      await db.query(`select entityname,cluster,broadcategory,
subcategory, description,yearfounded,
headquarterscountry,headquarterscity,womeninmanagement,
diversemanagement,headcount,totalproducts,totalfunding,
logo_do  from "apilandscape".apiprovidersmain`)
    const response = allCompaniesData.rows
    console.log("response:", response[0])
    sheetValues.categories = []
    sheetValues.values = []
    const allData = response
    /* Object.entries(allData).forEach(([key, value]) => { */
    allData.forEach((company, index) => {
      const item = {}
      item.id = index
      item.name = company?.entityname.trim() || null
      item.cluster = company?.cluster || null
      item.category = company?.broadcategory || null
      item.subcategory = company?.subcategory || null
      item.description = company?.description || null
      item.yearFounded = company?.yearfounded || null
      item.headquartersCountry = company?.headquarterscountry || null
      item.headquartersCity = company?.headquarterscity || null
      item.womanInManagement = company?.womeninmanagement || null
      item.nonWhitePeopleInManagement = company?.diversemanagement || null
      item.headcount = company?.headcount || null
      item.totalProducts = company?.totalproducts || null
      item.totalFunding = company?.totalfunding || null
      item.logo = company?.logo_do
      sheetValues.values.push(item)
    })
    return sheetValues
  } catch (err) {
    console.error(err)
  }
}

async function main_ai_v1() {
  companyValues.date = new Date()

  try {
    const allCompaniesData =
      await db.query(`select entityname,cluster,broadcategory,
subcategory, description,yearfounded,
headquarterscountry,headquarterscity,womeninmanagement,
diversemanagement,headcount,totalproducts,totalfunding,
logo_do  from "ailandscape".apiprovidersmain 
where cluster like '%App Creation Using LLMs%' 
or cluster like '%LLM Creation%'  or cluster like '%Intermediary Layer%' 
or  cluster like '%AI Governance And Accountability%' 
or  cluster  like '%Knowledge Transfer Ecosystem%'`)
    const response = allCompaniesData.rows
    console.log("response:", response[0])
    companyValues.categories = []
    companyValues.values = []
    const allData = response
    /* Object.entries(allData).forEach(([key, value]) => { */
    allData.forEach((company, index) => {
      const item = {}
      item.id = index
      item.name = company?.entityname.trim() || null
      item.cluster = company?.cluster || null
      item.category = company?.broadcategory || null
      item.subcategory = company?.subcategory || null
      item.description = company?.description || null
      item.yearFounded = company?.yearfounded || null
      item.headquartersCountry = company?.headquarterscountry || null
      item.headquartersCity = company?.headquarterscity || null
      item.womanInManagement = company?.womeninmanagement || null
      item.nonWhitePeopleInManagement = company?.diversemanagement || null
      item.headcount = company?.headcount || null
      item.totalProducts = company?.totalproducts || null
      item.totalFunding = company?.totalfunding || null
      item.logo = company?.logo_do
      companyValues.values.push(item)
    })
    return companyValues
  } catch (err) {
    console.error(err)
  }
}

async function main_ai_v2() {
  companyValues.date = new Date()

  try {
    const allCompaniesData = await dbDataset.query(`SELECT
    entities."EntityName" AS name,
    entities."EntityURL" AS url,
    STRING_AGG(DISTINCT taxonomy."Activity"::TEXT, ', ') AS "subcategory",
    STRING_AGG(DISTINCT category."Category"::TEXT, ', ') AS "category",
    STRING_AGG(DISTINCT clusters."Cluster"::TEXT, ', ') AS "cluster",
    entities."YearFounded" as yearfounded,
    entities."EntityDescription" as entitydescription,
    entities."HQLocation" as hqlocation,
    country."ISOCountryCode" as isocountrycode, 
    entities."Headcount" AS headcount,
    entities."Total_Products" AS totalproducts,
    entities."Total Funding" AS totalfunding,
    CASE 
        WHEN entities."EntityLogo" IS NULL THEN NULL
        WHEN entities."EntityLogo"::TEXT = '' THEN NULL
        WHEN entities."EntityLogo"::TEXT !~ '^\\s*[\\[\\{]' THEN entities."EntityLogo"::TEXT
        ELSE (
            CASE 
                WHEN entities."EntityLogo"::TEXT ~ '^\\s*\\[' THEN
                    COALESCE((entities."EntityLogo"::JSONB -> 0 ->> 'url'), NULL)
                ELSE 
                    COALESCE((entities."EntityLogo"::JSONB ->> 'url'), NULL)
            END
        )
    END AS logo,
    STRING_AGG(DISTINCT entities_policies."PolicyName"::TEXT, ', ') AS "policies",
    CASE 
        WHEN STRING_AGG(entities_policies."PolicyName"::TEXT, ', ') LIKE '%Diverse Management%' 
        THEN TRUE
        ELSE FALSE
    END AS "diversemanagement",
    CASE 
        WHEN STRING_AGG(entities_policies."PolicyName"::TEXT, ', ') LIKE '%Women in Management%' 
        THEN TRUE
        ELSE FALSE
    END AS "womeninmanagement"
FROM
    schemacoredataset."Entities" entities
JOIN
    schemacoredataset."nc_18z6___nc_m2m_8s3nsqy17h" entities_taxonomy_connector ON entities."IdEntity" = entities_taxonomy_connector.table1_id
LEFT JOIN schemacoredataset."nc_18z6___nc_m2m_msbiwg2n44" entities_policy_connector ON entities."IdEntity" = entities_policy_connector."table1_id"
LEFT JOIN schemacoredataset."EntityPolicies" entities_policies ON entities_policy_connector."table2_id" = entities_policies."id"
LEFT JOIN schemacoredataset."Country" country ON entities."IdContry" = country."IdCountry" 
JOIN
    schemacoredataset."Taxonomy" taxonomy ON taxonomy."IdTaxonomy" = entities_taxonomy_connector.table2_id
JOIN
    schemacoredataset."Category" category ON taxonomy."Category" = category."IdCategory"
JOIN 
    schemacoredataset."Clusters" clusters ON clusters.id = category."Clusters_id"    
WHERE
    entities."TypeEntity" = 'TT22' AND entities."DateClosure" IS null and clusters."Cluster" ILIKE ANY (ARRAY[
        '%App Creation Using LLMs%',
        '%LLM Creation%',
        '%Intermediary Layer%',
        '%AI Governance & Accountability%',
        '%Knowledge Transfer Ecosystem%'
    ])
GROUP BY
    entities."IdEntity", entities."EntityName", entities."EntityURL", 
    entities."YearFounded", entities."EntityDescription", entities."HQLocation", 
    entities."Headcount", entities."Total_Products", entities."Total Funding", 
    entities."EntityLogo", country."ISOCountryCode" 
ORDER BY
    entities."IdEntity";`)
    const response = allCompaniesData.rows

    return { values: response, message: "Success" }
  } catch (err) {
    console.error(err)
  }
}

async function getCompanies(sheet_id) {
  sheetValues.date = new Date()
  const authClient = await authorize()
  const request = await {
    spreadsheetId: sheet_id,
    range: "Sheet1!A2:AX",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: authClient,
  }

  try {
    const response = (await sheets.spreadsheets.values.get(request)).data

    companyValues.categories = []
    companyValues.values = []
    const allData = response.values
    allData.forEach((company, index) => {
      const item = {}
      item.id = index
      item.name = company[0]
      item.type = company[1] || null
      item.url = company[2] || null
      item.subcategory = company[3] || null
      item.parentCategorySlug = company[4] || null
      item.logo = company[49]
      item.description = company[6] || null
      item.crunchbase = company[7] || null
      item.linkedin = company[8] || null
      item.twitter = company[9] || null
      item.github = company[10] || null
      item.developerPortal = company[11] || null
      item.yearFounded = company[12] || null
      item.numberOfFounders = company[13] || null
      item.founderNames = company[14] || null
      item.headquartersCountry = company[15] || null
      item.headquartersCity = company[16] || null
      item.womanInManagement = company[17] || null
      item.nonWhitePeopleInManagement = company[18] || null
      item.headcount = company[19] || null
      item.numberOfPositionsVacantInPastYear = company[20] || null
      item.estimatedRevenueRange = company[21] || null
      item.knownIndustriesWorkingIn = company[22] || null
      item.industryGroups = company[23] || null
      item.numbersOfCustomers = company[24] || null
      item.customers = company[25] || null
      item.totalNumberOfNewProducFeaturesInLastYear = company[26] || null
      item.totalProductsActive = company[27] || null
      item.patentsGranted = company[28] || null
      item.acquisitions = company[29] || null
      item.numberOfAccreditationsEarned = company[30]
      item.securityIssues = company[31] || null
      item.privacySpecificFeaturesIncluded = company[32] || null
      item.privacyBreaches = company[33] || null
      item.knownPartnershipsApi = company[34] || null
      item.knownPartnershipsNonApi = company[35] || null
      item.monthlyWebsiteVisits = company[36] || null
      item.monthlyWebsiteVisitsGrowth = company[37] || null
      item.participationInApidays = company[38] || null
      item.activeTechCount = company[39] || null
      item.itSpend = company[40] || null
      item.stage = company[41] || null
      item.totalFunding = company[42] || null
      item.lastFundingDate = company[43] || null
      item.top5Investors = company[44] || null
      item.numberLeadOfLeadInvestors = company[45] || null
      item.numberOfInvestors = company[46] || null
      item.acquiredBy = company[47] || null
      item.acquisitionPrice = company[48] || null
      item.acquisitionType = company[49] || null
      item.ipoDate = company[50] || null
      item.moneyRaisedAtIpo = company[51] || null
      item.valuationAtIpo = company[52] || null
      item.logoApiIndustry = company[53] || null
      item.pricingModel = company[54] || null
      item.pricingPage = company[55] || null
      item.openSource = company[64] || null
      companyValues.values.push(item)
    })
    return companyValues
  } catch (err) {
    console.error(err)
  }
}

async function getCompany(sheet_id, companyName) {
  sheetValues.date = new Date()
  const authClient = await authorize()
  const request = await {
    spreadsheetId: sheet_id,
    range: "Sheet1!A2:AZ",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: authClient,
  }

  try {
    const response = (await sheets.spreadsheets.values.get(request)).data

    let companyValues = {}

    const allData = response.values

    const company = allData.filter((company, index) => {
      return company[0].toLowerCase() === companyName.toLowerCase()
    })[0]

    if (company === undefined) {
      companyValues.message = "No company found with that name, try again"
    } else {
      companyValues.name = company[0]
      companyValues.url = company[1] || null
      companyValues.cluster = company[4] || null
      companyValues.category = company[3] || null
      companyValues.subcategory = company[2] || null
      companyValues.description = company[6] || null
      companyValues.yearFounded = company[12] || null
      companyValues.founderNames = company[14] || null
      companyValues.headquartersCountry = company[15] || null
      companyValues.headquartersCity = company[16] || null
      companyValues.github = company[9] || null
      companyValues.linkedin = company[8] || null
      companyValues.womanInManagement = company[17] || null
      companyValues.nonWhitePeopleInManagement = company[18] || null
      companyValues.headcount = company[19] || null
      companyValues.stage = company[33] || null
      companyValues.totalFunding = company[34] || null
      companyValues.lastFunding = company[35] || null
      companyValues.ipoData = company[38] || null
      companyValues.moneyRaisedAtIpo = company[39] || null
      companyValues.ipoValuation = company[40] || null
      companyValues.acquisition = company[36] || null
      companyValues.activeProducts = company[20] || null
      companyValues.patentsGranted = company[21] || null
      companyValues.pricingModel = company[24] || null
      companyValues.pricingPage = company[25] || null
      companyValues.contentAddressingBanking = company[26] || null
      companyValues.contentAddressingHealth = company[27] || null
      companyValues.contentAddressingSustainability = company[28] || null
      companyValues.contentAddressingGovernment = company[29] || null
      companyValues.knownStandardsUsed = company[22] || null
      companyValues.privacySpecific = company[23] || null
      companyValues.knownPartnership = company[30] || null
      companyValues.ipoDate = company[38] || null
      companyValues.knownPartnershipNonAPI = company[32] || null
      companyValues.logo = company[49]
      companyValues.knownProtocolsUsed = company[50] || null
      companyValues.hasAIFeatures = company[51] || null
    }
    console.log(companyValues)

    return companyValues
  } catch (err) {
    console.error(err)
  }
}

async function getCompanyV4(companyName) {
  try {
    const allCompaniesData = await dbDataset.query(
      `SELECT
   MAX(entities."EntityName") AS name, 
    MAX(entities."EntityURL") AS url,
    STRING_AGG(DISTINCT taxonomy."Activity"::TEXT, ', ') AS "subcategory",
    STRING_AGG(DISTINCT category."Category"::TEXT, ', ') AS "category",
    STRING_AGG(DISTINCT clusters."Cluster"::TEXT, ', ') AS "cluster",
    STRING_AGG(DISTINCT apiprotocols."Protocol Name"::TEXT, ', ') AS "knownprotocolsused",
    entities."YearFounded" AS yearFounded,
    entities."EntityDescription" AS description,
    entities."HQLocation" AS headquartersCity,
    country."ISOCountryCode" AS isocountrycode, 
    entities."Headcount" AS headcount,
    entities."Total_Products" AS totalproducts,
    entities."Total Funding" AS totalfunding,
    CASE 
        WHEN entities."EntityLogo" IS NULL THEN NULL
        WHEN entities."EntityLogo"::TEXT = '' THEN NULL
        WHEN entities."EntityLogo"::TEXT ~ '^\s*\[.*\]\s*$' THEN entities."EntityLogo"::JSONB -> 0 ->> 'url'
        ELSE entities."EntityLogo"::JSONB -> 0 ->> 'url'
    END AS logo,
    entities."Founder_Names" AS foundernames,
    entities."LinkedInURL" AS linkedin,
    entities."GithubURL" AS github,
    entities."Stage__Seed" AS stage,
    entities."Last Funding Date" AS lastfunding,
    entities."IPODate" AS ipodate,
    entities."Raised IPO USD" AS moneyraisedatipo,
    entities."Valuation at IPO USD" AS ipovaluation,
    entities."AcquisitionDate" AS acquisitiondate,
    entities."Patents_Granted" AS patentsgranted,
    entities."Pricing model" AS pricingmodel,
    entities."PricingURL" AS pricingpage,
    entities."BankingFinanceURL" AS pageaboutbankingfinance,
    entities."HealthURL" AS pageabouthealth,
    entities."SustainabilityURL" AS pageaboutsustainability,
    entities."GovermentURL" AS pageaboutgovernment,
    entities."OpenSource" AS opensource,
    entities."AI Feature" AS hasaifeature,
    entities."Known standards" AS knownstandardused,
    entities."PrivacySpecifications" AS privacyfeatureshighlighted,
    entities."Known partnerships (AP)" AS KnownPartnershipsAPI,
    entities."Non API Partnership" AS KnownPartnershipsNonAPI,
    country."CountryName",
    STRING_AGG(DISTINCT related_entity."EntityName"::TEXT, ', ') AS "acquisition",
    STRING_AGG(DISTINCT entities_policies."PolicyName"::TEXT, ', ') AS "policies",
    CASE 
        WHEN STRING_AGG(DISTINCT entities_policies."PolicyName"::TEXT, ', ') LIKE '%Diverse Management%' 
        THEN TRUE
        ELSE FALSE
    END AS "diversemanagement",
    CASE 
        WHEN STRING_AGG(DISTINCT entities_policies."PolicyName"::TEXT, ', ') LIKE '%Women in Management%' 
        THEN TRUE
        ELSE FALSE
    END AS "womeninmanagement"
FROM
    schemacoredataset."Entities" entities
JOIN
    schemacoredataset."nc_18z6___nc_m2m_8s3nsqy17h" entities_taxonomy_connector ON entities."IdEntity" = entities_taxonomy_connector.table1_id
LEFT JOIN schemacoredataset."nc_18z6___nc_m2m_msbiwg2n44" entities_policy_connector ON entities."IdEntity" = entities_policy_connector."table1_id"
LEFT JOIN schemacoredataset."EntityPolicies" entities_policies ON entities_policy_connector."table2_id" = entities_policies."id"
LEFT JOIN schemacoredataset."Country" country ON entities."IdContry" = country."IdCountry" 
JOIN
    schemacoredataset."Taxonomy" taxonomy ON taxonomy."IdTaxonomy" = entities_taxonomy_connector.table2_id
JOIN
    schemacoredataset."Category" category ON taxonomy."Category" = category."IdCategory"
JOIN 
    schemacoredataset."Clusters" clusters ON clusters.id = category."Clusters_id"
LEFT JOIN schemacoredataset."nc_18z6___nc_m2m_x6f_bb2v88" entities_protocol_connector ON entities."IdEntity" = entities_protocol_connector."table2_id"
LEFT JOIN schemacoredataset."API Protocols" apiprotocols ON entities_protocol_connector."table1_id" = apiprotocols."id"
LEFT JOIN schemacoredataset."nc_18z6___nc_m2m_36u_a3m1xo" entity_relationship_connector ON entities."IdEntity" = entity_relationship_connector.table2_id
LEFT JOIN schemacoredataset."Entities" related_entity ON related_entity."IdEntity" = entity_relationship_connector.table1_id
WHERE
    entities."TypeEntity" = 'TT22' AND entities."DateClosure" IS null and entities."EntityName" = $1
GROUP BY
    entities."IdEntity", entities."EntityName", entities."EntityURL", 
    entities."YearFounded", entities."EntityDescription", entities."HQLocation", 
    entities."Headcount", entities."Total_Products", entities."Total Funding", 
    entities."EntityLogo", country."ISOCountryCode", country."CountryName",
    entities."Founder_Names", entities."LinkedInURL", entities."GithubURL", 
    entities."Stage__Seed", entities."Last Funding Date", entities."IPODate", 
    entities."Raised IPO USD", entities."Valuation at IPO USD", entities."AcquisitionDate", 
    entities."Patents_Granted", entities."Pricing model", entities."PricingURL", 
    entities."BankingFinanceURL", entities."HealthURL", entities."SustainabilityURL", 
    entities."GovermentURL", entities."OpenSource", entities."AI Feature", 
    entities."Known standards", entities."PrivacySpecifications", entities."Known partnerships (AP)", 
    entities."Non API Partnership" ,entities."YearFounded"
ORDER BY
    entities."IdEntity";`,
      [companyName]
    )
    const response = allCompaniesData.rows

    if (response.length === 0) {
      response.message = "No company found with that name, try again"
    } else {
      return response[0]
    }
  } catch (err) {
    console.error(err)
  }
}

async function getCompany_ai_1(companyName) {
  sheetValues.date = new Date()

  try {
    const allCompaniesData = await db.query(
      `select * from "ailandscape".apiprovidersmain where entityName='${companyName}'`
    )
    const response = allCompaniesData.rows
    console.log("response:", response[0])

    let companyValues = {}

    //const allData = response;

    //const company = allData.filter((company,index)=>{ return company[0].toLowerCase() === companyName.toLowerCase()})[0]

    if (response.length === 0) {
      companyValues.message = "No company found with that name, try again"
    } else {
      companyValues.name = response[0].entityname
      companyValues.url = response[0].entityhomepage || null
      companyValues.cluster = response[0].cluster || null
      companyValues.category = response[0].broadcategory || null
      companyValues.subcategory = response[0].subcategory || null
      companyValues.description = response[0].description || null
      companyValues.yearFounded = response[0].yearfounded || null
      companyValues.founderNames = response[0].foundernames || null
      companyValues.headquartersCountry =
        response[0].headquarterscountry || null
      companyValues.headquartersCity = response[0].headquarterscity || null
      companyValues.github = response[0].githuburl || null
      companyValues.linkedin = response[0].linkedinurl || null
      companyValues.womanInManagement = response[0].womeninmanagement || null
      companyValues.nonWhitePeopleInManagement =
        response[0].diversemanagement || null
      companyValues.headcount = response[0].headcount || null
      companyValues.stage = response[0].stage || null
      companyValues.totalFunding = response[0].totalfunding || null
      companyValues.lastFunding = response[0].lastfundingdate || null
      companyValues.ipoData = response[0].ipodate || null
      companyValues.moneyRaisedAtIpo = response[0].moneyraisedatipo || null
      companyValues.ipoValuation = response[0].valuationatipo || null
      companyValues.acquisition = response[0].acquisitions || null
      companyValues.activeProducts = response[0].totalproducts || null
      companyValues.patentsGranted = response[0].patentsgranted || null
      companyValues.pricingModel = response[0].pricingmodel || null
      companyValues.pricingPage = response[0].pricingpage || null
      companyValues.contentAddressingBanking =
        response[0].pageaboutbankingfinance || null
      companyValues.contentAddressingHealth =
        response[0].pageabouthealth || null
      companyValues.contentAddressingSustainability =
        response[0].pageaboutsustainability || null
      companyValues.contentAddressingGovernment =
        response[0].pageaboutgovernment || null
      companyValues.knownStandardsUsed = response[0].knownstandardsused || null
      companyValues.privacySpecific =
        response[0].privacyfeatureshighlighted || null
      companyValues.knownPartnership = response[0].knownpartnershipsapi || null
      companyValues.ipoDate = response[0].ipodate || null
      companyValues.knownPartnershipNonAPI =
        response[0].knownpartnershipsnonapi || null
      companyValues.logo = response[0].logo_do
      companyValues.knownProtocolsUsed = response[0].protocols || null
      companyValues.hasAIFeatures = response[0].hasaifeatures || null
      companyValues.opensource = response[0].opensource || null
    }
    console.log(companyValues)

    return companyValues
  } catch (err) {
    console.error(err)
  }
}

async function getCompany_ai_2(companyName) {
  sheetValues.date = new Date()

  try {
    const allCompaniesData = await dbDataset.query(
      `SELECT
   MAX(entities."EntityName") AS name, 
    MAX(entities."EntityURL") AS url,
    STRING_AGG(DISTINCT taxonomy."Activity"::TEXT, ', ') AS "subcategory",
    STRING_AGG(DISTINCT category."Category"::TEXT, ', ') AS "category",
    STRING_AGG(DISTINCT clusters."Cluster"::TEXT, ', ') AS "cluster",
    STRING_AGG(DISTINCT apiprotocols."Protocol Name"::TEXT, ', ') AS "knownprotocolsused",
    entities."YearFounded" AS yearFounded,
    entities."EntityDescription" AS description,
    entities."HQLocation" AS headquartersCity,
    country."ISOCountryCode" AS isocountrycode, 
    entities."Headcount" AS headcount,
    entities."Total_Products" AS totalproducts,
    entities."Total Funding" AS totalfunding,
    CASE 
         WHEN entities."EntityLogo" IS NULL THEN NULL
        WHEN entities."EntityLogo"::TEXT = '' THEN NULL
        WHEN entities."EntityLogo"::TEXT ~ '^\s*\[.*\]\s*$' THEN entities."EntityLogo"::JSONB -> 0 ->> 'url'
        ELSE entities."EntityLogo"::JSONB -> 0 ->> 'url'
    END AS logo,
    entities."Founder_Names" AS foundernames,
    entities."LinkedInURL" AS linkedin,
    entities."GithubURL" AS github,
    entities."Stage__Seed" AS stage,
    entities."Last Funding Date" AS lastfunding,
    entities."IPODate" AS ipodate,
    entities."Raised IPO USD" AS moneyraisedatipo,
    entities."Valuation at IPO USD" AS ipovaluation,
    entities."AcquisitionDate" AS acquisitiondate,
    entities."Patents_Granted" AS patentsgranted,
    entities."Pricing model" AS pricingmodel,
    entities."PricingURL" AS pricingpage,
    entities."BankingFinanceURL" AS pageaboutbankingfinance,
    entities."HealthURL" AS pageabouthealth,
    entities."SustainabilityURL" AS pageaboutsustainability,
    entities."GovermentURL" AS pageaboutgovernment,
    entities."OpenSource" AS opensource,
    entities."AI Feature" AS hasaifeature,
    entities."Known standards" AS knownstandardused,
    entities."PrivacySpecifications" AS privacyfeatureshighlighted,
    entities."Known partnerships (AP)" AS KnownPartnershipsAPI,
    entities."Non API Partnership" AS KnownPartnershipsNonAPI,
    country."CountryName",
    STRING_AGG(DISTINCT related_entity."EntityName"::TEXT, ', ') AS "acquisition",
    STRING_AGG(DISTINCT entities_policies."PolicyName"::TEXT, ', ') AS "policies",
    CASE 
        WHEN STRING_AGG(DISTINCT entities_policies."PolicyName"::TEXT, ', ') LIKE '%Diverse Management%' 
        THEN TRUE
        ELSE FALSE
    END AS "diversemanagement",
    CASE 
        WHEN STRING_AGG(DISTINCT entities_policies."PolicyName"::TEXT, ', ') LIKE '%Women in Management%' 
        THEN TRUE
        ELSE FALSE
    END AS "womeninmanagement"
FROM
    schemacoredataset."Entities" entities
JOIN
    schemacoredataset."nc_18z6___nc_m2m_8s3nsqy17h" entities_taxonomy_connector ON entities."IdEntity" = entities_taxonomy_connector.table1_id
LEFT JOIN schemacoredataset."nc_18z6___nc_m2m_msbiwg2n44" entities_policy_connector ON entities."IdEntity" = entities_policy_connector."table1_id"
LEFT JOIN schemacoredataset."EntityPolicies" entities_policies ON entities_policy_connector."table2_id" = entities_policies."id"
LEFT JOIN schemacoredataset."Country" country ON entities."IdContry" = country."IdCountry" 
JOIN
    schemacoredataset."Taxonomy" taxonomy ON taxonomy."IdTaxonomy" = entities_taxonomy_connector.table2_id
JOIN
    schemacoredataset."Category" category ON taxonomy."Category" = category."IdCategory"
JOIN 
    schemacoredataset."Clusters" clusters ON clusters.id = category."Clusters_id"
LEFT JOIN schemacoredataset."nc_18z6___nc_m2m_x6f_bb2v88" entities_protocol_connector ON entities."IdEntity" = entities_protocol_connector."table2_id"
LEFT JOIN schemacoredataset."API Protocols" apiprotocols ON entities_protocol_connector."table1_id" = apiprotocols."id"
LEFT JOIN schemacoredataset."nc_18z6___nc_m2m_36u_a3m1xo" entity_relationship_connector ON entities."IdEntity" = entity_relationship_connector.table2_id
LEFT JOIN schemacoredataset."Entities" related_entity ON related_entity."IdEntity" = entity_relationship_connector.table1_id
WHERE
    entities."TypeEntity" = 'TT22' AND entities."DateClosure" IS null and entities."EntityName" = $1
GROUP BY
    entities."IdEntity", entities."EntityName", entities."EntityURL", 
    entities."YearFounded", entities."EntityDescription", entities."HQLocation", 
    entities."Headcount", entities."Total_Products", entities."Total Funding", 
    entities."EntityLogo", country."ISOCountryCode", country."CountryName",
    entities."Founder_Names", entities."LinkedInURL", entities."GithubURL", 
    entities."Stage__Seed", entities."Last Funding Date", entities."IPODate", 
    entities."Raised IPO USD", entities."Valuation at IPO USD", entities."AcquisitionDate", 
    entities."Patents_Granted", entities."Pricing model", entities."PricingURL", 
    entities."BankingFinanceURL", entities."HealthURL", entities."SustainabilityURL", 
    entities."GovermentURL", entities."OpenSource", entities."AI Feature", 
    entities."Known standards", entities."PrivacySpecifications", entities."Known partnerships (AP)", 
    entities."Non API Partnership" ,entities."YearFounded"
ORDER BY
    entities."IdEntity";`,
      [companyName]
    )
    const response = allCompaniesData.rows

    if (response.length === 0) {
      response.message = "No company found with that name, try again"
    } else {
      return response[0]
    }
  } catch (err) {
    console.error(err)
  }
}

async function main_v4() {
  sheetValues.date = new Date()

  try {
    const allCompaniesData = await dbDataset.query(`SELECT
    entities."EntityName" AS name,
    entities."EntityURL" AS url,
    STRING_AGG(DISTINCT taxonomy."Activity"::TEXT, ', ') AS "subcategory",
    STRING_AGG(DISTINCT category."Category"::TEXT, ', ') AS "category",
    STRING_AGG(DISTINCT clusters."Cluster"::TEXT, ', ') AS "cluster",
    entities."YearFounded" as yearfounded,
    entities."EntityDescription" as entitydescription,
    entities."HQLocation" as hqlocation,
    country."ISOCountryCode" as isocountrycode, 
    entities."Headcount" AS headcount,
    entities."Total_Products" AS totalproducts,
    entities."Total Funding" AS totalfunding,
    CASE 
        WHEN entities."EntityLogo" IS NULL THEN NULL
        WHEN entities."EntityLogo"::TEXT = '' THEN NULL
        WHEN entities."EntityLogo"::TEXT !~ '^\\s*[\\[\\{]' THEN entities."EntityLogo"::TEXT
        ELSE (
            CASE 
                WHEN entities."EntityLogo"::TEXT ~ '^\\s*\\[' THEN
                    COALESCE((entities."EntityLogo"::JSONB -> 0 ->> 'url'), NULL)
                ELSE 
                    COALESCE((entities."EntityLogo"::JSONB ->> 'url'), NULL)
            END
        )
    END AS logo,
    STRING_AGG(DISTINCT entities_policies."PolicyName"::TEXT, ', ') AS "policies",
    CASE 
        WHEN STRING_AGG(entities_policies."PolicyName"::TEXT, ', ') LIKE '%Diverse Management%' 
        THEN TRUE
        ELSE FALSE
    END AS "diversemanagement",
    CASE 
        WHEN STRING_AGG(entities_policies."PolicyName"::TEXT, ', ') LIKE '%Women in Management%' 
        THEN TRUE
        ELSE FALSE
    END AS "womeninmanagement"
FROM
    schemacoredataset."Entities" entities
JOIN
    schemacoredataset."nc_18z6___nc_m2m_8s3nsqy17h" entities_taxonomy_connector ON entities."IdEntity" = entities_taxonomy_connector.table1_id
LEFT JOIN schemacoredataset."nc_18z6___nc_m2m_msbiwg2n44" entities_policy_connector ON entities."IdEntity" = entities_policy_connector."table1_id"
LEFT JOIN schemacoredataset."EntityPolicies" entities_policies ON entities_policy_connector."table2_id" = entities_policies."id"
LEFT JOIN schemacoredataset."Country" country ON entities."IdContry" = country."IdCountry" -- Changed to LEFT JOIN for safety
JOIN
    schemacoredataset."Taxonomy" taxonomy ON taxonomy."IdTaxonomy" = entities_taxonomy_connector.table2_id
JOIN
    schemacoredataset."Category" category ON taxonomy."Category" = category."IdCategory"
JOIN 
    schemacoredataset."Clusters" clusters ON clusters.id = category."Clusters_id"    
WHERE
    entities."TypeEntity" = 'TT22' AND entities."DateClosure" IS NULL
GROUP BY
    entities."IdEntity", entities."EntityName", entities."EntityURL", 
    entities."YearFounded", entities."EntityDescription", entities."HQLocation", 
    entities."Headcount", entities."Total_Products", entities."Total Funding", 
    entities."EntityLogo", country."ISOCountryCode" -- List all non-aggregated columns explicitly
ORDER BY
    entities."IdEntity";`)
    const response = allCompaniesData.rows

    return { values: response, message: "Success" }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  main_v2,
  main_v3,
  main_v4,
  getCompanies,
  getCompany,
  getCompanyV4,
  main_ai_v1,
  main_ai_v2,
  getCompany_ai_1,
  getCompany_ai_2,
}
