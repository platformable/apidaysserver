require("dotenv").config();
const { google } = require("googleapis");
const sheets = google.sheets("v4");

const sheetValues = {
  date: "",
  values: [],
  categories: [],
};

const companyValues = {
  date: "",
  values: [],
  categories: [],
};

async function authorize() {
  let authClient = await process.env.NEXT_PUBLIC_GOOGLE_KEY;
  if (authClient == null) {
    throw Error("authentication failed");
  }
  return authClient;
}

async function main_v2() {

    sheetValues.date = new Date();
    const authClient = await authorize();
    const request = await {
      spreadsheetId: process.env.NEXT_PUBLIC_SHEET_ID_2023,
      range: "Sheet1!A2:BM",
      valueRenderOption: "FORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
      auth: authClient,
    };
  
    try {
      const response = (await sheets.spreadsheets.values.get(request)).data;
      
      sheetValues.categories = [];
      sheetValues.values = [];
      const allData = response.values;
      allData.forEach((company, index) => {
        const item = {};
        item.id = index;
        item.name = company[0];
        item.cluster = company[4] || null;
        item.category= company[3] || null
        item.subcategory = company[2] || null;
        item.description = company[6] || null;
        item.yearFounded = company[12] || null;
        item.headquartersCountry = company[15] || null;
        item.headquartersCity = company[16] || null;
        item.womanInManagement = company[17] || null;
        item.nonWhitePeopleInManagement = company[18] || null;
        item.headcount = company[19] || null;
        item.totalFunding = company[34] || null;
        item.logo = company[5];
        sheetValues.values.push(item);
      });
      return sheetValues
    } catch (err) {
      console.error(err);
    }
  }






  async function getCompanies(sheet_id) {
    sheetValues.date = new Date();
    const authClient = await authorize();
    const request = await {
      spreadsheetId: sheet_id,
      range: "Sheet1!A2:BM",
      valueRenderOption: "FORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
      auth: authClient,
    };
  
    try {
      const response = (await sheets.spreadsheets.values.get(request)).data;
  
      companyValues.categories = [];
      companyValues.values = [];
      const allData = response.values;
      allData.forEach((company, index) => {
        const item = {};
        item.id = index;
        item.name = company[0];
        item.type = company[1] || null;
        item.url = company[2] || null;
        item.subcategory = company[3] || null;
        item.parentCategorySlug = company[4] || null;
        item.logo = company[5];
        item.description = company[6] || null;
        item.crunchbase = company[7] || null;
        item.linkedin = company[8] || null;
        item.twitter = company[9] || null;
        item.github = company[10] || null;
        item.developerPortal = company[11] || null;
        item.yearFounded = company[12] || null;
        item.numberOfFounders = company[13] || null;
        item.founderNames = company[14] || null;
        item.headquartersCountry = company[15] || null;
        item.headquartersCity = company[16] || null;
        item.womanInManagement = company[17] || null;
        item.nonWhitePeopleInManagement = company[18] || null;
        item.headcount = company[19] || null;
        item.numberOfPositionsVacantInPastYear = company[20] || null;
        item.estimatedRevenueRange = company[21] || null;
        item.knownIndustriesWorkingIn = company[22] || null;
        item.industryGroups = company[23] || null;
        item.numbersOfCustomers = company[24] || null;
        item.customers = company[25] || null;
        item.totalNumberOfNewProducFeaturesInLastYear = company[26] || null;
        item.totalProductsActive = company[27] || null;
        item.patentsGranted = company[28] || null;
        item.acquisitions = company[29] || null;
        item.numberOfAccreditationsEarned = company[30];
        item.securityIssues = company[31] || null;
        item.privacySpecificFeaturesIncluded = company[32] || null;
        item.privacyBreaches = company[33] || null;
        item.knownPartnershipsApi = company[34] || null;
        item.knownPartnershipsNonApi = company[35] || null;
        item.monthlyWebsiteVisits = company[36] || null;
        item.monthlyWebsiteVisitsGrowth = company[37] || null;
        item.participationInApidays = company[38] || null;
        item.activeTechCount = company[39] || null;
        item.itSpend = company[40] || null;
        item.stage = company[41] || null;
        item.totalFunding = company[42] || null;
        item.lastFundingDate = company[43] || null;
        item.top5Investors = company[44] || null;
        item.numberLeadOfLeadInvestors = company[45] || null;
        item.numberOfInvestors = company[46] || null;
        item.acquiredBy = company[47] || null;
        item.acquisitionPrice = company[48] || null;
        item.acquisitionType = company[49] || null;
        item.ipoDate = company[50] || null;
        item.moneyRaisedAtIpo = company[51] || null;
        item.valuationAtIpo = company[52] || null;
        item.logoApiIndustry = company[53] || null;
        item.pricingModel = company[54] || null;
        item.pricingPage = company[55] || null;
        item.blogQ12021 = company[56] || null;
        item.blogQ22021 = company[57] || null;
        item.blogQ32021 = company[58] || null;
        item.blogQ42021 = company[59] || null;
        item.apidays2018 = company[60] || null;
        item.apidays2019 = company[61] || null;
        item.apidays2020 = company[62] || null;
        item.apidays2021 = company[63] || null;
        item.openSource = company[64] || null;
        companyValues.values.push(item);
      });
      return companyValues
    } catch (err) {
      console.error(err);
    }
  }




  async function getCompany(sheet_id,companyName) {
    sheetValues.date = new Date();
    const authClient = await authorize();
    const request = await {
      spreadsheetId: sheet_id,
      range: "Sheet1!A2:BM",
      valueRenderOption: "FORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
      auth: authClient,
    };
  
    try {
      const response = (await sheets.spreadsheets.values.get(request)).data;
  
      let companyValues={}
      
      const allData = response.values;
      
      const company = allData.filter((company,index)=>{ return company[0].toLowerCase() === companyName.toLowerCase()})[0]
      console.log("Company",company)
      if(company===undefined){
        companyValues.message="No company found with that name, try again"
      } else {

        companyValues.name = company[0] || null;
        companyValues.type = company[1] || null;
        companyValues.url = company[2] || null;
        companyValues.subcategory = company[3] || null;
        companyValues.parentCategorySlug = company[4] || null;
        companyValues.logo = company[5] || null;
        companyValues.description = company[6] || null;
        companyValues.crunchbase = company[7] || null;
        companyValues.linkedin = company[8] || null;
        companyValues.twitter = company[9] || null;
        companyValues.github = company[10] || null;
        companyValues.developerPortal = company[11] || null;
        companyValues.yearFounded = company[12] || null;
        companyValues.numberOfFounders = company[13] || null;
        companyValues.founderNames = company[14] || null;
        companyValues.headquartersCountry = company[15] || null;
        companyValues.headquartersCity = company[16] || null;
        companyValues.womanInManagement = company[17] || null;
        companyValues.nonWhitePeopleInManagement = company[18] || null;
        companyValues.headcount = company[19] || null;
        companyValues.numberOfPositionsVacantInPastYear = company[20] || null;
        companyValues.estimatedRevenueRange = company[21] || null;
        companyValues.knownIndustriesWorkingIn = company[22] || null;
        companyValues.industryGroups = company[23] || null;
        companyValues.numbersOfCustomers = company[24] || null;
        companyValues.customers = company[25] || null;
        companyValues.totalNumberOfNewProducFeaturesInLastYear = company[26] || null;
        companyValues.totalProductsActive = company[27] || null;
        companyValues.patentsGranted = company[28] || null;
        companyValues.acquisitions = company[29] || null;
        companyValues.numberOfAccreditationsEarned = company[30];
        companyValues.securityIssues = company[31] || null;
        companyValues.privacySpecificFeaturesIncluded = company[32] || null;
        companyValues.privacyBreaches = company[33] || null;
        companyValues.knownPartnershipsApi = company[34] || null;
        companyValues.knownPartnershipsNonApi = company[35] || null;
        companyValues.monthlyWebsiteVisits = company[36] || null;
        companyValues.monthlyWebsiteVisitsGrowth = company[37] || null;
        companyValues.participationInApidays = company[38] || null;
        companyValues.activeTechCount = company[39] || null;
        companyValues.itSpend = company[40] || null;
        companyValues.stage = company[41] || null;
        companyValues.totalFunding = company[42] || null;
        companyValues.lastFundingDate = company[43] || null;
        companyValues.top5Investors = company[44] || null;
        companyValues.numberLeadOfLeadInvestors = company[45] || null;
        companyValues.numberOfInvestors = company[46] || null;
        companyValues.acquiredBy = company[47] || null;
        companyValues.acquisitionPrice = company[48] || null;
        companyValues.acquisitionType = company[49] || null;
        companyValues.ipoDate = company[50] || null;
        companyValues.moneyRaisedAtIpo = company[51] || null;
        companyValues.valuationAtIpo = company[52] || null;
        companyValues.logoApiIndustry = company[53] || null;
        companyValues.pricingModel = company[54] || null;
        companyValues.pricingPage = company[55] || null;
        companyValues.blogQ12021 = company[56] || null;
        companyValues.blogQ22021 = company[57] || null;
        companyValues.blogQ32021 = company[58] || null;
        companyValues.blogQ42021 = company[59] || null;
        companyValues.apidays2018 = company[60] || null;
        companyValues.apidays2019 = company[61] || null;
        companyValues.apidays2020 = company[62] || null;
        companyValues.apidays2021 = company[63] || null;
        companyValues.openSource = company[64] || null;
      }
      
        
      return companyValues
    } catch (err) {
      console.error(err);
    }
  }

  module.exports = {
    main_v2,
    getCompanies,
    getCompany
  }