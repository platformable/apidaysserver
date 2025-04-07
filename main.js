require("dotenv").config()

const express = require("express")
const app = express()

app.listen(process.env.PORT || 5500, () => {
  console.log(`app listening`)
})
const { generateAccessToken, validateJwt } = require("./middlewares/auth")

const { google } = require("googleapis")
const sheets = google.sheets("v4")

const newrelic = require("newrelic")

newrelic.instrumentLoadedModule(
  "express", // the module's name, as a string
  express // the module instance
)

const companiesData = require("./utils/v2/companiesFunctions")
const clusterData = require("./utils/v2/clustersCategoriesSubcategories")

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

async function main(sheet_id) {
  sheetValues.date = new Date()
  const authClient = await authorize()
  const request = await {
    spreadsheetId: sheet_id,
    range: "Sheet1!A2:BM",
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
      item.parentCategorySlug = company[4] || null
      item.logo = company[5]
      item.subcategory = company[3] || null
      item.description = company[6] || null
      item.yearFounded = company[12] || null
      item.headquartersCountry = company[15] || null
      item.headquartersCity = company[16] || null
      item.womanInManagement = company[17] || null
      item.nonWhitePeopleInManagement = company[18] || null
      item.headcount = company[19] || null
      item.numbersOfCustomers = company[24] || null
      item.customers = company[25] || null
      item.totalFunding = company[42] || null
      sheetValues.values.push(item)
    })
  } catch (err) {
    console.error(err)
  }
}

main(process.env.NEXT_PUBLIC_SHEET_ID)

async function getCompanies(sheet_id) {
  sheetValues.date = new Date()
  const authClient = await authorize()
  const request = await {
    spreadsheetId: sheet_id,
    range: "Sheet1!A2:BM",
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
      item.logo = company[5]
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
      item.blogQ12021 = company[56] || null
      item.blogQ22021 = company[57] || null
      item.blogQ32021 = company[58] || null
      item.blogQ42021 = company[59] || null
      item.apidays2018 = company[60] || null
      item.apidays2019 = company[61] || null
      item.apidays2020 = company[62] || null
      item.apidays2021 = company[63] || null
      item.openSource = company[64] || null
      companyValues.values.push(item)
    })
  } catch (err) {
    console.error(err)
  }
}

getCompanies(process.env.NEXT_PUBLIC_SHEET_ID)

async function authorize() {
  let authClient = await process.env.NEXT_PUBLIC_GOOGLE_KEY
  if (authClient == null) {
    throw Error("authentication failed")
  }
  return authClient
}

app.get("/", async function (req, res) {
  try {
    await main(process.env.NEXT_PUBLIC_SHEET_ID)
    res.status(200).send(sheetValues)
  } catch (error) {
    console.log("error", error)
    res.send({ errorMessage: "An error ocurred, please try again" })
  }
})

app.get("/companies", async function (req, res) {
  try {
    await getCompanies(process.NEXT_PUBLIC_SHEET_ID)
    res.status(200).send(companyValues)
  } catch (error) {
    console.log("error", error)
    res.send({
      errorMessage:
        "An error ocurred while fetching companies, please try again",
    })
  }
})

app.get("/v2/companies", validateJwt, async (req, res) => {
  try {
    const data = await companiesData.main_v2(
      process.env.NEXT_PUBLIC_SHEET_ID_2023
    )
    res.send(data)
  } catch (error) {
    console.log("error", error)
    res.send({ errorMessage: "An error ocurred, company" })
  }
})

app.get("/v2/companies/:company", validateJwt, async (req, res) => {
  const company = req.params.company
  try {
    const data = await companiesData.getCompany(
      process.env.NEXT_PUBLIC_SHEET_ID_2023,
      company.toLocaleLowerCase()
    )
    res.send(data)
  } catch (error) {
    console.log("error", error)
    res.send({ errorMessage: "An error ocurred, company" })
  }
})

app.get("/v2/clusters/", validateJwt, async (req, res) => {
  try {
    const data = await clusterData.getClustersData(
      process.env.NEXT_PUBLIC_SHEET_ID_2023
    )
    res.send(data)
  } catch (error) {
    console.log("error", error)
    res.send({ errorMessage: "An error ocurred, company" })
  }
})

app.get("/v3/companies", validateJwt, async (req, res) => {
  console.log("/v3/companies")
  try {
    const data = await companiesData.main_v3()
    res.send(data)
  } catch (e) {
    res.send({ message: "an error occurred", statusText: "Fail" }).status(500)
  }
})

app.get("/v3/companies/:company", validateJwt, async (req, res) => {
  const company = req.params.company
  try {
    const data = await companiesData.getCompanyV3(company)
    res.send(data)
  } catch (error) {
    console.log("error", error)
    res.send({ errorMessage: "An error ocurred, company" })
  }
})

app.get("/ailandscape/companies", validateJwt, async (req, res) => {
  console.log("/ailandscape/companies")
  try {
    const data = await companiesData.main_ai_v1()
    res.send(data)
  } catch (e) {
    res.send({ message: "an error occurred", statusText: "Fail" }).status(500)
  }
})

/* V2 */
